import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LegendNodeComponent } from './components/legend-node/legend-node.component';
import { ModalComponent } from './components/modal/modal.component';
import { NodeComponent } from './components/node/node.component';
import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { TableComponent } from './components/table/table.component';
import { AppRoutingModule } from './app-routing.module';

import { PageHeaderComponent } from './components/page/page-header/page-header.component';
import { LandingPageComponent } from './components/page/landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,

    LegendNodeComponent,
    ModalComponent,
    NodeComponent,
    SingleSampleViewerComponent,
    TableComponent,

    PageHeaderComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
