import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';

const appRoutes: Routes = [
  { path: 'demo', component: SingleSampleViewerComponent },
  { path: '', pathMatch: 'full', redirectTo: 'demo' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
