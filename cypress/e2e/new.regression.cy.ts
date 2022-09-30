describe('Visual Regression Test - Added', () => {
  it(`didn't break header`, () => {
    cy.visit('/demo');
    cy.wait(1000);
    cy.get('header').compareSnapshot('page_header', 0.0);
  });

  it(`didn't break footer`, () => {
    cy.visit('/demo');
    cy.wait(1000);
    cy.get('footer').compareSnapshot('page_footer', 0.0);
  });
});
