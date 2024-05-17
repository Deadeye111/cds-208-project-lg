describe('local login test', () => {
  /* ==== Test Created with Cypress Studio ==== */
  it('local_login_test', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://cds-208-project-lg.vercel.app/account');
    cy.wait(500);
    cy.contains('button', 'Login').click();
    cy.get('[type="email"]').type(Cypress.env("testuser").email);
    cy.get('[type="password"]').type(Cypress.env("testuser").password);
    cy.wait(500);
    cy.contains('input', 'Login').click();
    cy.contains('Your account informations').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
})