import { db } from "../firebase/firebase.mjs"; // Import your Firebase configuration
import _ from "lodash";

export const userRecipeDetailController = async (req, res) => {
  const id = req.params.id;

  try {
    // Reference to the document
    const docRef = db.collection("recipes").doc(id);

    if (!(await docRef.get()).exists) {
      console.log("No such document");
      return res.status(404).json({ error: "Recipe not found" });
    }

    const data = (await docRef.get()).data();

    // Fetch the diets, ingredients, and steps subcollections from the data
    const diets = (await docRef.collection("diets").get()).docs.map(doc => doc.data()).map(diet => diet.name);
    let ingredients = (await docRef.collection("ingredients").get()).docs.map(doc => doc.data());
    let steps = (await docRef.collection("steps").get()).docs.map(doc => doc.data());

    // Sort ingredients and steps by number
    ingredients = _.sortBy(ingredients, "number");
    steps = _.sortBy(steps, "number");

    // Include the lists in the response
    const response = {
      ...data,
      diets,
      ingredients,
      steps,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
