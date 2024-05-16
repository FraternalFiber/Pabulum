import { z } from 'zod';

// Schema for validation of search
export const searchSchema = z.object({
    q: z.string().optional(),
    // Union used in order to be able to accept either string or array of string due to frontend sending single string if array has just one element
    diet: z.union([z.array(z.string()), z.string()]).optional(),
    cuisine: z.union([z.array(z.string()), z.string()]).optional(),
    mealType: z.union([z.array(z.string()), z.string()]).optional(),
});