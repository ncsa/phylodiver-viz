import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendSample } from 'src/app/services/data.service';
import { LegendSampleComponent } from './legend-sample.component';
import { PrevalenceFormatterPipe } from 'src/app/pipes/prevalence-formatter.pipe';

describe('LegendSampleComponent', () => {
  let component: LegendSampleComponent;
  let fixture: ComponentFixture<LegendSampleComponent>;
  let legendSample: LegendSample = {
    sample: {
      sample_id: 0, // pipeline can use 0 as an id, so make sure all our logic can handle it
      name: 'fake sample',
      type: 'tumor'
    },
    nodes: [] // TODO populate
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LegendSampleComponent,
        PrevalenceFormatterPipe
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendSampleComponent);
    component = fixture.componentInstance;
    component.legendSample = legendSample;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
