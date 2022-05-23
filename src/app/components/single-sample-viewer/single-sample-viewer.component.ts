import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PhylogenyProportionSet } from 'src/app/models/models';
import { CellData } from 'src/app/models/toy-dto';
import { DataService } from 'src/app/services/data.service';

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
  phylogenyProportionId: any; // TODO FIXME
  phylogenyProportionSets = new Map<string, PhylogenyProportionSet[]>();
  phylogenyShowTable = false;

  constructor(
    private dataService: DataService,
    private selectionService: SelectionService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getPhylogenyData().subscribe(phyloData => {
      this.cellData = phyloData.cell_data;
    }));
    this.subscriptions.push(this.dataService.getPhylogenyProportionSets().subscribe(proportionSets => {
      this.phylogenyProportionSets = proportionSets;
      this.changeDetectorRef.detectChanges();
    }));
    this.subscriptions.push(this.selectionService.getSelectedBlocks().subscribe(blocks => {
      this.hasSelectedBlock = blocks.length > 0;
    }));
    this.subscriptions.push(this.selectionService.getPhylogenyProportionId().subscribe(proportionId => {
      this.phylogenyProportionId = proportionId;
    }));
    this.subscriptions.push(this.selectionService.getPhylogenyShowTable().subscribe(showTable => {
      this.phylogenyShowTable = showTable;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectProportion(proportion: any): void {
    this.selectionService.setSelectedBlocks([]);
    this.selectionService.setPhylogenyProportionId(proportion);
  }

}
