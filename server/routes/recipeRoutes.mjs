import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import {recipeDetailController} from "../controllers/recipeDetailController.mjs";
import {recipeAddSchema} from "../schemas/recipeAddSchema.mjs";
import {recipeAddController} from "../controllers/recipeAddController.mjs";

const router = express.Router();

//details of specific recipe containing detailed information and instructions
router.get('/:id', recipeDetailController);
//adding recipes to database from form
router.post('/add', validateRequest({ body: recipeAddSchema }), recipeAddController);

export default router;
