import express from 'express';
import cors from 'cors';

const app = express();
const hostname = '127.0.0.1';
const port = 42069;

// Middleware for sending cross-origin resource sharing HTTP header, in order for client to access API responses
app.use(cors());

app.get('/', (req, res) => {
   res.json({'status': 'Server is working properly'});
});

// test fetch data
app.get('/search', (req, res) => {
    res.json({
        'results': [
            {
                "id": 654959,
                "title": "Pasta With Tuna",
                "image": "https://spoonacular.com/recipeImages/654959-312x231.jpg",
                "imageType": "jpg"
            },
        ]
    });
})

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`);
})