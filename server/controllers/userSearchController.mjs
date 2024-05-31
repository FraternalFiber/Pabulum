import {db} from "../firebase/firebase.mjs";

export const userSearchController = async (req, res) => {
    const data = req.query

    const offset = data.offset || 0;
    const limit = 9;


    const searchAll = data.q === undefined && data.diet === undefined;

    const searchParams = Object.assign({},
        data.q === undefined ? {query: ""} : {query: data.q.toLowerCase()},
        // Check if value is undefined / array / string - array needs to be printed with commas in between
        data.diet === undefined ? {diet: []} : {diet: Array.isArray(data.diet) ? data.diet: [data.diet]}
    );


    try
    {
        let collectionRef = db.collection('recipes').orderBy('title');// Order the collection by title

        // Query for all recipes
        // if(!searchAll)
        // {
        //     // Check for diets
        //     // searchParams.diet.forEach(diet => {
        //     //     collectionRef = collectionRef.where("diets.name", "array-contains", diet);
        //     // });
        //
        // }

        if (offset > 0)
        {
            const snapshot = await collectionRef.limit(offset * limit).get(); // Get the last document of the previous page
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];

            collectionRef = collectionRef.startAfter(lastDoc).limit(limit); // Start after the last document of the previous page
        } else
        {
            collectionRef = collectionRef.limit(limit); // If there's no offset, just limit the results
        }

        const snapshot = await collectionRef.get();
        let recipes = [];

        for (let doc of snapshot.docs)
        {
            const recipe = doc.data();

            if(!searchAll)
            {
                // check if name matches query
                if(searchParams.query !== "" && !recipe.title.toLowerCase().includes(searchParams.query))
                {
                    continue;
                }

                // Fetch diets subcollection
                let dietsMatch = true;
                const dietsSnapshot = await doc.ref.collection('diets').get();
                searchParams.diet.forEach(diet => {
                    let found = false;
                    dietsSnapshot.forEach((dietDoc) => {
                        const dietName = dietDoc.data().name;
                        if(dietName === diet)
                        {
                            found = true;
                        }
                    });
                    if(!found)
                    {
                        dietsMatch = false;
                    }
                });
                if(!dietsMatch)
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