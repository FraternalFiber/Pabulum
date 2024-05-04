import "dotenv/config.js";
import express from 'express';
import cors from 'cors';
import {validateRequest} from 'zod-express-middleware';
import {z} from 'zod';

import {db} from './firebase/firebase.mjs';

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
    q: z.string(),
    diet: z.string().optional(),
    cuisine: z.string().optional(),
    mealType: z.string().optional(),
});

//response for search result - list of recipes
app.get('/search', validateRequest({
    query: searchSchema
}), async (req, res) => {
    const data = req.query

    // add search params to url only if they are not undefined
    const searchParams = Object.assign({},
        data.q === undefined ? null : {query: data.q},
        data.diet === undefined ? null : {diet: data.diet},
        data.cuisine === undefined ? null : {cuisine: data.cuisine},
        data.mealType === undefined ? null : {type: data.mealType}
    )

    const url = 'https://api.spoonacular.com/recipes/complexSearch?' + new URLSearchParams({
        apiKey: SPOONACULAR_APIKEY,
        // instructionsRequired: true,
        ...searchParams
    })
    console.log(url)
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
                    if (ingredient.amount == 0.6666667) {
                        ingredient.amount = '⅔';
                    }
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
    title: z.string().trim(),
    prepTime: z.number().int().positive().optional()
        .nullable(),
    servings: z.number().int().positive().min(1),
    description: z.string().optional().nullable(),
    diets: z.array(z.string()).nullable().optional(),
    ingredients: z.array(z.object({
        name: z.string(),
        quantity: z.string().optional()
    })),
    steps: z.array(z.object({
        number: z.number().int().positive(),
        content: z.string()
    }))
});

//adding recipes to database from form
app.post('/addrecipe', validateRequest({
    body: recipeSchema
}), async (req, res) => {
    try {
        const data = req.body;

        const addRecipe = Object.assign({},
            data.title === undefined ? null : {title: data.title},
            data.prepTime === undefined ? null : {prepTime: data.prepTime},
            data.servings === undefined ? null : {servings: data.servings},
            data.description === undefined ? null : {description: data.description}
        )

        // add a recipe data
        const recipeRef = db.collection('recipes').doc();
        await recipeRef.set(addRecipe);


        // add all diets data to recipe
        for(let diet of data.diets)
        {
            const addDiet = Object.assign({},
                diet === undefined ? null : {name: diet}
            )

            await recipeRef.collection('diets').doc().set(addDiet);
        }

        // add all ingredients to recipe
        for(let ingredient of data.ingredients)
        {
            const addIngredient = Object.assign({},
                ingredient.name === undefined ? null : {name: ingredient.name},
                ingredient.quantity === undefined ? null : {quantity: ingredient.quantity}
            )

            await recipeRef.collection('ingredients').doc().set(addIngredient);
        }

        // add all steps to recipe
        for(let step of data.steps)
        {
            const addStep = Object.assign({},
                step.number === undefined ? null : {number: step.number},
                step.content === undefined ? null : {content: step.content}
            )

            await recipeRef.collection('steps').doc().set(addStep);
        }


        // Send a response back to the frontend
        res.status(200).send({ success: true, message: 'Data added successfully', id: recipeRef.id });
    } catch (error) {
        console.error('Error adding : ', error);
        res.status(500).send({ success: false, message: 'An error occurred while adding data' });
    }
});

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`);
})
