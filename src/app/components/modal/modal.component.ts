import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['../../styles/styles.scss', './modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
