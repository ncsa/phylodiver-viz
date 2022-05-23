import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { CellData } from 'src/app/models/toy-dto';
import { DataService } from 'src/app/services/data.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-legend-node',
  templateUrl: './legend-node.component.html',
  styleUrls: ['../../styles/styles.scss', './legend-node.component.scss'],
})
export class LegendNodeComponent implements OnInit, OnDestroy {
  @HostBinding('class.is_selected') isSelected:boolean = false;

  @HostListener('click', ['$event'])
  onClick(e:any) {
     e.stopPropagation();
     this.selectProportion();
  }

  @Input()
  id = '';

  @Input()
  data:any;

  hasSelectedBlock = false;
  phylogenyProportionId: any; // TODO FIXME

  subscriptions: Subscription[] = [];

  constructor(
    private dataService: DataService,
    private selectionService: SelectionService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.selectionService.getSelectedBlocks().subscribe(blocks => {
    }));
    this.subscriptions.push(this.selectionService.getPhylogenyProportionId().subscribe(proportionId => {
      this.phylogenyProportionId = proportionId;
      this.isSelected = (this.phylogenyProportionId == this.id) ? true : false;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectProportion(): void {
    this.selectionService.setSelectedBlocks([]);
    this.selectionService.setPhylogenyProportionId(this.id);
  }
}
