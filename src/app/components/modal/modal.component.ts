import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
  userDataSet: DataSet = getDefaultUserDataSet();
  selection: DataSet|null = null;

  subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getDataSet().subscribe(ds => this.selection = ds));
    if (this.router.url.includes('upload=1')) {
      this.selection = this.userDataSet;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  close():void {
    this.onClose.emit();
  }

  clearSelection(): void {
    this.selection = null;
    this.userDataSet = getDefaultUserDataSet();
  }

  onFileSelected(file: File): void {
    if (file) {
      this.userDataSet.label = file.name;
      const reader = new FileReader();
      reader.onloadend = (progressEvent) => {
        if (progressEvent.target?.result) {
          this.userDataSet.url = progressEvent.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.userDataSet = getDefaultUserDataSet();
    }
  }

  loadDataSet(): void {
    if (this.selection) {
      this.dataService.setDataSet(this.selection);
      this.close();
    }
  }
}

export function getDefaultUserDataSet(): DataSet {
  return { label: 'Your Dataset', url: '', isDemo: false };
}
