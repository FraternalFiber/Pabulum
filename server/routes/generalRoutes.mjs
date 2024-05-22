import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { searchSchema } from '../schemas/searchSchema.mjs';
import { searchController } from '../controllers/searchController.mjs';
import {testRecipeController} from "../controllers/testRecipeController.mjs";
import {recipeDetailController} from "../controllers/recipeDetailController.mjs";

const router = express.Router();

// Recipe for testing
router.get('/test', testRecipeController);

// Searching recipes from api
router.get('/recipes/search', validateRequest({ query: searchSchema }), searchController);

// Details of specific recipe containing detailed information and instructions
router.get('/recipes/:id', recipeDetailController);

export default router;