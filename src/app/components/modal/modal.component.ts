import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  close():void {
    this.onClose.emit();
  }
}
