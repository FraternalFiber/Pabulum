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
    console.log(`q ${counter}: ${data.q}`)
    console.log(data)

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
            // console.log(data.toString());
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
            })
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