# PhylodiverViz -- The Phylodiver Visualization of the FAVE-phylo project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

## Prepping an Ubuntu VM:
Prepping local ubuntu machine to build phylodiver-viz repo

install npm, then angular using npm
    https://angular.io/guide/setup-local

1. `sudo apt-get install npm`
2. `sudo npm install -g @angular/cli` 

install an lts version of node 
    https://github.com/nodesource/distributions/blob/master/README.md

3. `curl -fsSL https://deb.nodesource.com/setup_lts.x > setup_lts.sh`
4. `sudo -E bash setup_lts.sh`
5. `sudo apt-get install -y nodejs`

6. `ng version` #if this succeeds, angular cli is working

install remaining project specific packages
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

## Publishing to Github Pages

To publish the contents of the local `dist/phylodiver-viz/` (from your machine,
not what is committed to github): 

`npm run deploy-pages`

This script copies the files from the dist directory to the root of the `gh-pages` branch, which
is then automatically served as a static site at `https://ncsa.github.io/phylodiver-viz/`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
