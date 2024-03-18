import "dotenv/config.js";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const hostname = '127.0.0.1';
const port = 42069;

const APIKEY = process.env.APIKEY;

// Middleware for sending cross-origin resource sharing HTTP header, in order for client to access API responses
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.json({'status': 'Server is working properly'});
});


//response for search result
app.get('/search', async (req, res) => {
    let {query, ingredients, cuisine, diet, type} = req.body;
    const number = 5;

    if(query === undefined) query = '';
    if(ingredients === undefined) ingredients = '';
    if(cuisine === undefined) cuisine = '';
    if(diet === undefined) diet = '';
    if(type === undefined) type = '';

    try
    {
        console.log(APIKEY);
        console.log(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${APIKEY}&query=${query}&instructionsRequired=true&includeIngredients=${ingredients}&cuisine=${cuisine}&diet=${diet}&type=${type}&number=${number}`);
        fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${APIKEY}&query=${query}&instructionsRequired=true&includeIngredients=${ingredients}&cuisine=${cuisine}&diet=${diet}&type=${type}&number=${number}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.toString());
                res.json(data);
            });
    }
    catch (error)
    {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

//details of specific recipe containing detailed informations and instructions
app.get('/search/:id', async (req, res) => {
    const id = req.params.id;

    try
    {
        fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${APIKEY}`)
            .then((response) => response.json())
            .then((infoData) => {
                fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${APIKEY}`)
                    .then((response) => response.json())
                    .then((recipeData) => {
                        res.json(Object.assign({}, infoData, recipeData));
                    });
            });


    }
    catch (error)
    {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`);
})