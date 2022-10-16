import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Sample, Tree } from '../models/pipeline-dto';
import { DisplayNode, Severity } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  displayNode$: BehaviorSubject<DisplayNode|null>;
  sample$: BehaviorSubject<Sample|null>;
  severity$: BehaviorSubject<Severity|null>;
  showTable$: BehaviorSubject<boolean>;
  tree$: BehaviorSubject<Tree|null>;
  query$: BehaviorSubject<string>;

  constructor() {
    this.displayNode$ = new BehaviorSubject<DisplayNode|null>(null);
    this.sample$ = new BehaviorSubject<Sample|null>(null);
    this.severity$ = new BehaviorSubject<Severity|null>(null);
    this.showTable$ = new BehaviorSubject<boolean>(false);
    this.tree$ = new BehaviorSubject<Tree|null>(null);
    this.query$ = new BehaviorSubject<string>('');
  }

  getDisplayNode(): Observable<DisplayNode|null> {
    return this.displayNode$.asObservable();
  }

  setDisplayNode(node: DisplayNode|null): void {
    this.displayNode$.next(node);
  }

  getSample(): Observable<Sample|null> {
    return this.sample$.asObservable();
  }

  setSample(sample: Sample): void {
    this.sample$.next(sample);
  }

  getTree(): Observable<Tree|null> {
    return this.tree$.asObservable();
  }

  setTree(tree: Tree): void {
    this.tree$.next(tree);
    // reset the display node when switching trees
    this.setDisplayNode(null);
  }

  getSeverity(): Observable<Severity|null> {
    return this.severity$.asObservable();
  }

  setSeverity(severity: Severity|null): void {
    this.severity$.next(severity);
  }

  getShowTable(): Observable<boolean> {
    return this.showTable$.asObservable();
  }

  setShowTable(show: boolean): void {
    this.showTable$.next(show);
  }
}
