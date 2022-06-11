import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Sample } from '../models/dto';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedBlocks: BehaviorSubject<any[]>; // TODO FIXME

  sample: BehaviorSubject<Sample|null>;

  phylogenySelectedTier: BehaviorSubject<any>; // TODO FIXME

  phylogenyShowTable: BehaviorSubject<boolean>;

  constructor() {
    this.selectedBlocks = new BehaviorSubject<any>([]);
    this.sample = new BehaviorSubject<Sample|null>(null);
    this.phylogenySelectedTier = new BehaviorSubject<any>(null);
    this.phylogenyShowTable = new BehaviorSubject<boolean>(false);
  }

  getSelectedBlocks(): Observable<any[]> {
    return this.selectedBlocks.asObservable();
  }

  setSelectedBlocks(blocks: any[]): void {
    this.selectedBlocks.next(blocks);
  }

  getSample(): Observable<Sample|null> {
    return this.sample.asObservable();
  }

  setSample(sample: Sample): void {
    this.sample.next(sample);
  }

  getPhylogenySelectedTier(): Observable<any> {
    return this.phylogenySelectedTier.asObservable();
  }

  setPhylogenySelectedTier(block: any): void {
    this.phylogenySelectedTier.next(block);
  }

  getPhylogenyShowTable(): Observable<boolean> {
    return this.phylogenyShowTable.asObservable();
  }

  setPhylogenyShowTable(show: boolean): void {
    this.phylogenyShowTable.next(show);
  }
}
