import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { LandingPageComponent } from './components/page/landing-page/landing-page.component';

export const WELCOME_PATH = 'welcome';
export const DEMO_PATH = 'demo';

const appRoutes: Routes = [
  { path: DEMO_PATH, component: SingleSampleViewerComponent },
  { path: WELCOME_PATH, component: LandingPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'welcome' }
];

@NgModule({
  imports: [
    // `useHash: true` here for HashLocationStrategy, which simplifies deployment to github pages
    // if switching back to PathLocationStrategy, restore the commented-out base href in index.html
    // or add an APP_BASE_REF provider here
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
