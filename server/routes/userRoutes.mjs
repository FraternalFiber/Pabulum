import express from 'express';
import {recipeAddSchema} from "../schemas/recipeAddSchema.mjs";
import {recipeAddController} from "../controllers/recipeAddController.mjs";
import {validateData} from "../middlewares/validationMiddleware.mjs";
import {uploadFile} from "../middlewares/fileUploadMiddleware.mjs";
import {userRecipeDetailController} from "../controllers/userRecipeDetailController.mjs";
import {recipeEditController} from "../controllers/recipeEditController.mjs";
import {recipeDeleteController} from "../controllers/recipeDeleteController.mjs";
import {validateRequest} from "zod-express-middleware";
import {searchSchema} from "../schemas/searchSchema.mjs";
import {userSearchController} from "../controllers/userSearchController.mjs";

const router = express.Router();

// Searching all user recipes without any filters
//router.get('/recipes/all', userSearchAllController);

// Searching user's recipes
router.get('/recipes/search', validateRequest({ query: searchSchema }), userSearchController);

// Details for specific user recipe
router.get('/recipes/:id', userRecipeDetailController);

// Adding recipes to database from form
router.post('/recipes', uploadFile(), validateData(recipeAddSchema), recipeAddController);

// Editing recipes
router.put('/recipes/:id', uploadFile(), validateData(recipeAddSchema), recipeEditController);

// Delete recipes
router.delete('/recipes/:id', recipeDeleteController);

export default router;