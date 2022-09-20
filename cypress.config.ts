import { defineConfig } from "cypress";
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin';

export default defineConfig({
  env: {
    SNAPSHOT_BASE_DIRECTORY: './cypress/snapshots/base',
    SNAPSHOT_DIFF_DIRECTORY: './cypress/snapshots/diff'
  },
  screenshotsFolder: './cypress/snapshots/actual',
  trashAssetsBeforeRuns: true,
  video: false,
  e2e: {
    experimentalStudio: true,
    baseUrl: 'http://localhost:4200',
    /**
     * See: https://docs.cypress.io/guides/references/migration-guide#setupNodeEvents
     */
    setupNodeEvents(on, config) {
      // implement node event listeners here
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
