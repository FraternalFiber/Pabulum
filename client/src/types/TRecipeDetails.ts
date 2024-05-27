import {TNutrient} from "@/types/TNutrient.ts";
import {TStep} from "@/types/TStep.ts";
import { TIngredient } from "@/types/TIngredient.ts";

// Type for a recipe fetched from API or database
export type TRecipeDetails = {
  image?: string
  title: string
  prepTime: number
  servingsNumber: number
  diets: Array<string>
  description?: string
  ingredients: Array<TIngredient>
  nutrients?: Array<TNutrient>
  steps: Array<TStep>
}