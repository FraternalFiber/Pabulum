import "dotenv/config.js";
import express from 'express';
import cors from 'cors';

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

var counter = 0

//response for search result
app.get('/search', async (req, res) => {
    const data = req.query
    counter += 1
    console.log('q: ' + data.q + ' (' + counter + ')')
    const url = 'https://api.spoonacular.com/recipes/complexSearch?' + new URLSearchParams({
      apiKey: SPOONACULAR_APIKEY,
      instructionsRequired: true,
      query: data.q
    })
    // console.log(url)
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data.toString());
            res.json(data);
        });
    // let {q, ingredients, cuisine, diet, type} = req.body;
    // console.log(req.body)
    // const number = 5;
    //
    // if(q === undefined) q = '';
    // if(ingredients === undefined) ingredients = '';
    // if(cuisine === undefined) cuisine = '';
    // if(diet === undefined) diet = '';
    // if(type === undefined) type = '';
    //
    // try
    // {
    //     // console.log(SPOONACULAR_APIKEY);
    //     // console.log(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_APIKEY}&query=${q}&instructionsRequired=true&includeIngredients=${ingredients}&cuisine=${cuisine}&diet=${diet}&type=${type}&number=${number}`);
    //     fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_APIKEY}&query=${q}&instructionsRequired=true&includeIngredients=${ingredients}&cuisine=${cuisine}&diet=${diet}&type=${type}&number=${number}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             // console.log(data.toString());
    //             res.json(data);
    //         });
    // }
    // catch (error)
    // {
    //     console.error('Error fetching data from external API:', error);
    //     res.status(500).json({ error: 'An error occurred while fetching data' });
    // }
});

//details of specific recipe containing detailed information and instructions
app.get('/recipe/:id', async (req, res) => {
    const id = req.params.id;

    try
    {
        fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_APIKEY}&instructionsRequired=true`)
            .then((response) => response.json())
            .then((data) => {
                res.json(data);
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