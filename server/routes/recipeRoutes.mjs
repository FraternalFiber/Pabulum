import express from 'express';
import {validateRequest, validateRequestBody} from 'zod-express-middleware';
import {recipeDetailController} from "../controllers/recipeDetailController.mjs";
import {recipeAddSchema} from "../schemas/recipeAddSchema.mjs";
import {recipeAddController} from "../controllers/recipeAddController.mjs";
import multer from 'multer'
import {validateData} from "../middlewares/validationMiddleware.mjs";
import {uploadFile} from "../middlewares/fileUploadMiddleware.mjs";

const router = express.Router();

//details of specific recipe containing detailed information and instructions
router.get('/:id', recipeDetailController);
//adding recipes to database from form
// router.post('/add', validateRequest({ body: recipeAddSchema }), recipeAddController);
// router.post('/add',  upload.single('image'), recipeAddController);
// router.post('/add', upload.single('image'), validateData(recipeAddSchema), recipeAddController);
router.post('/add', uploadFile(), validateData(recipeAddSchema), recipeAddController);

export default router;
