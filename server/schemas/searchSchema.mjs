import { z } from 'zod';
import { AVAILABLE_FILTER_ITEMS, RECIPE } from "../constants.mjs";

// Check if following properties are in the lists of available values
const dietSchema = z
  .string()
  .refine(diet => AVAILABLE_FILTER_ITEMS.DIETS.includes(diet),{ message: 'Invalid diet' })

const cuisineSchema = z
  .string()
  .refine(cuisine => AVAILABLE_FILTER_ITEMS.CUISINES.includes(cuisine),{ message: 'Invalid cuisine' })

const mealTypeSchema = z
  .string()
  .refine(mealType => AVAILABLE_FILTER_ITEMS.MEAL_TYPES.includes(mealType),{ message: 'Invalid meal type' })

// Schema for validation of search
export const searchSchema = z.object({
    q: z
      .string()
      .trim()
      .min(1, {message: "Search query is required"})
      .max(RECIPE.MAX_SEARCH_QUERY_LEN, {message: "Search query too long"}),
    // Union used in order to be able to accept either string or array of string due to frontend sending single string if array has just one element
    diet: z.union([z.array(dietSchema), dietSchema]).optional(),
    cuisine: z.union([z.array(cuisineSchema), cuisineSchema]).optional(),
    mealType: z.union([z.array(mealTypeSchema), mealTypeSchema]).optional(),
});