import { z } from 'zod';
import { AVAILABLE_FILTER_ITEMS, RECIPE } from "../constants.mjs";

// Check if following properties are in the lists of available values
const dietSchema = z
  .string()
  .refine(diet => AVAILABLE_FILTER_ITEMS.DIETS.includes(diet),{ message: 'Invalid diet' })

// Schema for validation of user recipes search
export const userSearchSchema = z.object({
  q: z
    .string()
    .trim()
    .max(RECIPE.MAX_SEARCH_QUERY_LEN, {message: "Search query too long"})
    .optional(),
  // Union used in order to be able to accept either string or array of string due to frontend sending single string if array has just one element
  diet: z.union([z.array(dietSchema), dietSchema]).optional(),
});