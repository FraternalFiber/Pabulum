import {db} from "../firebase/firebase.mjs";


export const userSearchController = async (req, res) => {
    const data = req.query

    // Add search params to url only if they are not undefined
    const searchParams = Object.assign({},
        data.q === undefined ? "" : {query: data.q.toLowerCase()},
        //check if value is undefined / array / string - array needs to be printed with commas in between
        data.diet === undefined ? {diet: []} : {diet: Array.isArray(data.diet) ? data.diet: [data.diet]}
    );

    // get recipes with specific name
    // let collectionRef = db.collection('recipes').where('title', '==', query);

    // get recipes with specific name (case insensitive)
    let collectionRef = await db.collection('recipes')
        .where('title', '>=', searchParams.query)
        .where('title', '<=', searchParams.query + '\uf8ff');

    searchParams.diet.forEach(diet => {
        collectionRef = collectionRef.where('diets', 'array-contains', diet)
    });

    const snapshot = await collectionRef.get();
    let recipes = [];

    for (let doc of snapshot.docs) {
        const recipe = doc.data();

        // Fetch diets subcollection
        const dietsSnapshot = await doc.ref.collection('diets').get();
        recipe.diets = dietsSnapshot.docs.map(doc => doc.data());

        // Fetch ingredients subcollection
        const ingredientsSnapshot = await doc.ref.collection('ingredients').get();
        recipe.ingredients = ingredientsSnapshot.docs.map(doc => doc.data());

        // Fetch steps subcollection
        const stepsSnapshot = await doc.ref.collection('steps').get();
        recipe.steps = stepsSnapshot.docs.map(doc => doc.data());

        recipes.push(recipe);
    }


    //const documents = snapshot.docs.map(doc => doc.data());

    res.json(recipes);

};