import {
  ACCEPTED_IMAGE_TYPES,
  MAX_INGREDIENT_NAME_LEN,
  MAX_INGREDIENT_QUANTITY_LEN, MAX_PREP_TIME, MAX_RECIPE_DESCRIPTION_LEN, MAX_RECIPE_IMAGE_SIZE,
  MAX_RECIPE_TITLE_LEN, MAX_SERVINGS_NUMBER,
  MAX_STEP_INSTRUCTION_LEN, MIN_PREP_TIME, MIN_SERVINGS_NUMBER
} from "@/helpers/constants.ts";
import { z } from "zod";
import { availableDietItems } from "@/components/SearchForm/searchFormFilterItems.ts";

// Schema for a single ingredient
const ingredientSchema = z.object({
  name: z.string().trim()
    .min(1, {message: 'Enter an ingredient name'})
    .max(MAX_INGREDIENT_NAME_LEN, {message: `Enter no more than ${MAX_INGREDIENT_NAME_LEN} characters`}),
  quantity: z.string().trim()
    .max(30, {message: `Enter no more than ${MAX_INGREDIENT_QUANTITY_LEN} characters`})
    .optional()
})

// Schema for a single recipe step
const stepSchema = z.object({
  instruction: z
    .string()
    .trim()
    .min(1, {message: 'Enter a step'})
    .max(MAX_STEP_INSTRUCTION_LEN, {message: `Enter no more than ${MAX_STEP_INSTRUCTION_LEN} characters`})
})

// List of available diets for validation (only values)
const availableDiets = availableDietItems.map(diet => diet.value)

// Schema for a single diet, checks if diet is in a list of available diets
const dietSchema = z
  .string()
  .refine(diet => availableDiets.includes(diet),{ message: 'Invalid diet' })

// Zod schema object, used to define a form schema for validation
export const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {message: 'Enter a recipe title'})
    .max(MAX_RECIPE_TITLE_LEN, {message: `Enter no more than ${MAX_RECIPE_TITLE_LEN} characters`}),
  image: z
    .custom<File>((file) => file instanceof File, {message: 'Expected a file'})
    .refine((file) => file.size <= MAX_RECIPE_IMAGE_SIZE, 'Max file size is 5 MB')
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'File type not supported. Use one of .jpg, .jpeg, .png and .jfif.')
    .optional(),
  prepTime: z
    .coerce.number({invalid_type_error: 'Enter a number'})
    .min(MIN_PREP_TIME, {message: `Min time is ${MIN_PREP_TIME} minutes`})
    .max(MAX_PREP_TIME, {message: `Max time is ${MAX_PREP_TIME} minutes`}),
  servingsNumber: z
    .coerce.number({invalid_type_error: 'Enter a number'})
    .int({message: 'Enter an integer number'})
    .min(MIN_SERVINGS_NUMBER, {message: `Min number of servings is ${MIN_SERVINGS_NUMBER}`})
    .max(MAX_SERVINGS_NUMBER, {message: `Max number of servings is ${MAX_SERVINGS_NUMBER}`}),
  description: z
    .string()
    .trim()
    .min(0)
    .max(MAX_RECIPE_DESCRIPTION_LEN, {message: `Enter no more than ${MAX_RECIPE_DESCRIPTION_LEN} characters`}),
  diets: z.array(dietSchema),
  ingredients: z.array(ingredientSchema).transform((ingredients) => {
    // add indexes to ingredients to make sure they are in correct order
    return ingredients.map((ingredient, index) => ({
      ...ingredient,
      number: index + 1
    }))
  }),
  steps: z.array(stepSchema).transform((steps) => {
    // add indexes to steps to make sure they are in correct order
    return steps.map((step, index) => ({
      ...step,
      number: index + 1
    }))
  })
})