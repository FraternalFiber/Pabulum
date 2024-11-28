describe("Create recipe page create functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/user/recipes/create");
  });

  let testRecipeData = {
    title: "Test recipe",
    prepTime: 30,
    servingsNumber: 4,
    description: "This is a test recipe.",
    diets: ["vegetarian"],
    imageChanged: false,
    ingredients: [
      {
        name: "First test ingredient",
        number: 1,
        quantity: "First test quantity",
      },
      {
        name: "Second test ingredient",
        number: 2,
        quantity: "Second test quantity",
      },
    ],
    steps: [
      {
        instruction: "First test instruction",
        number: 1,
      },
      {
        instruction: "Second test instruction",
        number: 2,
      },
      {
        instruction: "Third test instruction",
        number: 3,
      },
    ],
  };

  it("Creates recipe with valid data", () => {
    cy.typeIntoInputField("title", testRecipeData.title);
    cy.typeIntoInputField("prepTime", testRecipeData.prepTime);
    cy.typeIntoInputField("servingsNumber", testRecipeData.servingsNumber);
    cy.typeIntoInputField("description", testRecipeData.description);

    testRecipeData.diets.forEach((diet) => {
      cy.get("label").contains(diet, { matchCase: false }).click();
    });

    testRecipeData.ingredients.forEach((ingredient, index) => {
      cy.typeIntoInputField(`ingredients.${index}.name`, ingredient.name);
      cy.typeIntoInputField(
        `ingredients.${index}.quantity`,
        ingredient.quantity,
      );

      // Click the button for adding another ingredients if there are still ingredients left
      if (index < testRecipeData.ingredients.length - 1) {
        cy.get("[data-testid='add-ingredient-button']").click();
      }
    });

    testRecipeData.steps.forEach((step, index) => {
      cy.typeIntoInputField(`steps.${index}.instruction`, step.instruction);

      // Click the button for adding another steps if there are still steps left
      if (index < testRecipeData.steps.length - 1) {
        cy.get("[data-testid='add-step-button']").click();
      }
    });

    cy.clickSubmitButton();
    cy.wait(4000);
    cy.url().should("not.eq", `http://localhost:5173/user/recipes/create`);
  });
});
