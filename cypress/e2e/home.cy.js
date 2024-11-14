describe("Home page elements displaying", () => {
  beforeEach(() => {
    cy.visit("localhost:5173");
  });

  it("Slogan exists", () => {
    cy.contains("Savor the flavor, master the meal!");
  });
  it("Logo is visible", () => {
    cy.get('[alt="Pabulum"]').should("be.visible");
  });
  it("Search input exists", () => {
    cy.get('input[name="q"]');
  });
  it("Submit button exists", () => {
    cy.get('button[type="submit"]');
  });
});

describe("Home page search", () => {
  beforeEach(() => {
    cy.visit("localhost:5173");
  });

  let testSearchQueries = ["pizza", "qwertyuiop123"];

  testSearchQueries.forEach((testSearchQuery) => {
    it("Redirect to /search after typing a keyword", () => {
      cy.get("input[name='q']").type(testSearchQuery);
      cy.get("button[type='submit']").click();
      cy.url().should(
        "eq",
        `http://localhost:5173/search?q=${testSearchQuery}`,
      );
    });
  });

  it("Does not redirect after not typing anything", () => {
    cy.get("button[type='submit']").click();
    cy.url().should("eq", `http://localhost:5173/`);
  });

  it("Does not redirect after typing an empty query", () => {
    cy.get("input[name='q']").type(" ");
    cy.get("button[type='submit']").click();
    cy.url().should("eq", `http://localhost:5173/`);
  });
});
