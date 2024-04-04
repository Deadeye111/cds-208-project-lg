describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('Test Text', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.get('[data-v-inspector="pages/index.vue:29:13"] > .inline-flex > .text-center').click();
    cy.get('.text-lg').click();
    cy.get('.text-lg').should('have.text', 'Sign in via magic link with your email below');
    /* ==== End Cypress Studio ==== */
  });
})