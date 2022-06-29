import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { WELCOME_PATH } from 'src/app/app-routing.module';
import { DataService, DataSet } from 'src/app/services/data.service';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['../../../styles/styles.scss', './page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  @HostBinding('class.small') isSmallHeader = false;

	@Input()
	showDataset = true;

  showModal = false;

  dataSet: DataSet|null = null;

  subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.push(this.dataService.getDataSet().subscribe(ds => this.dataSet = ds));
    this.subscriptions.push(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showDataset = !this.router.url.includes(WELCOME_PATH);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

//todo: this toggleheader function is not needed, instead, this should be controlled by the scroll position...after 50? pixels of scrolling, switch to isSmallHeader = true, if near the top, then back to isSmallHeader = false. 50px value will need to be played with to find the best breakpoint
  toggleHeader(): void {
    this.isSmallHeader = !this.isSmallHeader;
  }

  toggleModal(override?:boolean):void {
    this.showModal = (typeof override != 'undefined') ? override : !this.showModal;
  }
}
