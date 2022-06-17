import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Sample } from 'src/app/models/dto';
import { DisplayNode } from 'src/app/models/models';
import { CellData } from 'src/app/models/toy-dto';
import { DataService, LegendSample } from 'src/app/services/data.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-single-sample-viewer',
  templateUrl: './single-sample-viewer.component.html',
  styleUrls: ['../../styles/styles.scss', './single-sample-viewer.component.scss']
})
export class SingleSampleViewerComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  cellData: CellData[] = [];
  hasSelectedNode = false;
  selectedSample: Sample|null = null;
  legendSamples: LegendSample[] = [];
  phylogenyShowTable = false;
  rootNode: DisplayNode|null = null;

  constructor(
    private dataService: DataService,
    private selectionService: SelectionService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getRootDisplayNode().subscribe(root => {
      this.rootNode = root;
      console.log(root);
    }));
    this.subscriptions.push(this.dataService.getLegendSamples().subscribe(legendSamples => {
      this.legendSamples = legendSamples;
    }));
    this.subscriptions.push(this.selectionService.getSelectedNodes().subscribe(selectedNodes => {
      this.hasSelectedNode = selectedNodes.length > 0;
    }));
    this.subscriptions.push(this.selectionService.getSample().subscribe(selectedSample => {
      this.selectedSample = selectedSample;
    }));
    this.subscriptions.push(this.selectionService.getPhylogenyShowTable().subscribe(showTable => {
      this.phylogenyShowTable = showTable;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
