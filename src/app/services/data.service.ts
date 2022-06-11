import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map } from 'rxjs';

import { PhylogenyProportionSet } from '../models/models';
import { CellData, PhylogenyData } from '../models/toy-dto';
import { Aggregate, Sample } from '../models/dto';
import * as amlTree from './phylogeny_aml_tree.json';
import * as amlTree2 from './test.json';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  $aggregate = new BehaviorSubject<Aggregate>(amlTree2 as Aggregate);

  clusterColors = ['#173858', '#2A5E72', '#C9C943', '#E89680', '#B26799', '#7524A1'];

  constructor(private selectionService: SelectionService) {
    // auto-select first tumor sample
    this.getAggregate().subscribe(aggregate => {
      const tumorSamples = aggregate.samples.filter(sample => sample.type === 'tumor');
      if (tumorSamples.length > 0) {
        this.selectionService.setSample(tumorSamples[0]);
      }
    });
  }

  getAggregate(): Observable<Aggregate> {
    return this.$aggregate.asObservable();
  }

  getPhylogenyData(): Observable<PhylogenyData> {
    return of(amlTree);
  }

  getPhylogenyProportionSets(): Observable<Map<string, PhylogenyProportionSet[]>> {
    return this.getPhylogenyData().pipe(
      map(phylogenyData => {
        const returnVal = new Map<string, PhylogenyProportionSet[]>();
        const processNode = (cellData: CellData) => {
          if (cellData.children && cellData.children.length > 0) {
            cellData.children.forEach(child => processNode(child));
          } else {
            Object.entries(cellData.proportion).forEach(([sampleId, proportion]) => {
              if (!returnVal.has(sampleId)) {
                returnVal.set(sampleId, []);
              }
              returnVal.get(sampleId)!.push({
                color: cellData.color,
                proportion
              });
            });
          }
        };
        phylogenyData.cell_data.forEach(cellData => processNode(cellData));
        return returnVal;
      })
    );
  }

  getLegendSamples(): Observable<LegendSample[]> {
    return this.$aggregate.pipe(
      map(aggregate => {
        const returnVal: LegendSample[] = [];
        if (aggregate.trees.length > 0) {
          // a sorted array of all the clusterIds
          const clusterIds = [
            ...(new Set<number>(aggregate.clusters.map(cluster => cluster.cluster_id))).values()
          ].sort((a, b) => a - b);
          // an array of all the samples
          const tumorSamples = aggregate.samples.filter(sample => sample.type === 'tumor');
          // a map from clusterId and sampleId to prevalence
          const clusterIdAndSampleIdToPrevalance = new Map<string, number>();
          aggregate.trees[0].nodes.forEach(node => { // TODO use the currently selected tree
            if (node.cluster_id) {
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
        }
        return returnVal;
      })
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