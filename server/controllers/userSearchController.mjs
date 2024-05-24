import {db} from "../firebase/firebase.mjs";

export const userSearchController = async (req, res) => {
    const data = req.query
    const offset = data.offset || 0;
    // Limit of recipes
    const limit = 9;
    console.log(data);
    console.log(offset);

    const searchAll = data.q === undefined && data.diet === undefined;

    const searchParams = Object.assign({},
        data.q === undefined ? "" : {query: data.q.toLowerCase()},
        //check if value is undefined / array / string - array needs to be printed with commas in between
        data.diet === undefined ? {diet: []} : {diet: Array.isArray(data.diet) ? data.diet: [data.diet]}
    );

    try
    {
        let collectionRef;

        //query for all recipes
        if(searchAll)
        {
            collectionRef = db.collection('recipes').orderBy('title'); // Order the collection by title

            if (offset > 0)
            {
                console.log("offset")
                const snapshot = await collectionRef.limit(offset * limit).get(); // Get the last document of the previous page
                const lastDoc = snapshot.docs[snapshot.docs.length - 1];

                collectionRef = collectionRef.startAfter(lastDoc).limit(limit); // Start after the last document of the previous page
            } else
            {
                collectionRef = collectionRef.limit(limit); // If there's no offset, just limit the results
            }
        }
        //query for recipes with filters included
        else
        {
            // Add search params to url only if they are not undefined


            // get recipes with specific name
            // collectionRef = db.collection('recipes').where('title', '==', query);

            // disabled /doesn't work
            // get recipes with specific name (case insensitive)
            /*collectionRef = await db.collection('recipes')
                .where('title', '>=', searchParams.query)
                .where('title', '<=', searchParams.query + '\uf8ff')
                .limit(limit);*/

            //check for names has to be handled later on, since firebase doesn't support case insensitive query
            collectionRef = await db.collection('recipes');

            //check for diets
            searchParams.diet.forEach(diet => {
                collectionRef = collectionRef.where('diets', 'array-contains', diet)
            });

        }

        const snapshot = await collectionRef.get();
        let recipes = [];

        for (let doc of snapshot.docs)
        {
            const recipe = doc.data();

            /*
            // Fetch diets subcollection
            const dietsSnapshot = await doc.ref.collection('diets').get();
            recipe.diets = dietsSnapshot.docs.map(doc => doc.data());

            // Fetch ingredients subcollection
            const ingredientsSnapshot = await doc.ref.collection('ingredients').get();
            recipe.ingredients = ingredientsSnapshot.docs.map(doc => doc.data());

            // Fetch steps subcollection
            const stepsSnapshot = await doc.ref.collection('steps').get();
            recipe.steps = stepsSnapshot.docs.map(doc => doc.data());
            */

            if(!searchAll)
            {
                if(!recipe.title.toLowerCase().includes(searchParams.query))
                {
                    continue;
                }
            }

            const finalRecipe = Object.assign({},
                {id: doc.id},
                recipe.title === undefined ? {} : {title: recipe.title},
                //check if value is undefined / array / string - array needs to be printed with commas in between
                recipe.image === undefined ? {} : {image: recipe.image}
            );

            recipes.push(finalRecipe);
        }

        //const documents = snapshot.docs.map(doc => doc.data());

        res.json(recipes);
    }
    catch (error)
    {
        console.error('Error fetching data from Firebase:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }

};