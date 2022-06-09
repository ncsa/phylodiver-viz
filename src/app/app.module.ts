import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LegendSampleComponent } from './components/legend-sample/legend-sample.component';
import { NodeComponent } from './components/node/node.component';
import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { TableComponent } from './components/table/table.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './state/reducers';

@NgModule({
  declarations: [
    AppComponent,

    LegendSampleComponent,
    NodeComponent,
    SingleSampleViewerComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
