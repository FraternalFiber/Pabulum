import {useQuery} from "@tanstack/react-query";

export const getRecipe = async (id: string) => {
  return fetch(`http://127.0.0.1:42069/recipe/${id}`)
      .then(res => res.json())
      .catch((error) => {
        throw ('Backend API connection error: ' + error)
      })
}

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(id)
  })
}