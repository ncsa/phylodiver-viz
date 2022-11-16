import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/page/landing-page/landing-page.component';
import { LegendSampleComponent } from './components/legend-sample/legend-sample.component';
import { ModalComponent } from './components/modal/modal.component';
import { NodeComponent } from './components/node/node.component';
import { PageHeaderComponent } from './components/page/page-header/page-header.component';
import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { TableComponent } from './components/table/table.component';
import { PrevalenceFormatterPipe } from './pipes/prevalence-formatter.pipe';
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
    TableComponent,

    PrevalenceFormatterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,

    ButtonModule,
    ProgressSpinnerModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
