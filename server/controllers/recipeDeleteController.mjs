import {bucket, db} from "../firebase/firebase.mjs";
import path from 'path';
import url from 'url';

export const recipeDeleteController = async (req, res) => {
    try {
        const id = req.params.id;

        const recipeRef = db.collection('recipes').doc(id);
        const oldData = (await recipeRef.get()).data();

        // Delete the image from the storage
        if (oldData.image) {
            // Parse the URL and extract the pathname
            const imageUrl = url.parse(oldData.image);
            const imagePath = imageUrl.pathname;

            // Remove the leading '/' from the pathname and get the file path
            const filePath = path.join(imagePath.slice(1));

            // Remove the bucket name from the file path
            const bucketName = 'pabulum-zsk.appspot.com/';
            const blobFilePath = filePath.slice(bucketName.length);

            const oldBlob = bucket.file(blobFilePath);
            await oldBlob.delete();
        }

        // Delete the recipe document
        await recipeRef.delete();

        // Send a response back to the frontend
        res.status(200).send({success: true, message: 'Data deleted successfully', id: id});
    } catch (error) {
        console.error('Error deleting: ', error);
        res.status(500).send({success: false, message: 'An error occurred while deleting data'});
    }
};
