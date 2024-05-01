import {BACKEND_SERVER_URL, POST_RECIPE_ERROR_MESSAGE} from "@/helpers/constants.ts";

// service for posting recipe data to server
export const postRecipe = async (data = {}) => {
  try {
    const response = await fetch(`${BACKEND_SERVER_URL}/recipe/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return await response.json()
  }
  catch (error) {
    console.error(`${POST_RECIPE_ERROR_MESSAGE}: ${error}`)
    throw error
  }
}