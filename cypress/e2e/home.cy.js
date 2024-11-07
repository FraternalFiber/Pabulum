describe("Home page", () => {
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
