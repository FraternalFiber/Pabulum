/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    typeIntoSearchField(query: string): Chainable<any>;
    clickSubmitButton(): Chainable<any>;
  }
}
