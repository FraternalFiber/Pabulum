const SPOONACULAR_APIKEY = process.env.SPOONACULAR_APIKEY;

export const searchController = async (req, res) => {
    const data = req.query

    // add search params to url only if they are not undefined
    const searchParams = Object.assign({},
        data.q === undefined ? null : {query: data.q},
        //check if value is undefined / array / string - array needs to be printed with commas in between
        data.diet === undefined ? null : {diet: Array.isArray(data.diet) ? data.diet.join(',') : data.diet},
        data.cuisine === undefined ? null : {cuisine: Array.isArray(data.cuisine) ? data.cuisine.join(',') : data.cuisine},
        data.mealType === undefined ? null : {type: Array.isArray(data.mealType) ? data.mealType.join(',') : data.mealType}
    );

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
};