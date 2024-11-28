describe("Home page elements displaying", () => {
  beforeEach(() => {
    cy.visit("localhost:5173");
  });

  it("Slogan is displayed", () => {
    cy.contains("Savor the flavor, master the meal!");
  });
  it("Logo is visible", () => {
    cy.get('[alt="Pabulum"]').should("be.visible");
  });
  it("Search input is displayed", () => {
    cy.get('input[name="q"]');
  });
  it("Submit button is displayed", () => {
    cy.get('button[type="submit"]');
  });
});

describe("Home page search", () => {
  beforeEach(() => {
    cy.visit("localhost:5173");
  });

  let testSearchQueries = ["pizza", "qwertyuiop123"];

  testSearchQueries.forEach((testSearchQuery) => {
    it("Redirects to /search after typing a keyword", () => {
      cy.typeIntoInputField("q", testSearchQuery);
      cy.clickSubmitButton();
      cy.url().should(
        "eq",
        `http://localhost:5173/search?q=${testSearchQuery}`,
      );
    });
  });

  it("Does not redirect after not typing anything", () => {
    cy.clickSubmitButton();
    cy.url().should("eq", `http://localhost:5173/`);
  });

  it("Does not redirect after typing an empty query", () => {
    cy.typeIntoInputField("q", " ");
    cy.clickSubmitButton();
    cy.url().should("eq", `http://localhost:5173/`);
  });
});
