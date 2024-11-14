describe("Search page elements displaying", () => {
  beforeEach(() => {
    cy.visit("localhost:5173/search");
  });

  it("Title exists", () => {
    cy.contains("Find your favourite recipes");
  });
  it("Search input exists", () => {
    cy.get("input[name='q']");
  });
  it("Submit button exists", () => {
    cy.get("button[type='submit']");
  });
  it("Diet filter exists", () => {
    cy.get("button[role='combobox']").eq(0).should("have.text", "Diet");
  });
  it("Cuisine filter exists", () => {
    cy.get("button[role='combobox']").eq(1).should("have.text", "Cuisine");
  });
  it("Meal type filter exists", () => {
    cy.get("button[role='combobox']").eq(2).should("have.text", "Meal type");
  });
});

describe("Search functionality", () => {
  beforeEach(() => {
    cy.visit("localhost:5173/search");
  });

  let testSearchQueries = [
    { q: "spaghetti" },
    { q: "qwertyuiop123" },
    { q: "pizza", diet: "vegan", cuisine: "italian", mealType: "main course" },
  ];

  testSearchQueries.forEach((testSearchQuery) => {
    it("Displays correct results or a 'no results' message after searching for a keyword", () => {
      cy.get("input[name='q']").type(testSearchQuery.q);

      if (testSearchQuery.diet) {
        cy.get("button[role='combobox']").eq(0).click();
        cy.get(`div[data-value="${testSearchQuery.diet}"]`).click();
      }

      if (testSearchQuery.cuisine) {
        cy.get("button[role='combobox']").eq(1).click();
        cy.get(`div[data-value="${testSearchQuery.cuisine}"]`).click();
      }

      if (testSearchQuery.mealType) {
        cy.get("button[role='combobox']").eq(2).click();
        cy.get(`div[data-value="${testSearchQuery.mealType}"]`).click();
      }

      cy.get("button[type='submit']").click();

      // Wait until results are loaded
      cy.get("[data-testid='loading-skeletons']").should("not.exist");

      cy.get("[data-testid='search-container']").then(($container) => {
        if ($container.find("[data-testid='search-results']").length > 0) {
          cy.get("h3");
          cy.get("[style*='background-image']");
          cy.get("button").contains("Show");
        } else {
          cy.get("[data-testid='no-results']");
          cy.get("h5").should("have.text", "No results");
        }
      });
    });
  });

  it("Does not perform a search after not typing anything", () => {
    cy.get("button[type='submit']").click();
    cy.get("[data-testid='search-container']").should("not.exist");
  });

  it("Does not perform a search after typing an empty query", () => {
    cy.get("input[name='q']").type(" ");
    cy.get("button[type='submit']").click();
    cy.get("[data-testid='search-container']").should("not.exist");
  });
});
