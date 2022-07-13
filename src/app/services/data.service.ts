import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, combineLatest, BehaviorSubject, filter, map, Observable, of, switchMap } from 'rxjs';

import Ajv, { JSONSchemaType } from 'ajv';

import { CgcGenes, ConsequenceSeverities, DrugInfo } from '../models/annotation-dto';
import { CgcGeneInfo, DisplayNode, DisplayVariant, Severity, SeverityKey } from '../models/models';
import { Aggregate, Cluster, Node as DtoNode, Sample, Tree } from '../models/pipeline-dto';
import * as cgcGenesData from './cgc_genes.json';
import * as consequenceSeveritiesData from './consequence_severities.json';
import * as drugData from './dgi_genes.json';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  $aggregate = new BehaviorSubject<Aggregate|null>(null);
  $dataSet = new BehaviorSubject<DataSet>(DEMO_DATA_SETS[0]);
  $errors = new BehaviorSubject<string[]>([]);
  $schema = new BehaviorSubject<JSONSchemaType<Aggregate>|null>(null);

  ajv = new Ajv();
  schemaUrl = 'https://raw.githubusercontent.com/ncsa/phyloflow/fcbf6b8380a6704f27b4049ed7ac588a25717f1e/aggregate_json/code/aggregate.schema';

  rootColor = '#90959B';
  clusterColors = ['#173858', '#2A5E72', '#C9C943', '#E89680', '#B26799', '#7524A1', '#489669', '#deac5b', '#bd486d'];

  constructor(private selectionService: SelectionService, private http: HttpClient) {
    this.http.get<JSONSchemaType<Aggregate>>(this.schemaUrl).subscribe(schema => {
      this.$schema.next(schema);
    });
    combineLatest([
      this.getDataSet(),
      this.$schema
    ]).pipe(
      filter(([ds, schema]) => !!schema),
      switchMap(([ds, schema]) => this.http.get<Aggregate>(ds.url).pipe(
        map(aggregate => ({ aggregate, error: null })),
        catchError(err => of({ aggregate: {}, error: 'The selected data file could not be parsed.<br><br>Please check your file format and try again.'}))
      )),
    ).subscribe({
      next: ({ aggregate, error }) => {
        const validate = this.ajv.compile(this.$schema.value as JSONSchemaType<Aggregate>);
        if (error) {
          this.setErrors([error]);
        } else if (validate(aggregate)) {
          this.$aggregate.next(aggregate);
          this.setErrors([]);
        } else {
          this.setErrors(['Error parsing data file: ' + validate.errors![0].message + '.<br><br>Please check your file format and try again.']);
        }
      }
    });
    // auto-select first tumor sample and first tree
    this.getAggregate().subscribe(aggregate => {
      const tumorSamples = aggregate.samples.filter(sample => sample.type === 'tumor');
      if (tumorSamples.length > 0) {
        this.selectionService.setSample(tumorSamples[0]);
      }
      this.selectionService.setTree(aggregate.trees[0]);
    });
  }

  setErrors(messages: string[]): void {
    this.$errors.next(messages);
  }

  getErrors(): Observable<string[]> {
    return this.$errors.asObservable();
  }

  getDataSet(): Observable<DataSet> {
    return this.$dataSet.asObservable();
  }

  setDataSet(dataSet: DataSet): void {
    this.$dataSet.next(dataSet);
  }

  getAggregate(): Observable<Aggregate> {
    return this.$aggregate.pipe(
      filter(agg => !!agg)
    ) as Observable<Aggregate>;
  }

  // map keys are gene symbols in all caps
  getCgcGenes(): Observable<Map<string, CgcGeneInfo>> {
    return of(cgcGenesData as CgcGenes).pipe(
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

  // map keys are consequences in all caps
  getConsequenceSeverities(): Observable<Map<string, Severity>> {
    return of(consequenceSeveritiesData as ConsequenceSeverities).pipe(
      map(raw => new Map<string, Severity>(
          Object.entries(raw).map(([consequence, severityKey]) => [consequence.toUpperCase(), severityKeyToSeverity.get(severityKey)!])
      ))
    );
  }

  // map keys are gene symbols in all caps
  getGeneDrugs(): Observable<Map<string, string[]>> {
    return of(drugData as DrugInfo).pipe(
      map(raw => {
        const returnVal = new Map<string, string[]>();
        Object.entries(raw).forEach(([geneName, geneData]) => {
          if (geneData.interactions) {
            returnVal.set(geneName.toUpperCase(), Object.keys(geneData.interactions));
          }
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
    return combineLatest([
      this.selectionService.getTree(),
      this.getAggregate(),
      this.getClusterColorMapping()
    ]).pipe(
      filter(([tree, aggregate, colorMapping]) => tree !== null),
      map(([tree, aggregate, colorMapping]) => {
        const returnVal: LegendSample[] = [];
        // an array of all the samples
        const tumorSamples = aggregate.samples.filter(sample => sample.type === 'tumor');
        // a map from clusterId and sampleId to prevalence
        const clusterIdAndSampleIdToPrevalance = new Map<string, number>();
        // a map from node_name to node
        const nodeNameToNode = new Map<string, DtoNode>();
        tree!.nodes.forEach(node => {
          nodeNameToNode.set(node.node_name, node);
          if (node.cluster_id !== undefined && node.cluster_id !== null) {
            node.prevalence.forEach(samplePrevalance => {
              clusterIdAndSampleIdToPrevalance.set(node.cluster_id! + '-' + samplePrevalance.sample_id, samplePrevalance.value);
            });
          }
        });
        // order the clusterIds according to their display order in the tree visualization
        const orderedClusterIds: number[] = [];
        const processNode = (node: DtoNode) => {
          if (node.cluster_id !== undefined && node.cluster_id !== null) {
            orderedClusterIds.push(node.cluster_id);
          }
          node.children.forEach(childNodeName => processNode(nodeNameToNode.get(childNodeName)!));
        };
        processNode(nodeNameToNode.get('*')!);
        tumorSamples.forEach(sample => {
          returnVal.push({
            sample,
            nodes: orderedClusterIds.map(clusterId => ({
              color: colorMapping.get(clusterId)!,
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
          if (!node.cluster) { // nodes with a cluster will represent the subclone; we won't add edges out to descendant clusters
            const newSubtreeNodes: DisplayNode[] = [];
            node.children.forEach(child => {
              child.children.forEach(grandchild => {
                // create subtree node that will be a sibling of `child`
                const subtreeNode: DisplayNode = {
                  cluster_id: undefined, // subtree node has no cluster
                  cluster: undefined, // subtree node has no cluster
                  color: child.color, // same color as `child`, because it represents a subpopulation derived from `child`
                  node_name: 'Cluster ' + grandchild.cluster_id,
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
              child.node_name = 'Subclone ' + child.cluster_id;
              // clear child.children, because they're now all represented with sibling subtree nodes
              child.children = [];
            });
            if(node.parent === null) {
              // for now, the root node really represents the edge to the first cluster
              // using ? instead of ! after the find because, in the current version of this service,
              // this method might be called multiple times as the source data streams update; the last
              // call for any given data file will find a match, but earlier calls might not, and the
              // ? prevents failure in those cases
              node.node_name = 'Cluster ' + node.children.find(child => !!child.cluster)?.cluster_id;
            }
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
      this.getCgcGenes(),
      this.getConsequenceSeverities(),
      this.getGeneDrugs()
    ]).pipe(
      map(([aggregate, cgcGenes, consequenceSeverities, geneDrugs]) => new Map<number, DisplayVariant>(aggregate.SNV.map(snv => [snv.SNV_id, {
        ...snv,
        cgcGeneInfo: snv.symbol && cgcGenes.has(snv.symbol.toUpperCase()) ? cgcGenes.get(snv.symbol.toUpperCase()) : null,
        drugs: snv.symbol && geneDrugs.has(snv.symbol.toUpperCase()) ? geneDrugs.get(snv.symbol.toUpperCase()) : [],
        severity: snv.consequence && consequenceSeverities.has(snv.consequence.toUpperCase()) ? consequenceSeverities.get(snv.consequence.toUpperCase()) : severityKeyToSeverity.get('UNKNOWN')
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

export interface DataSet {
  label: string;
  url: string;
  isDemo: boolean;
}

export const severityKeyToSeverity = new Map<SeverityKey, Severity>([
  ['HIGH', { label: 'high', value: 'HIGH', sortOrder: 1 }],
  ['MODERATE', { label: 'moderate', value: 'MODERATE', sortOrder: 2 }],
  ['LOW', { label: 'low', value: 'LOW', sortOrder: 3 }],
  ['MODIFIER', { label: 'modifier', value: 'MODIFIER', sortOrder: 4 }],
  ['UNKNOWN', { label: 'unknown', value: 'UNKNOWN', sortOrder: 5 }]
]);

export const DEMO_DATA_SETS: DataSet[] = [
  { label: 'Griffith_et_al_AML.json', url: 'assets/Griffith_et_al_AML.json', isDemo: true },
  { label: 'CRC.json', url: 'assets/inhouse_colorectal_cancer_045.json', isDemo: true }
];
