import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map, withLatestFrom, filter, combineLatest } from 'rxjs';

import { CgcGenes } from '../models/annotation-dto';
import { CgcGeneInfo, DisplayNode, DisplayVariant } from '../models/models';
import { Aggregate, Cluster, Sample, Tree } from '../models/pipeline-dto';
import * as amlTree from './test.json';
import * as cgcGenes from './cgc_genes.json';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  $aggregate = new BehaviorSubject<Aggregate>(amlTree as Aggregate);

  rootColor = '#90959B';
  clusterColors = ['#173858', '#2A5E72', '#C9C943', '#E89680', '#B26799', '#7524A1'];

  constructor(private selectionService: SelectionService) {
    // auto-select first tumor sample and first tree
    this.getAggregate().subscribe(aggregate => {
      const tumorSamples = aggregate.samples.filter(sample => sample.type === 'tumor');
      if (tumorSamples.length > 0) {
        this.selectionService.setSample(tumorSamples[0]);
      }
      this.selectionService.setTree(aggregate.trees[0]);
    });
  }

  getAggregate(): Observable<Aggregate> {
    return this.$aggregate.asObservable();
  }

  // map keys are gene symbols in all caps
  getCgcGenes(): Observable<Map<string, CgcGeneInfo>> {
    return of(cgcGenes as CgcGenes).pipe(
      map(raw => {
        const returnVal = new Map<string, CgcGeneInfo>();
        Object.entries(raw).forEach(([geneSymbol, rawInfo]) => {
          returnVal.set(geneSymbol.toUpperCase(), {
            isHallmark: rawInfo.Hallmark === 'Yes',
            somaticTumorTypes: rawInfo['Tumour Types(Somatic)'] ? rawInfo['Tumour Types(Somatic)'] : [],
            tier: rawInfo.Tier !== undefined ? rawInfo.Tier : null,
            entrezGeneId: rawInfo['Entrez GeneId'] !== undefined ? rawInfo['Entrez GeneId'] : null
          });
        });
        return returnVal;
      })
    );
  }

  getSamples(): Observable<Sample[]> {
    return this.getAggregate().pipe(
      map(aggregate => aggregate.samples)
    );
  }

  getTrees(): Observable<Tree[]> {
    return this.getAggregate().pipe(
      map(aggregate => aggregate.trees)
    );
  }

  getClusterIdToCluster(): Observable<Map<number, Cluster>> {
    return this.getAggregate().pipe(
      map(aggregate => new Map<number, Cluster>(aggregate.clusters.map(cluster => [cluster.cluster_id, cluster])))
    );
  }

  getClusterIds(): Observable<number[]> {
    return this.getClusterIdToCluster().pipe(
      map(clusterIdToCluster => [...clusterIdToCluster.keys()].sort((a, b) => a - b)
      )
    );
  }

  getClusterColorMapping(): Observable<Map<number, string>> {
    return this.getClusterIds().pipe(
      map(clusterIds => new Map<number, string>(
        clusterIds.map((id, index) => [id, this.clusterColors[index]])
      ))
    );
  }

  getLegendSamples(): Observable<LegendSample[]> {
    return this.selectionService.getTree().pipe(
      withLatestFrom(this.getAggregate(), this.getClusterIds()),
      filter(([tree, aggregate, clusterIds]) => tree !== null),
      map(([tree, aggregate, clusterIds]) => {
        const returnVal: LegendSample[] = [];
        // an array of all the samples
        const tumorSamples = aggregate.samples.filter(sample => sample.type === 'tumor');
        // a map from clusterId and sampleId to prevalence
        const clusterIdAndSampleIdToPrevalance = new Map<string, number>();
        tree!.nodes.forEach(node => {
          if (node.cluster_id !== undefined && node.cluster_id !== null) {
            node.prevalence.forEach(samplePrevalance => {
              clusterIdAndSampleIdToPrevalance.set(node.cluster_id! + '-' + samplePrevalance.sample_id, samplePrevalance.value);
            });
          }
        });
        tumorSamples.forEach(sample => {
          returnVal.push({
            sample,
            nodes: clusterIds.map((clusterId, index) => ({
              color: this.clusterColors[index],
              proportion: clusterIdAndSampleIdToPrevalance.get(clusterId + '-' + sample.sample_id) || 0
            }))
          });
        });
        return returnVal;
      })
    );
  }

  getRootDisplayNode(): Observable<DisplayNode|null> {
    return combineLatest([
      this.selectionService.getTree(),
      this.selectionService.getSample(),
      this.getAggregate(),
      this.getClusterColorMapping()
    ]).pipe(
      filter(([tree, sample, aggregate, colorMapping]) => tree !== null && sample !== null),
      map(([tree, sample, aggregate, colorMapping]) => {
        // map from cluster id to cluster, limited to clusters for this sample
        const sampleClusterIdToCluster = new Map<number, Cluster>(
          aggregate.clusters
            .filter(cluster => cluster.sample_id === sample?.sample_id)
            .map(cluster => [cluster.cluster_id, cluster])
        );
        // map from node name to DisplayNode
        // DisplayNode objects won't be complete yet; we'll continue below
        const nodeNameToDisplayNode = new Map<string, DisplayNode>(
          tree!.nodes.map(node => [node.node_name, {
            cluster_id: node.cluster_id,
            cluster: node.cluster_id !== undefined ? sampleClusterIdToCluster.get(node!.cluster_id) : undefined,
            color: this.rootColor, // we'll update this below
            node_name: node.cluster_id !== undefined ? 'Cluster ' + node.cluster_id : 'Root',
            prevalence: node.prevalence.find(prev => prev.sample_id === sample?.sample_id)?.value || 0,
            children: [], // we'll populate this below
            childClusterNodeNames: node.children, // we'll use this to populate children below
            parent: null, // we'll populate this below
            aggregateClusterIds: [], // we'll populate this below
            descendedClusterIds: [], // we'll populate this below
            level: 0 // we'll populate this below
          }])
        );
        // keep track of the nodes found at each level (depth) of the tree; root = level 0
        const levelToNodes = new Map<number, DisplayNode[]>();
        // patchNode handles the first pass over the tree
        // it populates the node parent, color, level, children (which will be revised again), aggregateClusterIds, and descendedClusterIds
        // it also appends to levelToNodes
        const patchNode = (node: DisplayNode, parent: DisplayNode|null, level: number) => {
          node.parent = parent;
          // note we assigned the root node's color above
          if (node.cluster_id !== undefined) {
            node.color = colorMapping.get(node.cluster_id)!;
          }
          node.level = level;
          if (!levelToNodes.has(level)) {
            levelToNodes.set(level, []);
          }
          levelToNodes.get(level)!.push(node);
          if (parent && node.cluster_id !== undefined) {
            node.aggregateClusterIds = [...parent.aggregateClusterIds, node.cluster_id!];
            let ancestor: DisplayNode|null = parent;
            while (ancestor) {
              ancestor.descendedClusterIds.push(node.cluster_id);
              ancestor = ancestor.parent;
            }
          }
          node.children = node.childClusterNodeNames.map(childClusterNodeName => nodeNameToDisplayNode.get(childClusterNodeName)!);
          node.children.forEach(child => patchNode(child, node, level + 1));
        };
        const rootNode = nodeNameToDisplayNode.get('*')!;
        patchNode(rootNode, null, 0);
        // now traverse the tree again inserting subtree nodes
        const insertSubtrees = (node: DisplayNode) => {
          if (!node.cluster) { // we don't insert subtrees on subclones
            const newSubtreeNodes: DisplayNode[] = [];
            node.children.forEach(child => {
              child.children.forEach(grandchild => {
                // create a name for this subtree; note this is crude
                let nodeName = 'Subtree ' + grandchild.cluster_id + (grandchild.descendedClusterIds.length ? ',' + grandchild.descendedClusterIds.join(',') : '');
                // create subtree node that will be a sibling of `child`
                const subtreeNode: DisplayNode = {
                  cluster_id: undefined, // subtree node has no cluster
                  cluster: undefined, // subtree node has no cluster
                  color: child.color, // same color as `child`, because it represents a subpopulation derived from `child`
                  node_name: nodeName,
                  prevalence: grandchild.prevalence,
                  children: [grandchild],
                  childClusterNodeNames: [grandchild.node_name],
                  parent: node,
                  aggregateClusterIds: child.aggregateClusterIds, // same as `child`, because at this level in the tree it represents the same evolution as `child`
                  descendedClusterIds: child.descendedClusterIds, // same as `child`, for same reason as above
                  level: child.level
                };
                // attach grandchild to subtree node
                grandchild.parent = subtreeNode;
                newSubtreeNodes.push(subtreeNode);
                levelToNodes.get(subtreeNode.level)!.push(subtreeNode);
              });
              // clear child.children, because they're now all represented with sibling subtree nodes
              child.children = [];
            });
            node.children = [...node.children, ...newSubtreeNodes];
            newSubtreeNodes.forEach(node => insertSubtrees(node));
          }
        };
        insertSubtrees(rootNode);
        // now walk up the tree, level by level, updating the prevalence values
        const treeLevels = [...levelToNodes.keys()].sort((a, b) => b - a);
        treeLevels.forEach(level => {
          const levelNodes = levelToNodes.get(level)!;
          levelNodes.forEach(node => {
            if (!node.cluster) { // only need to update prevalence on subtree nodes
              node.prevalence = node.children.map(child => child.prevalence).reduce((acc, curr) => acc + curr, 0);
            }
          });
        });
        return rootNode;
      })
    );
  }

  getSnvIdToDisplayVariant(): Observable<Map<number, DisplayVariant>> {
    return combineLatest([
      this.getAggregate(),
      this.getCgcGenes()
    ]).pipe(
      map(([aggregate, cgcGenes]) => new Map<number, DisplayVariant>(aggregate.SNV.map(snv => [snv.SNV_id, {
        ...snv,
        cgcGeneInfo: snv.symbol && cgcGenes.has(snv.symbol.toUpperCase()) ? cgcGenes.get(snv.symbol.toUpperCase()) : null
      } as DisplayVariant])))
    );
  }
}

export interface LegendSample {
  sample: Sample;
  nodes: LegendNode[];
}

export interface LegendNode {
  color: string;
  proportion: number;
}
