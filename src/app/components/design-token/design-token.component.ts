import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import data from './genomix_tokens.json';
//import data from './genomix_tokens_small.json';

@Component({
  selector: 'design-token',
  templateUrl: './design-token.component.html',
  styleUrls: ['../../styles/styles.scss', './design-token.component.scss'],
})
export class DesignTokenComponent implements OnInit {
  jsonData:any = data;

  constructor() {
  }

  ngOnInit(): void {
console.log(this.jsonData); //JSON.stringify
  }
}
