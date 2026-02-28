import { recipeDetailController } from "../recipeDetailController.mjs";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const createReq = (id = "12345") => ({ params: { id } });
const createRes = () => ({
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
});

describe("recipeDetailController", () => {
  let logSpy;
  let errorSpy;

  beforeAll(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  test("should return recipe details when API call is successful", async () => {
    const req = createReq();
    const res = createRes();

    const mockApiResponse = {
      image: "http://image.url",
      title: "Test Recipe",
      readyInMinutes: 45,
      servings: 4,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false,
      diets: ["ketogenic"],
      extendedIngredients: [
        { id: 1, name: "ingredient1", amount: 1, unit: "cup" },
        { id: 2, name: "ingredient2", amount: 2, unit: "tbsp" },
      ],
      analyzedInstructions: [
        {
          steps: [
            { number: 1, step: "Step 1" },
            { number: 2, step: "Step 2" },
          ],
        },
      ],
      nutrition: {
        nutrients: [
          { name: "Calories", amount: 300, unit: "kcal" },
          { name: "Fat", amount: 10, unit: "g" },
          { name: "Protein", amount: 20, unit: "g" },
        ],
      },
    };

    fetch.mockResponseOnce(JSON.stringify(mockApiResponse));

    await recipeDetailController(req, res);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/recipes/12345/information"));
    expect(res.status).not.toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      image: "http://image.url",
      title: "Test Recipe",
      prepTime: 45,
      servingsNumber: 4,
      diets: ["vegetarian", "gluten free", "ketogenic"],
      ingredients: [
        { name: "ingredient1", quantity: "1 cup" },
        { name: "ingredient2", quantity: "2 tbsp" },
      ],
      nutrients: [
        { name: "Calories", quantity: "300 kcal" },
        { name: "Fat", quantity: "10 g" },
        { name: "Protein", quantity: "20 g" },
      ],
      steps: [
        { number: 1, instruction: "Step 1" },
        { number: 2, instruction: "Step 2" },
      ],
    });
  });

  test("should return upstream status when API responds with non-ok status", async () => {
    const req = createReq();
    const res = createRes();

    fetch.mockResponseOnce("", { status: 404, statusText: "Not Found" });

    await recipeDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not Found" });
  });

  test("should return error message when API call fails", async () => {
    const req = createReq();
    const res = createRes();

    fetch.mockReject(new Error("Internal Server Error"));

    await recipeDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while fetching data",
    });
  });
});
