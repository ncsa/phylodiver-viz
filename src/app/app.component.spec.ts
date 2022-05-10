import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { NodeComponent } from './components/node/node.component';
import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { TableComponent } from './components/table/table.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NodeComponent,
        SingleSampleViewerComponent,
        TableComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
