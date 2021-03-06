import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LegendSampleComponent } from '../legend-sample/legend-sample.component';
import { NodeComponent } from '../node/node.component';
import { SingleSampleViewerComponent } from './single-sample-viewer.component';
import { TableComponent } from '../table/table.component';
import { PrevalenceFormatterPipe } from 'src/app/pipes/prevalence-formatter.pipe';

describe('SingleSampleViewerComponent', () => {
  let component: SingleSampleViewerComponent;
  let fixture: ComponentFixture<SingleSampleViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [
        LegendSampleComponent,
        NodeComponent,
        SingleSampleViewerComponent,
        TableComponent,

        PrevalenceFormatterPipe
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSampleViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
