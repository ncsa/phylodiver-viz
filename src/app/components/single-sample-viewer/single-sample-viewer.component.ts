import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Sample } from 'src/app/models/dto';
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
  hasSelectedBlock = false;
  selectedSample: Sample|null = null;
  legendSamples: LegendSample[] = [];
  phylogenyShowTable = false;

  constructor(
    private dataService: DataService,
    private selectionService: SelectionService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getPhylogenyData().subscribe(phyloData => {
      this.cellData = phyloData.cell_data;
      console.log("old", phyloData);
    }));
    this.subscriptions.push(this.dataService.getAggregate().subscribe(aggregate => {
      console.log("new", aggregate);
    }));
    this.subscriptions.push(this.dataService.getLegendSamples().subscribe(legendSamples => {
      this.legendSamples = legendSamples;
      //this.changeDetectorRef.detectChanges();
    }));
    this.subscriptions.push(this.selectionService.getSelectedBlocks().subscribe(blocks => {
      this.hasSelectedBlock = blocks.length > 0;
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
