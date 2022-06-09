import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendSampleComponent } from '../legend-sample/legend-sample.component';
import { NodeComponent } from '../node/node.component';
import { SingleSampleViewerComponent } from './single-sample-viewer.component';
import { TableComponent } from '../table/table.component';

describe('SingleSampleViewerComponent', () => {
  let component: SingleSampleViewerComponent;
  let fixture: ComponentFixture<SingleSampleViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LegendSampleComponent,
        NodeComponent,
        SingleSampleViewerComponent,
        TableComponent
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
