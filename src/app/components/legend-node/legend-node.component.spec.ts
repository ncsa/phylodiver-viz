import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendNodeComponent } from './legend-node.component';

describe('LegendNodeComponent', () => {
  let component: LegendNodeComponent;
  let fixture: ComponentFixture<LegendNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegendNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
