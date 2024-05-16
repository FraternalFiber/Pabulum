import {BACKEND_SERVER_URL, POST_RECIPE_ERROR_MESSAGE} from "@/helpers/constants.ts";

// Service for posting recipe data to server
export const postRecipe = async (data: any) => {
  try {
    console.log('data', data)

    // Create a formData object to store data from multipart/form-data form
    const formData = new FormData()

    // Append image to formData without JSON transformation and delete it from data object
    formData.append('image', data.image)
    delete data.image

    // Convert every property except image to JSON string format
    for (const key in data) {
      formData.append(key, JSON.stringify(data[key]))
    }

    const response = await fetch(`${BACKEND_SERVER_URL}/recipe/add`, {
      method: 'POST',
      body: formData
    })

    return response.json()
  }
  catch (error) {
    console.error(`${POST_RECIPE_ERROR_MESSAGE}: ${error}`)
    throw error
  }
}