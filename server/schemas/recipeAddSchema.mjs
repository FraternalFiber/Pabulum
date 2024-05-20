import { z } from 'zod';
import {RECIPE} from "../constants.mjs";
import _ from 'lodash'
import {AVAILABLE_DIETS} from "../constants.mjs";

const stepSchema = z.object({
    number: z.coerce.number().int().positive(),
    instruction: z.string().trim()
        .min(1, {message: 'Instruction missing'})
        .max(RECIPE.MAX_STEP_INSTRUCTION_LEN, {message: 'Instruction too long'})
})

// Schema for a single diet, checks if diet is in a list of available diets
const dietSchema = z.string().refine(diet => AVAILABLE_DIETS.includes(diet),{
    message: 'Invalid diet, must be one of: ' + AVAILABLE_DIETS.join(', ')
})

// Schema for validation of recipes in form
export const recipeAddSchema = z.object({
    title: z.string().trim()
        .min(1, {message: 'Title missing'})
        .max(RECIPE.MAX_RECIPE_TITLE_LEN, {message: 'Title too long'}),
    prepTime: z.coerce.number().int()
        .min(RECIPE.MIN_PREP_TIME, {message: 'Preparation time too short'})
        .max(RECIPE.MAX_PREP_TIME, {message: 'Preparation time too long'}),
    servingsNumber: z.coerce.number().int()
        .min(RECIPE.MIN_SERVINGS_NUMBER, {message: 'Too little servings'})
        .max(RECIPE.MAX_SERVINGS_NUMBER, {message: 'Too many servings'}),
    description: z.string().trim()
        .min(0)
        .max(RECIPE.MAX_RECIPE_DESCRIPTION_LEN, {message: 'Description too long'}),
    diets: z.array(dietSchema).optional(),
    ingredients: z.array(z.object({
        name: z.string().trim()
            .min(1, {message: 'Ingredient name missing'})
            .max(RECIPE.MAX_INGREDIENT_NAME_LEN, {message: 'Ingredient name too long'}),
        quantity: z.string().trim()
            .max(30, {message: 'Ingredient quantity too large'})
            .optional()
    })),
    // Check if steps numbers are unique
    steps: z.array(stepSchema)
        .refine(steps => _.isEqual(steps, _.uniqBy(steps, 'number')),
            {message: 'Steps numbers must be unique'})
});