/// <reference types="cypress" />

describe('Demo', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  })
  it('opens the demo page', () => {
    cy.contains('Take Me to the Demo!').click();
    cy.location('pathname').should('eq', '/demo');
  })
})

describe('PhyloNode', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/demo');
  })

  it('is initially collapsed', () => {
    cy.get('phylo-node').should('not.have.class', 'is_selected');
  });

  it('exapnds/collapses when clicked on the left edge', () => {
    cy.get('phylo-node')
      .each((e) => {
        cy.wrap(e).children('.block').click();
        cy.wrap(e).should('have.class', 'is_selected');
        cy.wrap(e).children('.block').click();
        cy.wrap(e).should('not.have.class', 'is_selected');
      })
  });

  it('exapnds/collapses when clicked inside', () => {
    cy.get('phylo-node')
      .each((e) => {
        cy.wrap(e).children('.block_info').click('top');
        cy.wrap(e).should('have.class', 'is_selected');
        cy.wrap(e).children('.block_info').click('top');
        cy.wrap(e).should('not.have.class', 'is_selected');
      })
  });
});

describe('PhyloTable', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/demo');
  })

  it('is initially hidden', () => {
    cy.get('phylo-table').should('have.length', 0);
  });

  it('can be opened by clicking any summary button', () => {
    cy.get('phylo-node')
      .each((e) => {
        cy.wrap(e).click('left').find('> .block_info .summary_button').click();
        cy.get('phylo-table').should('have.length', 1).and('be.visible');
        cy.get('phylo-table .close_btn').click();
        cy.get('phylo-table').should('have.length', 0);
      });
  });

  it('can be opened by clicking any summary table', () => {
    cy.get('phylo-node')
      .each((e) => {
        cy.wrap(e).click('left').find('> .block_info tbody').click();
        cy.get('phylo-table').should('have.length', 1).and('be.visible');
        cy.get('phylo-table .close_btn').click();
        cy.get('phylo-table').should('have.length', 0);
      });
  });
});
