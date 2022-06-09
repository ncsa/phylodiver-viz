import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendSampleComponent } from './legend-sample.component';

describe('LegendSampleComponent', () => {
  let component: LegendSampleComponent;
  let fixture: ComponentFixture<LegendSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegendSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
