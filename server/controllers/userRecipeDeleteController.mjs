import { bucket, db } from "../firebase/firebase.mjs";
import path from "path";

export const userRecipeDeleteController = async (req, res) => {
  try {
    const id = req.params.id;

    const recipeRef = db.collection("recipes").doc(id);

    const oldData = (await recipeRef.get()).data();
    // Delete the image from the storage
    if (oldData && oldData.image) {
      // DELETE IMAGE
      // Parse the URL and extract the pathname
      const imagePath = new URL(oldData.image).pathname;
      // Get file name from path
      const fileName = path.basename(imagePath);
      const oldBlob = bucket.file(`recipeImages/${fileName}`);
      const [exists] = await oldBlob.exists();

      if (exists) {
        await oldBlob.delete();
      } else {
        console.log(`No file exists at path: ${oldBlob.name}`);
      }
      // END DELETE IMAGE
    }

    // Delete the 'diets' subcollection
    const dietsCollection = recipeRef.collection("diets");
    const dietsSnapshot = await dietsCollection.get();
    dietsSnapshot.forEach(doc => {
      dietsCollection.doc(doc.id).delete();
    });

    // Delete the 'ingredients' subcollection
    const ingredientsCollection = recipeRef.collection("ingredients");
    const ingredientsSnapshot = await ingredientsCollection.get();
    ingredientsSnapshot.forEach(doc => {
      ingredientsCollection.doc(doc.id).delete();
    });

    // Delete the 'steps' subcollection
    const stepsCollection = recipeRef.collection("steps");
    const stepsSnapshot = await stepsCollection.get();
    stepsSnapshot.forEach(doc => {
      stepsCollection.doc(doc.id).delete();
    });


    // Delete the recipe document
    await recipeRef.delete();

    // Send a response back to the frontend
    console.log("deleted");
    res.status(200).send({ success: true, message: "Data deleted successfully", id: id });
  } catch (error) {
    console.error("Error deleting: ", error);
    res.status(500).send({ success: false, message: "An error occurred while deleting data" });
  }
};
