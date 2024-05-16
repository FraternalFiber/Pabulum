import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { searchSchema } from '../schemas/searchSchema.mjs';
import { searchController } from '../controllers/searchController.mjs';

const router = express.Router();

// Response for search result - list of recipes
router.get('/search', validateRequest({ query: searchSchema }), searchController);

export default router;