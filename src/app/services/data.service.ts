import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';

import { PhylogenyProportionSet } from '../models/models';
import { CellData, PhylogenyData } from '../models/toy-dto';
import * as amlTree from './phylogeny_aml_tree.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
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
}
