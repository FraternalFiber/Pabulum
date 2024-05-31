import { BACKEND_SERVER_URL, DELETE_RECIPE_ERROR_MESSAGE } from "@/helpers/constants.ts";
import { QueryClient } from "@tanstack/react-query";

// Service for posting recipe data to server
export const deleteRecipe = async (id: string, queryClient: QueryClient) => {
  try {
    const response = await fetch(`${BACKEND_SERVER_URL}/user/recipes/${id}`, {
      method: "DELETE",
    });

    // Remove recipe details from cache and all user search results (to have fresh data)
    queryClient.removeQueries({ queryKey: ["recipe", "user", id] });
    queryClient.removeQueries({ queryKey: ["userSearchResults"] });

    return response.json();
  } catch (error) {
    console.error(`${DELETE_RECIPE_ERROR_MESSAGE}: ${error}`);
    throw error;
  }
};
