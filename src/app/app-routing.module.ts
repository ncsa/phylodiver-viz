import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { LandingPageComponent } from './components/page/landing-page/landing-page.component';

const appRoutes: Routes = [
  { path: 'demo', component: SingleSampleViewerComponent },
  { path: 'welcome', component: LandingPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'welcome' }
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
