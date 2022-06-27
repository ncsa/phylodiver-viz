import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['../../../styles/styles.scss', './page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  @HostBinding('class.small') isSmallHeader:boolean = false;

	@Input()
	showDataset:boolean = true;

  showModal:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

//todo: this toggleheader function is not needed, instead, this should be controlled by the scroll position...after 50? pixels of scrolling, switch to isSmallHeader = true, if near the top, then back to isSmallHeader = false. 50px value will need to be played with to find the best breakpoint
  toggleHeader(): void {
    this.isSmallHeader = !this.isSmallHeader;
  }

  toggleModal(override?:boolean):void {
    this.showModal = (typeof override != 'undefined') ? override : !this.showModal;
  }
}
