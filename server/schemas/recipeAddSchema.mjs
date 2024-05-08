import { z } from 'zod';
import {RECIPE} from "./constants.mjs";

//schema for validation of recipes in form
export const recipeAddSchema = z.object({
    title: z.string().trim()
        .min(1, {message: 'Title missing'})
        .max(RECIPE.MAX_RECIPE_TITLE_LEN, {message: 'Title too long'}),
    prepTime: z.coerce.number().int()
        .min(RECIPE.MIN_PREP_TIME, {message: 'Time too short'})
        .max(RECIPE.MAX_PREP_TIME, {message: 'Time too long'}),
    servingsNumber: z.coerce.number().int()
        .min(RECIPE.MIN_SERVINGS_NUMBER, {message: 'Too little servings'})
        .max(RECIPE.MAX_SERVINGS_NUMBER, {message: 'Too many servings'}),
    description: z.string().trim()
        .min(0)
        .max(RECIPE.MAX_RECIPE_DESCRIPTION_LEN, {message: 'Description too long'}),
    diets: z.array(z.string()).optional(),
    ingredients: z.array(z.object({
        name: z.string().trim()
            .min(1, {message: 'Ingredient name missing'})
            .max(RECIPE.MAX_INGREDIENT_NAME_LEN, {message: 'Ingredient name too long'}),
        quantity: z.string().trim()
            .max(30, {message: 'Ingredient quantity too large'})
            .optional()
    })),
    steps: z.array(z.object({
        number: z.number().int().positive(),
        instruction: z.string().trim()
            .min(1, {message: 'Instruction missing'})
            .max(RECIPE.MAX_STEP_INSTRUCTION_LEN, {message: 'Instruction too long'})
    }))
});