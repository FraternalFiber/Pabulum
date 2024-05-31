import { BACKEND_SERVER_URL } from "@/helpers/constants.ts";
import { QueryClient } from "@tanstack/react-query";

// Service for editing recipe data
export const editRecipe = async (data: any, queryClient: QueryClient, recipeId: string) => {
  try {
    // Create a formData object to store data from multipart/form-data form
    const formData = new FormData();

    // Append image to formData without JSON transformation and delete it from data object
    formData.append("image", data.image);
    delete data.image;

    // Convert every property except image to JSON string format
    for (const key in data) {
      formData.append(key, JSON.stringify(data[key]));
    }

    const response = await fetch(`${BACKEND_SERVER_URL}/user/recipes/${recipeId}`, {
      method: "PUT",
      body: formData,
    });

    // Remove all user search results from cache (to have fresh data)
    queryClient.removeQueries({ queryKey: ["userSearchResults"] });
    queryClient.removeQueries({ queryKey: ["recipe", "user", recipeId] });

    return response.json();
  } catch (error) {
    console.error(`Edit recipe error: ${error}`);
    throw error;
  }
};
