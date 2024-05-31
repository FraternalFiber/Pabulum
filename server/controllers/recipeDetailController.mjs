import _ from "lodash";
import { SPOONACULAR_APIKEY } from "../constants.mjs";

const NUTRIENTS_TO_SHOW = ["Calories", "Fat", "Saturated Fat", "Carbohydrates", "Sugar", "Cholesterol", "Protein"];

// let test_counter = 0;

export const recipeDetailController = async (req, res) => {
  const id = req.params.id;

  const url = `https://api.spoonacular.com/recipes/${id}/information?` + new URLSearchParams({
    apiKey: SPOONACULAR_APIKEY,
    instructionsRequired: true,
    includeNutrition: true,
  });

  // url to a test recipe
  // const url = 'http://127.0.0.1:42069/recipe/test'

  console.log("recipe url: ", url);
  // test_counter++;
  // console.log('Details fetch: ' + test_counter)

  try {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw {
            status: response.status,
            statusText: response.statusText,
          };
        }

        return response.json();
      })
      .then((data) => {
        // Remove ingredients that don't exist in API's database anymore from given list
        let ingredients = data.extendedIngredients.filter(object => object.id !== -1);

        // Remove ingredients duplicates based on id
        ingredients = [...ingredients.reduce((acc, item) => acc.set(item.id, item), new Map()).values()];

        // Change weird values of ingredient amount
        ingredients.map((ingredient) => {
          if (ingredient.amount > (1 / 3 - 0.001) && ingredient.amount < (1 / 3 + 0.001)) {
            ingredient.amount = "⅓";
          } else if (ingredient.amount > (2 / 3 - 0.001) && ingredient.amount < (2 / 3 + 0.001)) {
            ingredient.amount = "⅔";
          }
        });

        // Extract specific properties from ingredients
        const cleanIngredients = [];
        ingredients.map((ingredient) => {
          cleanIngredients.push({
            name: ingredient.name,
            quantity: `${ingredient.amount} ${ingredient.unit}`.trim(),
          });
        });

        // Create a diets array from specific recipe properties
        const diets = [];
        if (data.vegetarian) diets.push("vegetarian");
        if (data.vegan) diets.push("vegan");
        if (data.glutenFree) diets.push("gluten free");
        if (data.dairyFree) diets.push("dairy free");
        if (data.diets.includes("ketogenic")) diets.push("ketogenic");

        // Create a steps array to omit unnecessary properties and for names consistency
        const steps = [];
        data.analyzedInstructions[0].steps.forEach((step) => {
          steps.push({
            number: step.number,
            instruction: step.step,
          });
        });

        // Filter nutrients based on NUTRIENTS_TO_SHOW and extract specific properties
        const nutrients = [];
        data.nutrition.nutrients.forEach((nutrient) => {
          if (NUTRIENTS_TO_SHOW.includes(nutrient.name)) {
            nutrients.push({
              name: nutrient.name,
              quantity: `${_.round(nutrient.amount, 1)} ${nutrient.unit}`.trim(),
            });
          }
        });

        // Create a final recipe object to send
        const recipe = {
          image: data.image,
          title: data.title,
          prepTime: data.readyInMinutes,
          servingsNumber: data.servings,
          diets: diets,
          ingredients: cleanIngredients,
          nutrients: nutrients,
          steps: steps,
        };

        res.json(recipe);
      })
      .catch((error) => {
        console.error("Error fetching data from external API: ", error);

        if (error.status) {
          return res.status(error.status).json({ error: error.statusText });
        }

        return res.status(500).json({ error: "An error occurred while fetching data" });
      });
  } catch (error) {
    console.error("Error fetching data from external API:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};