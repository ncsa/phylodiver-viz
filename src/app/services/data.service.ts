import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { PhylogenyProportionSet } from '../models/models';
import * as amlTree from './phylogeny_aml_tree.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  phylogenyProportionSets: BehaviorSubject<Map<string, PhylogenyProportionSet[]>>;

  constructor() {
    this.phylogenyProportionSets = new BehaviorSubject<Map<string, PhylogenyProportionSet[]>>(new Map<string, PhylogenyProportionSet[]>());
  }

  getPhylogenyData(): Observable<any> { // TODO FIXME
    return of(amlTree);
  }

  getPhylogenyProportionSets(): Observable<Map<string, PhylogenyProportionSet[]>> {
    return this.phylogenyProportionSets.asObservable();
  }

  addPhylogenyProportionSet(setName: string, proportionSet: PhylogenyProportionSet): void {
    const clonedMap = new Map<string, PhylogenyProportionSet[]>(this.phylogenyProportionSets.value);
    let setArray: PhylogenyProportionSet[];
    if (!clonedMap.has(setName)) {
      setArray = [];
    } else {
      setArray = [...clonedMap.get(setName)!];
    }
    setArray.push(proportionSet);
    clonedMap.set(setName, setArray);
    this.phylogenyProportionSets.next(clonedMap);
  }
}
