import express from 'express';
import {recipeDetailController} from "../controllers/recipeDetailController.mjs";
import {recipeAddSchema} from "../schemas/recipeAddSchema.mjs";
import {recipeAddController} from "../controllers/recipeAddController.mjs";
import {testRecipeController} from "../controllers/testRecipeController.mjs";
import {validateData} from "../middlewares/validationMiddleware.mjs";
import {uploadFile} from "../middlewares/fileUploadMiddleware.mjs";
import {userRecipeDetailController} from "../controllers/userRecipeDetailController.mjs";

const router = express.Router();

// Recipe for testing
router.get('/test', testRecipeController);

// Details of specific recipe containing detailed information and instructions
router.get('/:id', recipeDetailController);

// Details for specific user recipe
router.post('/user/:id', userRecipeDetailController);

// Adding recipes to database from form
router.post('/add', uploadFile(), validateData(recipeAddSchema), recipeAddController);



export default router;