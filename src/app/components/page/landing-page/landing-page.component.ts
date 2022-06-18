import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['../../../styles/styles.scss', './landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
//  isSmallHeader:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

//todo: this toggleheader function is not needed, instead, this should be controlled by the scroll position...after 50? pixels of scrolling, switch to isSmallHeader = true, if near the top, then back to isSmallHeader = false. 50px value will need to be played with to find the best breakpoint
/*
todo: ok to remove as the header is now in the app instead of here
  toggleHeader(): void {
    this.isSmallHeader = !this.isSmallHeader;
  }
*/
}
