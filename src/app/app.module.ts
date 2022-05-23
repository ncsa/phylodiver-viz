import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LegendNodeComponent } from './components/legend-node/legend-node.component';
import { NodeComponent } from './components/node/node.component';
import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [
    AppComponent,

    LegendNodeComponent,
    NodeComponent,
    SingleSampleViewerComponent,
    TableComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
