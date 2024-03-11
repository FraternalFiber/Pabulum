import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const hostname = '127.0.0.1';
const port = 42069;

const apiKey = 'be6aa7cad3344fcfb7e42160439875fa';

// Middleware for sending cross-origin resource sharing HTTP header, in order for client to access API responses
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.json({'status': 'Server is working properly'});
});

app.get('/search', async (req, res) => {
    const {query, ingredients} = req.body;
    const amount = 5;

    try {
        fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&instructionsRequired=true&includeIngredients=${ingredients}&fillIngredients=true&addRecipeInformation=true&number=${amount}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.toString());
                res.json(data);
            });
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`);
})