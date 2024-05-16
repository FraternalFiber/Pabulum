import {TIngredient} from "@/types/TIngredient.ts";
import {TNutrient} from "@/types/TNutrient.ts";
import {TStep} from "@/types/TStep.ts";

export type TRecipeDetails = {
  image: string
  title: string
  prepTime: number
  servingsNumber: number
  diets: Array<string>
  ingredients: Array<TIngredient>
  nutrients: Array<TNutrient>
  steps: Array<TStep>
}