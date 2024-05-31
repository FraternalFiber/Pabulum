// CreateRecipeForm
export const MAX_STEP_INSTRUCTION_LEN = 1000
export const MAX_RECIPE_TITLE_LEN = 80
export const MIN_PREP_TIME = 0
export const MAX_PREP_TIME = 999
export const PREP_TIME_STEP = 5
export const MIN_SERVINGS_NUMBER = 1
export const MAX_SERVINGS_NUMBER = 999
export const SERVINGS_NUMBER_STEP = 1
export const MAX_RECIPE_DESCRIPTION_LEN = 2000
export const MAX_INGREDIENT_NAME_LEN = 80
export const MAX_INGREDIENT_QUANTITY_LEN = 30
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"]
export const MAX_RECIPE_IMAGE_SIZE = 5242880 // 5 MB

// SearchForm
export const MAX_SEARCH_QUERY_LEN = 80

// URL
export const BACKEND_SERVER_URL = "http://127.0.0.1:42069"

// Messages
export const POST_RECIPE_SUCCESS_MESSAGE = "Recipe has been created!"
export const POST_RECIPE_ERROR_MESSAGE = "We couldn't create your recipe"
export const DELETE_RECIPE_SUCCESS_MESSAGE = "Recipe has been deleted"
export const DELETE_RECIPE_ERROR_MESSAGE = "We couldn't delete your recipe"
export const EDIT_RECIPE_SUCCESS_MESSAGE = "Recipe changes have been saved"
export const EDIT_RECIPE_ERROR_MESSAGE = "We couldn't save your changes"