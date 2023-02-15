import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleSampleViewerComponent } from './components/single-sample-viewer/single-sample-viewer.component';
import { LandingPageComponent } from './components/page/landing-page/landing-page.component';

import { DesignTokenComponent } from './components/design-token/design-token.component';

export const WELCOME_PATH = 'welcome';
export const DEMO_PATH = 'demo';

const appRoutes: Routes = [
  { path: DEMO_PATH, component: SingleSampleViewerComponent },
  { path: WELCOME_PATH, component: LandingPageComponent },
  { path: 'token', component: DesignTokenComponent },
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
