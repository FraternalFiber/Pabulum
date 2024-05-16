import {SPOONACULAR_APIKEY} from "../constants.js";

export const recipeDetailController = async (req, res) => {
    const id = req.params.id;

    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_APIKEY}&instructionsRequired=true`;
    console.log("recipe url: ", url);
    try
    {
        fetch(url)
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
};