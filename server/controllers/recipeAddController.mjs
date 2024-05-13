import {db} from "../firebase/firebase.mjs";


export const recipeAddController = async (req, res) => {
    console.log('recipe add działa bo czemu ma nie działać')
    try {
        const data = req.body;
        const file = req.file;

        console.log('data', data)
        console.log('file', file)


        // const addRecipe = Object.assign({},
        //     data.title === undefined ? null : {title: data.title},
        //     data.prepTime === undefined ? null : {prepTime: data.prepTime},
        //     data.servingsNumber === undefined ? null : {servingsNumber: data.servingsNumber},
        //     data.description === undefined ? null : {description: data.description}
        // )
        //
        // console.log("add recipe value: ", addRecipe)
        //
        // // add a recipe data
        // const recipeRef = db.collection('recipes').doc();
        // await recipeRef.set(addRecipe);
        //
        //
        // // add all diets data to recipe
        // for (let diet of data.diets) {
        //     const addDiet = Object.assign({},
        //         diet === undefined ? null : {name: diet}
        //     )
        //
        //     await recipeRef.collection('diets').doc().set(addDiet);
        // }
        //
        // // add all ingredients to recipe
        // for (let ingredient of data.ingredients) {
        //     const addIngredient = Object.assign({},
        //         ingredient.name === undefined ? null : {name: ingredient.name},
        //         ingredient.quantity === undefined ? null : {quantity: ingredient.quantity}
        //     )
        //
        //     await recipeRef.collection('ingredients').doc().set(addIngredient);
        // }
        //
        // // add all steps to recipe
        // for (let step of data.steps) {
        //     const addStep = Object.assign({},
        //         step.number === undefined ? null : {number: step.number},
        //         step.instruction === undefined ? null : {instruction: step.instruction}
        //     )
        //
        //     await recipeRef.collection('steps').doc().set(addStep);
        // }


        // Send a response back to the frontend
        // res.status(200).send({success: true, message: 'Data added successfully', id: recipeRef.id});
        res.status(200).send({success: true, message: 'Data added successfully'});
    } catch (error) {
        console.error('Error adding : ', error);
        res.status(500).send({success: false, message: 'An error occurred while adding data'});
    }
};