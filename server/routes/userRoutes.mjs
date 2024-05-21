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
import {userSearchAllController} from "../controllers/userSearchAllController.mjs";

const router = express.Router();

// Searching all user recipes without any filters
router.get('/recipe/search/all', userSearchAllController);

// Searching user's recipes
router.get('/recipe/search', validateRequest({ query: searchSchema }), userSearchController);

// Details for specific user recipe
router.post('/recipe/:id', userRecipeDetailController);

// Adding recipes to database from form
router.post('/recipe/new', uploadFile(), validateData(recipeAddSchema), recipeAddController);

// Editing recipes
router.put('/recipe/:id', uploadFile(), validateData(recipeAddSchema), recipeEditController);

// Delete recipes
router.delete('/recipe/:id', recipeDeleteController);

export default router;