import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Sample, Tree } from '../models/dto';
import { DisplayNode } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedNodes: BehaviorSubject<DisplayNode[]>;

  sample: BehaviorSubject<Sample|null>;
  tree: BehaviorSubject<Tree|null>;

  phylogenySelectedTier: BehaviorSubject<any>; // TODO FIXME

  showTable: BehaviorSubject<boolean>;

  constructor() {
    this.selectedNodes = new BehaviorSubject<DisplayNode[]>([]);
    this.sample = new BehaviorSubject<Sample|null>(null);
    this.tree = new BehaviorSubject<Tree|null>(null);
    this.phylogenySelectedTier = new BehaviorSubject<any>(null);
    this.showTable = new BehaviorSubject<boolean>(false);
  }

  getSelectedNodes(): Observable<DisplayNode[]> {
    return this.selectedNodes.asObservable();
  }

  setSelectedNodes(nodes: DisplayNode[]): void {
    this.selectedNodes.next(nodes);
  }

  getSample(): Observable<Sample|null> {
    return this.sample.asObservable();
  }

  setSample(sample: Sample): void {
    this.sample.next(sample);
  }

  getTree(): Observable<Tree|null> {
    return this.tree.asObservable();
  }

  setTree(tree: Tree): void {
    this.tree.next(tree);
  }

  getPhylogenySelectedTier(): Observable<any> {
    return this.phylogenySelectedTier.asObservable();
  }

  setPhylogenySelectedTier(block: any): void {
    this.phylogenySelectedTier.next(block);
  }

  getShowTable(): Observable<boolean> {
    return this.showTable.asObservable();
  }

  setShowTable(show: boolean): void {
    this.showTable.next(show);
  }
}
