import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendNodeComponent } from '../legend-node/legend-node.component';
import { NodeComponent } from '../node/node.component';
import { SingleSampleViewerComponent } from './single-sample-viewer.component';
import { TableComponent } from '../table/table.component';

describe('SingleSampleViewerComponent', () => {
  let component: SingleSampleViewerComponent;
  let fixture: ComponentFixture<SingleSampleViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LegendNodeComponent,
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
