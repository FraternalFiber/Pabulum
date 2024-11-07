describe("Home page elements displaying", () => {
  it("Slogan exists", () => {
    cy.visit("localhost:5173");
    cy.contains("Savor the flavor, master the meal!");
  });
  it("Logo is visible", () => {
    cy.visit("localhost:5173");
    cy.get('[alt="Pabulum"]').should("be.visible");
  });
  it("Search input exists", () => {
    cy.visit("localhost:5173");
    cy.get('input[name="q"]');
  });
  it("Submit button exists", () => {
    cy.visit("localhost:5173");
    cy.get('button[type="submit"]');
  });
});

describe("Home page search", () => {
  it("Displays correct results after search", () => {
    cy.visit("localhost:5173");
    cy.get('input[name="q"]').type("pizza");
    cy.get('button[type="submit"]').click();
    cy.url().should("eq", "http://localhost:5173/search?q=pizza");
    cy.get("h3").contains("pizza", { matchCase: false });
    cy.get('[style*="background-image"]');
    cy.get("button").contains("Show");
  });
});
