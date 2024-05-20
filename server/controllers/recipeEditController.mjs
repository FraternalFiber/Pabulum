import {bucket, db} from "../firebase/firebase.mjs";

export const recipeEditController = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const file = req.file;

        console.log('data', data)
        console.log('file', file)

        const recipeRef = db.collection('recipes').doc(id);
        const oldData = (await recipeRef.get()).data();

        // If a new image is uploaded, replace the old one
        if (file && oldData.image !== `https://storage.googleapis.com/recipeImages/${file.originalname}`) {
            const blob = bucket.file(`recipeImages/${req.file.originalname}`);
            const blobStream = blob.createWriteStream();

            blobStream.on('error', (err) => {
                console.error(`(Error while uploading image) :${err.message}`);
                throw err;
            });

            blobStream.on('finish', async () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

                // Make the file public
                try {
                    await blob.makePublic();
                    console.log(`public url to image: ${publicUrl}`);
                    data.image = publicUrl;
                    // Update the recipe data in the database
                    await recipeRef.update(data);
                } catch (err) {
                    console.error('Error making file public:', err);
                    throw err;
                }
            });

            blobStream.end(req.file.buffer);
        } else if (!file) {
            // If no new image is uploaded, delete the old image and its link
            const oldBlob = bucket.file(`recipeImages/${oldData.image}`);
            await oldBlob.delete();
            data.image = null;
            await recipeRef.update(data);
        }

        // Update all diets data of the recipe
        await recipeRef.collection('diets').get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
        for (let diet of data.diets) {
            const editDiet = Object.assign({},
                diet === undefined ? null : {name: diet}
            )
            await recipeRef.collection('diets').doc().set(editDiet);
        }

        // Update all ingredients of the recipe
        await recipeRef.collection('ingredients').get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
        for (let ingredient of data.ingredients) {
            const editIngredient = Object.assign({},
                ingredient.name === undefined ? null : {name: ingredient.name},
                ingredient.quantity === undefined ? null : {quantity: ingredient.quantity}
            )
            await recipeRef.collection('ingredients').doc().set(editIngredient);
        }

        // Update all steps of the recipe
        await recipeRef.collection('steps').get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
        for (let step of data.steps) {
            const editStep = Object.assign({},
                step.number === undefined ? null : {number: step.number},
                step.instruction === undefined ? null : {instruction: step.instruction}
            )
            await recipeRef.collection('steps').doc().set(editStep);
        }

        // Send a response back to the frontend
        res.status(200).send({success: true, message: 'Data updated successfully', id: recipeRef.id});
    } catch (error) {
        console.error('Error updating: ', error);
        res.status(500).send({success: false, message: 'An error occurred while updating data'});
    }
};
