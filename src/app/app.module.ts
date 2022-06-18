import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/page/landing-page/landing-page.component';
import { LegendSampleComponent } from './components/legend-sample/legend-sample.component';
import { ModalComponent } from './components/modal/modal.component';
import { NodeComponent } from './components/node/node.component';
import { PageHeaderComponent } from './components/page/page-header/page-header.component';
import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { TableComponent } from './components/table/table.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,

    LandingPageComponent,
    LegendSampleComponent,
    ModalComponent,
    NodeComponent,
    PageHeaderComponent,
    SingleSampleViewerComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
