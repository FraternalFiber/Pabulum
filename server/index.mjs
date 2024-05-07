import "dotenv/config.js";
import express from 'express';
import cors from 'cors';
import {validateRequest} from 'zod-express-middleware';
import {z} from 'zod';

import {db} from './firebase/firebase.mjs';
import {RECIPE} from "./constraints.mjs";

const app = express();
const hostname = '127.0.0.1';
const port = 42069;

const SPOONACULAR_APIKEY = process.env.SPOONACULAR_APIKEY;

// Middleware for sending cross-origin resource sharing HTTP header, in order for client to access API responses
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({'status': 'Server is working properly'});
});

//schema for validation of search
const searchSchema = z.object({
    q: z.string().optional(),
    //union used in order to be able to accept either string or array of string due to frontend sending single string if array has just one element
    diet: z.union([z.array(z.string()), z.string()]).optional(),
    cuisine: z.union([z.array(z.string()), z.string()]).optional(),
    mealType: z.union([z.array(z.string()), z.string()]).optional(),
});


//response for search result - list of recipes
app.get('/search', validateRequest({
    query: searchSchema
}), async (req, res) => {
    const data = req.query

    console.log(data.diet)
    // add search params to url only if they are not undefined
    const searchParams = Object.assign({},
        data.q === undefined ? null : {query: data.q},
        //check if value is undefined / array / string - array needs to be printed with commas in between
        data.diet === undefined ? null : {diet: Array.isArray(data.diet) ? data.diet.join(',') : data.diet},
        data.cuisine === undefined ? null : {cuisine: Array.isArray(data.cuisine) ? data.cuisine.join(',') : data.cuisine},
        data.mealType === undefined ? null : {type: Array.isArray(data.mealType) ? data.mealType.join(',') : data.mealType}
    );


    console.log(searchParams.diet)

    const url = 'https://api.spoonacular.com/recipes/complexSearch?' + new URLSearchParams({
        apiKey: SPOONACULAR_APIKEY,
        //to make sure api gives only recipes that include whole instructions list
        instructionsRequired: true,
        ...searchParams
    })

    console.log("url: " + url)

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.error('Error fetching data from external API: ', error);
            res.status(500).json({ error: 'An error occurred while fetching data' });
        })
});

//details of specific recipe containing detailed information and instructions
app.get('/recipe/:id', async (req, res) => {
    const id = req.params.id;

    try
    {
        fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_APIKEY}&instructionsRequired=true`)
            .then((response) => response.json())
            .then((data) => {
                // remove ingredients that don't exist in API's database anymore from given list
                data.extendedIngredients = data.extendedIngredients.filter(object => object.id !== -1);

                // remove ingredients duplicates based on id
                data.extendedIngredients = [...data.extendedIngredients.reduce((acc, item) => acc.set(item.id, item), new Map()).values()]

                // change weird values of ingredient amount
                data.extendedIngredients.map((ingredient) => {
                    if (ingredient.amount > (1/3 - 0.001) && ingredient.amount < (1/3 + 0.001))
                        ingredient.amount = '⅓';
                    else if (ingredient.amount > (2/3 - 0.001) && ingredient.amount < (2/3 + 0.001))
                        ingredient.amount = '⅔';
                })

                res.json(data);
            })
            .catch((error) => {
                console.error('Error fetching data from external API: ', error);
                res.status(500).json({ error: 'An error occurred while fetching data' });
            })
    }
    catch (error)
    {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

//schema for validation of recipes in form
const recipeSchema = z.object({
    title: z.string().trim()
        .min(1, {message: 'Title missing'})
        .max(RECIPE.MAX_RECIPE_TITLE_LEN, {message: 'Title too long'}),
    prepTime: z.coerce.number().int()
        .min(RECIPE.MIN_PREP_TIME, {message: 'Time too short'})
        .max(RECIPE.MAX_PREP_TIME, {message: 'Time too long'}),
    servingsNumber: z.coerce.number().int()
        .min(RECIPE.MIN_SERVINGS_NUMBER, {message: 'Too little servings'})
        .max(RECIPE.MAX_SERVINGS_NUMBER, {message: 'Too many servings'}),
    description: z.string().trim()
        .min(0)
        .max(RECIPE.MAX_RECIPE_DESCRIPTION_LEN, {message: 'Description too long'}),
    diets: z.array(z.string()).optional(),
    ingredients: z.array(z.object({
        name: z.string().trim()
            .min(1, {message: 'Ingredient name missing'})
            .max(RECIPE.MAX_INGREDIENT_NAME_LEN, {message: 'Ingredient name too long'}),
        quantity: z.string().trim()
            .max(30, {message: 'Ingredient quantity too large'})
            .optional()
    })),
    steps: z.array(z.object({
        number: z.number().int().positive(),
        instruction: z.string().trim()
            .min(1, {message: 'Instruction missing'})
            .max(RECIPE.MAX_STEP_INSTRUCTION_LEN, {message: 'Instruction too long'})
    }))
});

// // FOR TESTING
// app.post('/recipe/add', async (req, res) => {
//     setTimeout(() => {
//         res.status(200).send({ success: true, message: 'Data added successfully'});
//         // res.status(500).send({ success: false, message: 'An error occurred while adding data'});
//     }, 2000)
// })

//adding recipes to database from form
app.post('/recipe/add', validateRequest({
        body: recipeSchema
    }),
    async (req, res) => {
        try {
            const data = req.body;

            const addRecipe = Object.assign({},
                data.title === undefined ? null : {title: data.title},
                data.prepTime === undefined ? null : {prepTime: data.prepTime},
                data.servingsNumber === undefined ? null : {servingsNumber: data.servingsNumber},
                data.description === undefined ? null : {description: data.description}
            )

            // add a recipe data
            const recipeRef = db.collection('recipes').doc();
            await recipeRef.set(addRecipe);


            // add all diets data to recipe
            for (let diet of data.diets) {
                const addDiet = Object.assign({},
                    diet === undefined ? null : {name: diet}
                )

                await recipeRef.collection('diets').doc().set(addDiet);
            }

            // add all ingredients to recipe
            for (let ingredient of data.ingredients) {
                const addIngredient = Object.assign({},
                    ingredient.name === undefined ? null : {name: ingredient.name},
                    ingredient.quantity === undefined ? null : {quantity: ingredient.quantity}
                )

                await recipeRef.collection('ingredients').doc().set(addIngredient);
            }

            // add all steps to recipe
            for (let step of data.steps) {
                const addStep = Object.assign({},
                    step.number === undefined ? null : {number: step.number},
                    step.instruction === undefined ? null : {instruction: step.instruction}
                )

                await recipeRef.collection('steps').doc().set(addStep);
            }


            // Send a response back to the frontend
            res.status(200).send({success: true, message: 'Data added successfully', id: recipeRef.id});
        } catch (error) {
            console.error('Error adding : ', error);
            res.status(500).send({success: false, message: 'An error occurred while adding data'});
        }
    });

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`);
})
