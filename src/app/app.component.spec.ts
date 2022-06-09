import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { NodeComponent } from './components/node/node.component';
import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { TableComponent } from './components/table/table.component';

@Component({
             template: '<div>Hello</div>'
           })
class TestComponent {
}

describe('AppComponent', () => {
  let simpleRoutes: Routes = [
    { path: 'demo', component: TestComponent },
    { path: 'welcome', component: TestComponent},
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(simpleRoutes)
      ],
      declarations: [
        AppComponent,
        NodeComponent,
        SingleSampleViewerComponent,
        TableComponent
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
