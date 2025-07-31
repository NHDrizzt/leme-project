import "@testing-library/cypress/add-commands";

Cypress.Commands.add("primeReactSelect", (selector, optionText) => {
  cy.get(selector)
    .should("be.visible")
    .and("not.have.attr", "data-p-disabled", "true")
    .click();

  cy.get(".p-dropdown-panel")
    .should("exist")
    .should("be.visible")
    .within(() => {
      cy.contains("li", optionText).scrollIntoView().click({ force: true });
    });
});
