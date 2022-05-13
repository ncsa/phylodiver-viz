import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedBlocks: BehaviorSubject<any[]>; // TODO FIXME

  phylogenyProportionId: BehaviorSubject<any>; // TODO FIXME

  phylogenySelectedTier: BehaviorSubject<any>; // TODO FIXME

  phylogenyShowTable: BehaviorSubject<boolean>;

  constructor() {
    this.selectedBlocks = new BehaviorSubject<any>([]);
    this.phylogenyProportionId = new BehaviorSubject<any>('primary'); //null);
    this.phylogenySelectedTier = new BehaviorSubject<any>(null);
    this.phylogenyShowTable = new BehaviorSubject<boolean>(false);
  }

  getSelectedBlocks(): Observable<any[]> {
    return this.selectedBlocks.asObservable();
  }

  setSelectedBlocks(blocks: any[]): void {
    this.selectedBlocks.next(blocks);
  }

  getPhylogenyProportionId(): Observable<any> {
    return this.phylogenyProportionId.asObservable();
  }

  setPhylogenyProportionId(block: any): void {
    this.phylogenyProportionId.next(block);
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
