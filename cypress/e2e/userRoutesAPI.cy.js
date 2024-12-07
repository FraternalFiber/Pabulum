describe("User recipes API", () => {
  it("GET - gets a list of recipes", () => {
    cy.request({
      method: "GET",
      url: "127.0.0.1:42069/user/recipes/search/",
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("GET - returns 404 code if recipe not found", () => {
    cy.request({
      method: "GET",
      url: "127.0.0.1:42069/user/recipes/not_existing_recipe",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.error).to.be.equal("Recipe not found");
    });
  });

  let testRecipeData = {
    description: "Test description",
    diets: [],
    imageChanged: false,
    ingredients: [
      {
        name: "Test ingredient",
        number: 1,
        quantity: "Test quantity",
      },
    ],
    prepTime: 0,
    servingsNumber: 1,
    steps: [
      {
        instruction: "Test instruction",
        number: 1,
      },
    ],
    title: "Test title",
  };

  const testFormData = new FormData();

  for (const key in testRecipeData) {
    testFormData.append(key, JSON.stringify(testRecipeData[key]));
  }

  let testRecipeId;

  it("POST - creates a recipe", () => {
    cy.request({
      method: "POST",
      url: "127.0.0.1:42069/user/recipes/",
      body: testFormData,
    }).then((response) => {
      const body = JSON.parse(new TextDecoder().decode(response.body));
      expect(response.status).to.eq(200);
      expect(body.success).to.eq(true);
      testRecipeId = body.id;
    });
  });

  it("PUT - edits a recipe", () => {
    testFormData.set("title", '"Edited test recipe"');

    cy.request({
      method: "PUT",
      url: `127.0.0.1:42069/user/recipes/${testRecipeId}`,
      body: testFormData,
    }).then((response) => {
      const body = JSON.parse(new TextDecoder().decode(response.body));
      expect(response.status).to.eq(200);
      expect(body.success).to.eq(true);
    });
  });

  it("DELETE - deletes a recipe", () => {
    cy.request({
      method: "DELETE",
      url: `127.0.0.1:42069/user/recipes/${testRecipeId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.eq(true);
    });
  });
});
