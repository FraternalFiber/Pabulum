/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    clickSubmitButton(): Chainable<any>;
    typeIntoInputField(name: string, value: string): Chainable<any>;
  }
}
