# PhylodiverViz -- The Phylodiver Visualization of the FAVE-phylo project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

## Prepping an Ubuntu VM:
Prepping local ubuntu machine to build phylodiver-viz repo


Install an lts version of node 
    https://github.com/nodesource/distributions/blob/master/README.md

1. `curl -fsSL https://deb.nodesource.com/setup_lts.x > setup_lts.sh`
2. `sudo -E bash setup_lts.sh`
3. `sudo apt-get install -y nodejs`


If the nodejs installation didn't install npm, do so and then install angular
    https://angular.io/guide/setup-local

4. `sudo apt-get install npm`
5. `sudo npm install -g @angular/cli` 


6. `ng version` #if this succeeds, angular cli is working

Install remaining project specific packages. From the top-level project directory of this repo (where the package.json is located):

7. `npm install` 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Running end-to-end tests (Cypress)

Run `npm run test:e2e` to start a dev server and launch Cypress.

## Publishing to Github Pages

To publish the contents of the local `dist/phylodiver-viz/` (from your machine,
not what is committed to github): 

`npm run deploy-pages`

This script copies the files from the dist directory to the root of the `gh-pages` branch, which
is then automatically served as a static site at `https://ncsa.github.io/phylodiver-viz/`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
