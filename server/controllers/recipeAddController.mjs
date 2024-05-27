import {bucket, db} from "../firebase/firebase.mjs";

export const recipeAddController = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;

        // console.log('data', data)
        // console.log('file', file)

        const addRecipe = Object.assign({},
            data.title === undefined ? null : {title: data.title},
            data.prepTime === undefined ? null : {prepTime: data.prepTime},
            data.servingsNumber === undefined ? null : {servingsNumber: data.servingsNumber},
            data.description === undefined ? null : {description: data.description}
        )

        const recipeRef = db.collection('recipes').doc();

        if(file !== undefined)
        {
            // Create a new blob in the bucket and upload the file data.
            const upload = new Promise((resolve, reject) => {
                const originalName = req.file.originalname;
                const blob = bucket.file(`recipeImages/recipeImg_${recipeRef.id}${originalName.slice(originalName.lastIndexOf('.'))}`);
                const blobStream = blob.createWriteStream();

                blobStream.on('error', (err) => {
                    reject(`(Error while uploading image) :${err.message}`);
                });

                blobStream.on('finish', () => {
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

                    // Make the file public
                    blob.makePublic().then(() => {
                        console.log(`public url to image: ${publicUrl}`);
                        addRecipe.image = publicUrl;
                        resolve();
                    }).catch(err => {
                        console.error('Error making file public:', err);
                        reject(err);
                    });
                });

                blobStream.end(req.file.buffer);
            });

            // Use the Promise
            // Called in a promise so image first uploads and it's link is ready to send
            upload.then(async () => {
                // Add a recipe data to database
                await recipeRef.set(addRecipe);
            }).catch((error) => {
                throw new Error(error);
            });
        }
        else
        {
            await recipeRef.set(addRecipe);
        }

        // Add all diets data to recipe
        for (let diet of data.diets) {
            const addDiet = Object.assign({},
                diet === undefined ? null : {name: diet}
            )

            await recipeRef.collection('diets').doc().set(addDiet);
        }

        // Add all ingredients to recipe
        for (let ingredient of data.ingredients) {
            const addIngredient = Object.assign({},
                ingredient.number === undefined ? null : {number: ingredient.number},
                ingredient.name === undefined ? null : {name: ingredient.name},
                ingredient.quantity === undefined ? null : {quantity: ingredient.quantity}
            )

            await recipeRef.collection('ingredients').doc().set(addIngredient);
        }

        // Add all steps to recipe
        for (let step of data.steps) {
            const addStep = Object.assign({},
                step.number === undefined ? null : {number: step.number},
                step.instruction === undefined ? null : {instruction: step.instruction}
            )

            await recipeRef.collection('steps').doc().set(addStep);
        }

        // Send a response back to the frontend
        res.status(200).send({success: true, message: 'Data added successfully', id: recipeRef.id});
    } catch (error) {
        console.error('Error adding: ', error);
        res.status(500).send({success: false, message: 'An error occurred while adding data'});
    }
};