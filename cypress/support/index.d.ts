declare namespace Cypress {
  interface Chainable {
    primeReactSelect(selector: string, optionText: string): Chainable<Element>;
  }
}
