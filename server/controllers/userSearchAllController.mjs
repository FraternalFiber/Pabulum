import {db} from "../firebase/firebase.mjs";

export const userSearchAllController = async (req, res) => {
    const offset = req.query.offset || 0;
    // Limit of recipes
    const limit = 10;

    console.log(offset);
    try {
        let collectionRef = db.collection('recipes').orderBy('title'); // Order the collection by title

        if (offset > 0) {
            const snapshot = await collectionRef.limit(offset * limit).get(); // Get the last document of the previous page
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];

            collectionRef = collectionRef.startAfter(lastDoc).limit(limit); // Start after the last document of the previous page
        } else {
            collectionRef = collectionRef.limit(limit); // If there's no offset, just limit the results
        }

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

        res.json(recipes);
    } catch (error) {
        console.error('Error fetching data from Firebase:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
};
