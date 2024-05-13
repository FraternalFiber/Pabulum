import {BACKEND_SERVER_URL, POST_RECIPE_ERROR_MESSAGE} from "@/helpers/constants.ts";

// service for posting recipe data to server
export const postRecipe = async (data: any) => {
  try {
    console.log('data', data)

    const formData = new FormData()
    formData.append('title', data.title)
    // formData.append('image', data.image)
    formData.append('prepTime', data.prepTime)
    formData.append('servingsNumber', data.servingsNumber)
    formData.append('description', data.description)
    formData.append('diets', data.diets)
    formData.append('ingredients', data.ingredients)
    formData.append('steps', data.steps)

    // formData.append('testName', 'testValue')

    const response = await fetch(`${BACKEND_SERVER_URL}/recipe/add`, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: JSON.stringify(data)
      body: formData
    })

    console.log(response.json())

    return await response.json()
  }
  catch (error) {
    console.error(`${POST_RECIPE_ERROR_MESSAGE}: ${error}`)
    throw error
  }
}