import { BACKEND_SERVER_URL, DELETE_RECIPE_ERROR_MESSAGE } from "@/helpers/constants.ts";

// Service for posting recipe data to server
export const deleteRecipe = async (id: string) => {
  try {
    const response = await fetch(`${BACKEND_SERVER_URL}/user/recipes/${id}`, {
      method: 'DELETE',
    })

    return response.json()
  }
  catch (error) {
    console.error(`${DELETE_RECIPE_ERROR_MESSAGE}: ${error}`)
    throw error
  }
}