import {bucket, db} from "../firebase/firebase.mjs";
import path from 'path';

export const userRecipeDeleteController = async (req, res) => {
    try {
        const id = req.params.id;

        const recipeRef = db.collection('recipes').doc(id);

        const oldData = (await recipeRef.get()).data();
        // Delete the image from the storage
        if (oldData && oldData.image != null) {
            // Parse the URL and extract the pathname
            const imageUrl = new URL(oldData.image);
            const imagePath = imageUrl.pathname;

            // Remove the leading '/' from the pathname and get the file path
            const filePath = path.join(imagePath.slice(1));

            // Remove the bucket name from the file path
            const bucketName = 'pabulum-zsk.appspot.com/';
            const blobFilePath = filePath.slice(bucketName.length);

            const oldBlob = bucket.file(blobFilePath);
            const [exists] = await oldBlob.exists();

            if(exists) {
                await oldBlob.delete();
            }
            else {
                console.log(`No file exists at path: ${blobFilePath}`);
            }
        }

        // Delete the 'diets' subcollection
        const dietsCollection = recipeRef.collection('diets');
        const dietsSnapshot = await dietsCollection.get();
        dietsSnapshot.forEach(doc => {
            dietsCollection.doc(doc.id).delete();
        });

        // Delete the 'ingredients' subcollection
        const ingredientsCollection = recipeRef.collection('ingredients');
        const ingredientsSnapshot = await ingredientsCollection.get();
        ingredientsSnapshot.forEach(doc => {
            ingredientsCollection.doc(doc.id).delete();
        });

        // Delete the 'steps' subcollection
        const stepsCollection = recipeRef.collection('steps');
        const stepsSnapshot = await stepsCollection.get();
        stepsSnapshot.forEach(doc => {
            stepsCollection.doc(doc.id).delete();
        });


        // Delete the recipe document
        await recipeRef.delete();

        // Send a response back to the frontend
        console.log("deleted")
        res.status(200).send({success: true, message: 'Data deleted successfully', id: id});
    } catch (error) {
        console.error('Error deleting: ', error);
        res.status(500).send({success: false, message: 'An error occurred while deleting data'});
    }
};
