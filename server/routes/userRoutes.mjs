import express from "express";
import { userRecipeAddSchema } from "../schemas/userRecipeAddSchema.mjs";
import { userRecipeAddController } from "../controllers/userRecipeAddController.mjs";
import { validateData } from "../middlewares/validationMiddleware.mjs";
import { uploadFile } from "../middlewares/fileUploadMiddleware.mjs";
import { userRecipeDetailController } from "../controllers/userRecipeDetailController.mjs";
import { userRecipeEditController } from "../controllers/userRecipeEditController.mjs";
import { userRecipeDeleteController } from "../controllers/userRecipeDeleteController.mjs";
import { userSearchController } from "../controllers/userSearchController.mjs";
import { userSearchSchema } from "../schemas/userSearchSchema.mjs";

const router = express.Router();

// Searching all user recipes without any filters
//router.get('/recipes/all', userSearchAllController);

// Searching user's recipes
router.get("/recipes/search", validateData({ query: userSearchSchema }), userSearchController);

// Details for specific user recipe
router.get("/recipes/:id", userRecipeDetailController);

// Adding recipes to database from form
router.post("/recipes", uploadFile(), validateData({ body: userRecipeAddSchema }), userRecipeAddController);

// Editing recipes
router.put("/recipes/:id", uploadFile(), validateData({ body: userRecipeAddSchema }), userRecipeEditController);

// Delete recipes
router.delete("/recipes/:id", userRecipeDeleteController);

export default router;