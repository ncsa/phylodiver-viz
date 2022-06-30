import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
        this.isSmallHeader = (this.showDataset && this.dataSet) ? true : false;
        if (this.doesRouteOpenModal()) {
          this.showModal = true;
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  doesRouteOpenModal(): boolean {
    return this.router.url.includes('upload=1');
  }

  toggleModal(override?:boolean):void {
    this.showModal = (typeof override != 'undefined') ? override : !this.showModal;
    if (!this.showModal && this.doesRouteOpenModal()) {
      this.router.navigateByUrl(this.router.url.replace('upload=1', ''));
    }
  }
}
