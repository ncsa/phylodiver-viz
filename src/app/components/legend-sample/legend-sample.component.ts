import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Sample } from 'src/app/models/pipeline-dto';
import { LegendSample } from 'src/app/services/data.service';
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
     this.selectSample();
  }

  @Input()
  legendSample?: LegendSample;

  @Input()
  showLabel?: boolean = true;

  selectedSample: Sample|null = null;

  subscriptions: Subscription[] = [];

  constructor(
    private selectionService: SelectionService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.selectionService.getSample().subscribe(selectedSample => {
      this.selectedSample = selectedSample;
      this.isSelected = selectedSample?.sample_id === this.legendSample!.sample.sample_id;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectSample(): void {
    this.selectionService.setDisplayNode(null);
    this.selectionService.setSample(this.legendSample!.sample);
  }
}
