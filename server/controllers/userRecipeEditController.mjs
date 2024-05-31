import { bucket, db } from "../firebase/firebase.mjs";
import path from "path";

export const userRecipeEditController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const file = req.file;

    console.log("data", data);
    console.log("file", file);

    const recipeRef = db.collection("recipes").doc(id);
    const oldData = (await recipeRef.get()).data();

    // if (file && oldData.image !== `https://storage.googleapis.com/recipeImages/${file.originalname}`) {
    // If a new image is uploaded => user added or changed image. Delete an old image and upload a new one.
    if (file) {
      // Delete old image
      if (oldData.image) {
        // Parse the URL and extract the pathname
        const imagePath = new URL(oldData.image).pathname;
        // Get file name from path
        const fileName = path.basename(imagePath);
        const oldBlob = bucket.file(`recipeImages/${fileName}`);
        const [exists] = await oldBlob.exists();

        if (exists) {
          // Delete image file
          await oldBlob.delete();
          console.log("OLD IMAGE DELETED");
        } else {
          console.log(`No file exists at path: ${oldBlob.name}`);
        }
      }

      const fileExtension = path.extname(req.file.originalname);
      const timestamp = Date.now();
      const blob = bucket.file(`recipeImages/recipeImg_${recipeRef.id}_${timestamp}${fileExtension}`);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.error(`(Error while uploading image) :${err.message}`);
        throw err;
      });

      blobStream.on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        // Make the file public
        try {
          await blob.makePublic();
          console.log(`public url to image: ${publicUrl}`);
          // Update the image property in database
          await recipeRef.update({
            image: publicUrl,
          });
        } catch (err) {
          console.error("Error making file public:", err);
          throw err;
        }
      });

      blobStream.end(req.file.buffer);
      // If no image is uploaded and file was changed => user removed the image, so delete the old image and its link.
      // Otherwise, file has not been changed.
    } else if (data.imageChanged && oldData.image) {
      // DELETE IMAGE
      // Parse the URL and extract the pathname
      const imagePath = new URL(oldData.image).pathname;
      // Get file name from path
      const fileName = path.basename(imagePath);
      const oldBlob = bucket.file(`recipeImages/${fileName}`);
      const [exists] = await oldBlob.exists();

      if (exists) {
        // Delete image file
        await oldBlob.delete();
      } else {
        console.log(`No file exists at path: ${oldBlob.name}`);
      }
      // END DELETE IMAGE

      await recipeRef.update({
        image: null,
      });
    }

    // Update data
    await recipeRef.update({
      title: data.title,
      description: data.description,
      prepTime: data.prepTime,
      servingsNumber: data.servingsNumber,
    });

    // Update all diets data of the recipe
    await recipeRef.collection("diets").get().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });

    for (let diet of data.diets) {
      const editDiet = Object.assign({},
        diet === undefined ? null : { name: diet },
      );
      await recipeRef.collection("diets").doc().set(editDiet);
    }

    // Update all ingredients of the recipe
    await recipeRef.collection("ingredients").get().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });

    for (let ingredient of data.ingredients) {
      const editIngredient = Object.assign({},
        ingredient.name === undefined ? null : { name: ingredient.name },
        ingredient.quantity === undefined ? null : { quantity: ingredient.quantity },
      );
      await recipeRef.collection("ingredients").doc().set(editIngredient);
    }

    // Update all steps of the recipe
    await recipeRef.collection("steps").get().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });

    for (let step of data.steps) {
      const editStep = Object.assign({},
        step.number === undefined ? null : { number: step.number },
        step.instruction === undefined ? null : { instruction: step.instruction },
      );
      await recipeRef.collection("steps").doc().set(editStep);
    }

    // Send a response back to the frontend
    res.status(200).send({ success: true, message: "Data updated successfully", id: recipeRef.id });
  } catch (error) {
    console.error("Error updating: ", error.message);
    res.status(500).send({ success: false, message: "An error occurred while updating data" });
  }
};
