export const SPOONACULAR_APIKEY = process.env.SPOONACULAR_APIKEY;
export const AVAILABLE_DIETS = ['vegetarian', 'vegan', 'gluten free', 'ketogenic', 'dairy free']
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png']
export const MAX_RECIPE_IMAGE_SIZE = 5242881 // 5 MB + 1 (multer doesn't accept files with exact max size)