import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'phylo-legend-sample',
  templateUrl: './legend-sample.component.html',
  styleUrls: ['../../styles/styles.scss', './legend-sample.component.scss'],
})
export class LegendSampleComponent implements OnInit, OnDestroy {
  @HostBinding('class.is_selected') isSelected = false;

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
