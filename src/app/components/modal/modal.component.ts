import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataService, DataSet, DEMO_DATA_SETS } from 'src/app/services/data.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['../../styles/styles.scss', './modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Output()
  onClose = new EventEmitter();

  @HostListener('click', ['$event'])
  onClick() {
    this.close();
  }

  demoDataSets = DEMO_DATA_SETS;
  userDataSet: DataSet = { label: 'Your Dataset', url: '', isDemo: false };
  selection: DataSet|null = null;

  subscriptions: Subscription[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getDataSet().subscribe(ds => this.selection = ds));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  close():void {
    this.onClose.emit();
  }

  clearSelection(): void {
    this.selection = null;
  }

  loadDataSet(): void {
    if (this.selection) {
      this.dataService.setDataSet(this.selection);
      this.close();
    }
  }
}
