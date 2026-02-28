import fs from "fs";
import * as path from "node:path";

const __dirname = path.resolve(path.dirname(""));
const filePath = path.join(__dirname + "/recipe.json");

// Controller returning a saved recipe from file for testing purposes
export const testRecipeController = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", (err, fileData) => {
        if (err) {
          return reject(err);
        }

        return resolve(fileData);
      });
    });

    return res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error("Error fetching data from external API:", error);
    return res.status(500).json({ error: "An error occurred while fetching data" });
  }
};