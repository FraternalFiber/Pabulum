describe("User recipes API", () => {
  it("GET - gets a list of recipes", () => {
    cy.request({
      method: "GET",
      url: "127.0.0.1:42069/user/recipes/search/",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).length.to.be.greaterThan(0);
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

  it("POST - creates a recipe", () => {
    let testData = {
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

    for (const key in testData) {
      testFormData.append(key, JSON.stringify(testData[key]));
    }

    cy.request({
      method: "POST",
      url: "127.0.0.1:42069/user/recipes/",
      body: testFormData,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
