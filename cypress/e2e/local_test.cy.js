describe('local test', () => {
  /* ==== Test Created with Cypress Studio ==== */
  it('local_test', function() {
    /* ==== Login ==== */
    cy.visit('http://localhost:3000/account');
    cy.wait(500);
    cy.contains('button', 'Login').click();
    cy.get('[type="email"]').type(Cypress.env("testuser").email);
    cy.get('[type="password"]').type(Cypress.env("testuser").password);
    cy.wait(500);
    cy.contains('input', 'Login').click();
    cy.contains('Your account informations').should('be.visible');
    /* ==== Board Creation and updates ==== */
    cy.get(':nth-child(1) > .hover\\:underline').click();
    cy.get(':nth-child(1) > .inline-flex > .text-center').click();
    cy.get('.sm\\:w-52').clear('tes');
    cy.get('.sm\\:w-52').type('testboard');
    cy.get('.ml-2').click();
    cy.get('.dark\\:text-white > .flex-col > .text-center').click();
    cy.get(':nth-child(2) > .grid > .px-3').clear('tes');
    cy.get(':nth-child(2) > .grid > .px-3').type('test');
    cy.get(':nth-child(2) > .grid > .px-4').click();
    cy.get(':nth-child(3) > .grid > input.py-2').clear('tes');
    cy.get(':nth-child(3) > .grid > input.py-2').type('test');
    cy.get(':nth-child(3) > .grid > .px-4').click();
    cy.get('.w-6').click();
    cy.get('a > .bg-blue-500').click();
    cy.get('.bg-red-500').click();
    cy.get(':nth-child(2) > .hover\\:underline').click();
    cy.wait(500);
    cy.get('.bg-red-500').click();
    cy.wait(500);
  });
})