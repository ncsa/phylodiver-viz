import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Sample, Tree } from '../models/pipeline-dto';
import { DisplayNode } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  consequence: BehaviorSubject<string|null>;
  displayNode: BehaviorSubject<DisplayNode|null>;
  sample: BehaviorSubject<Sample|null>;
  showTable: BehaviorSubject<boolean>;
  tree: BehaviorSubject<Tree|null>;

  constructor() {
    this.consequence = new BehaviorSubject<string|null>(null);
    this.displayNode = new BehaviorSubject<DisplayNode|null>(null);
    this.sample = new BehaviorSubject<Sample|null>(null);
    this.showTable = new BehaviorSubject<boolean>(false);
    this.tree = new BehaviorSubject<Tree|null>(null);
  }

  getDisplayNode(): Observable<DisplayNode|null> {
    return this.displayNode.asObservable();
  }

  setDisplayNode(node: DisplayNode|null): void {
    this.displayNode.next(node);
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
    // reset the display node when switching trees
    this.setDisplayNode(null);
  }

  getConsequence(): Observable<string|null> {
    return this.consequence.asObservable();
  }

  setConsequence(consequence: string|null): void {
    this.consequence.next(consequence);
  }

  getShowTable(): Observable<boolean> {
    return this.showTable.asObservable();
  }

  setShowTable(show: boolean): void {
    this.showTable.next(show);
  }
}
