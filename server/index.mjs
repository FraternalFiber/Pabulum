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

// test data for fetching
app.get('/search', (req, res) => {
    res.json({
        'results': [

            {
                "id": 511728,
                "title": "Pasta Margherita",
                "image": "https://spoonacular.com/recipeImages/511728-312x231.jpg",
                "imageType": "jpg"
            },
            {
                "id": 654857,
                "title": "Pasta On The Border",
                "image": "https://spoonacular.com/recipeImages/654857-312x231.jpg",
                "imageType": "jpg"
            },
            {
                "id": 654883,
                "title": "Pasta Vegetable Soup",
                "image": "https://spoonacular.com/recipeImages/654883-312x231.jpg",
                "imageType": "jpg"
            },
            {
                "id": 654928,
                "title": "Pasta With Italian Sausage",
                "image": "https://th.bing.com/th/id/OIP.tFTGR2oMQjtmffFr3PD4JAHaEK?rs=1&pid=ImgDetMain",
                "imageType": "jpg"
            },
            {
                "id": 654959,
                "title": "Pasta With Tuna",
                "image": "https://spoonacular.com/recipeImages/654959-312x231.jpg",
                "imageType": "jpg"
            },
            {
                "id": 654926,
                "title": "Pasta With Gorgonzola Sauce",
                "image": "https://spoonacular.com/recipeImages/654926-312x231.jpg",
                "imageType": "jpg"
            },
            {
                "id": 654944,
                "title": "Pasta With Salmon Cream Sauce",
                "image": "https://spoonacular.com/recipeImages/654944-312x231.jpg",
                "imageType": "jpg"
            },
            {
                "id": 654905,
                "title": "Pasta With Chickpeas and Kale",
                "image": "https://spoonacular.com/recipeImages/654905-312x231.jpg",
                "imageType": "jpg"
            },
            {
                "id": 654901,
                "title": "Pasta With Chicken and Broccoli",
                "image": "https://spoonacular.com/recipeImages/654901-312x231.jpg",
                "imageType": "jpg"
            },
            {
                "id": 654913,
                "title": "Pasta With Chicken and Mushrooms",
                "image": "https://spoonacular.com/recipeImages/654913-312x231.jpg",
                "imageType": "jpg"
            }
        ]
    });
})

app.get('/search/:id', (req, res) => {
    if(req.params.id == 1) {
        res.json({
            "vegetarian": false,
            "vegan": false,
            "glutenFree": false,
            "dairyFree": false,
            "title": "Pasta With Tuna",
            "image": "https://spoonacular.com/recipeImages/654959-556x370.jpg",
        })
    }
})

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`);
})