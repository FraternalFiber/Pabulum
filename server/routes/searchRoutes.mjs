import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { searchSchema } from '../schemas/searchSchema.mjs';
import { searchController } from '../controllers/searchController.mjs';
import {userSearchController} from "../controllers/userSearchController.mjs";

const router = express.Router();

// Response for search result - list of recipes
router.get('/search', validateRequest({ query: searchSchema }), searchController);

router.get('/userSearch', validateRequest({ query: searchSchema }), userSearchController);

export default router;