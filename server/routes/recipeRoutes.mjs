import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import {recipeDetailController} from "../controllers/recipeDetailController.mjs";
import {recipeAddSchema} from "../schemas/recipeAddSchema.mjs";
import {recipeAddController} from "../controllers/recipeAddController.mjs";
import {testRecipeController} from "../controllers/testRecipeController.mjs";

const router = express.Router();

// recipe for testing
router.get('/test', testRecipeController);

//details of specific recipe containing detailed information and instructions
router.get('/:id', recipeDetailController);
//adding recipes to database from form
router.post('/add', validateRequest({ body: recipeAddSchema }), recipeAddController);

export default router;
