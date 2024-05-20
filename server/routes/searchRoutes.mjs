import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { searchSchema } from '../schemas/searchSchema.mjs';
import { searchController } from '../controllers/searchController.mjs';
import {userSearchController} from "../controllers/userSearchController.mjs";
import {userSearchAllController} from "../controllers/userSearchAllController.mjs";

const router = express.Router();

// Searching recipes from api
router.get('/search', validateRequest({ query: searchSchema }), searchController);

// Searching user's recipes
router.get('/user/search', validateRequest({ query: searchSchema }), userSearchController);

// Searching all user recipes without any filters
router.get('/user/search/all', userSearchAllController);

export default router;