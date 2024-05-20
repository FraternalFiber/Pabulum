export const SPOONACULAR_APIKEY = process.env.SPOONACULAR_APIKEY;
export const AVAILABLE_DIETS = ['vegetarian', 'vegan', 'gluten free', 'ketogenic', 'dairy free']
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png']
export const MAX_RECIPE_IMAGE_SIZE = 5242881 // 5 MB + 1 (multer doesn't accept files with exact max size)

export const RECIPE =
    {
        MAX_STEP_INSTRUCTION_LEN: 1000,
        MAX_RECIPE_TITLE_LEN: 80,
        MIN_PREP_TIME: 0,
        MAX_PREP_TIME: 999,
        PREP_TIME_STEP: 5,
        MIN_SERVINGS_NUMBER: 1,
        MAX_SERVINGS_NUMBER: 999,
        SERVINGS_NUMBER_STEP: 1,
        MAX_RECIPE_DESCRIPTION_LEN: 2000,
        MAX_INGREDIENT_NAME_LEN: 80,
        MAX_INGREDIENT_QUANTITY_LEN: 30
    }