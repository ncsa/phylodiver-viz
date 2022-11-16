import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Sample, Tree } from 'src/app/models/pipeline-dto';
import { DisplayNode } from 'src/app/models/models';
import { DataService, LegendSample } from 'src/app/services/data.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-single-sample-viewer',
  templateUrl: './single-sample-viewer.component.html',
  styleUrls: ['../../styles/styles.scss', './single-sample-viewer.component.scss']
})
export class SingleSampleViewerComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  hasSelectedNode = false;
  isLoading = false;
  selectedSample: Sample|null = null;
  legendSamples: LegendSample[] = [];
  showTable = false;
  rootNode: DisplayNode|null = null;

  errors: string[] = [];
  selectedTree: Tree|null = null;
  trees: Tree[] = [];

  constructor(
    private dataService: DataService,
    private selectionService: SelectionService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getDataSet().subscribe(() => {
      this.isLoading = true;
    }));
    this.subscriptions.push(this.dataService.getAggregate().subscribe(() => {
      this.isLoading = false;
    }));
    this.subscriptions.push(this.dataService.getErrors().subscribe(errors => {
      this.errors = errors;
    }));
    this.subscriptions.push(this.dataService.getRootDisplayNode().subscribe(root => {
      this.rootNode = root;
    }));
    this.subscriptions.push(this.dataService.getLegendSamples().subscribe(legendSamples => {
      this.legendSamples = legendSamples;
    }));
    this.subscriptions.push(this.dataService.getTrees().subscribe(trees => {
      this.trees = trees;
    }));
    this.subscriptions.push(this.selectionService.getDisplayNode().subscribe(selectedNode => {
      this.hasSelectedNode = !!selectedNode;
    }));
    this.subscriptions.push(this.selectionService.getSample().subscribe(selectedSample => {
      this.selectedSample = selectedSample;
    }));
    this.subscriptions.push(this.selectionService.getShowTable().subscribe(showTable => {
      this.showTable = showTable;
    }));
    this.subscriptions.push(this.selectionService.getTree().subscribe(tree => {
      this.selectedTree = tree;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectTree(treeId: string): void {
    const newTree = this.trees.find(tree => (tree.tree_id + '') === treeId);
    if (newTree) {
      this.selectionService.setTree(newTree);
    }
  }

  updateQuery(userInput: string) {
    this.selectionService.query$.next(userInput);
  }
}
