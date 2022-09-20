describe('Visual Regression Test - Demo', () => {
  it(`didn't break landing page`, () => {
    cy.visit('/');
    cy.compareSnapshot('landing_page', 0.0);
  });

  it(`didn't break demo page`, () => {
    cy.visit('/demo');
    cy.wait(1000);
    cy.compareSnapshot('demo_page', 0.0);
  });

  it(`didn't break legend`, () => {
    cy.visit('/demo');
    cy.get('.legend').compareSnapshot('demo_legend', 0.0);
  })
});
