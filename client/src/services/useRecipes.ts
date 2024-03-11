import {useQuery} from "@tanstack/react-query";
import {IRecipeResult} from "@/types/IRecipeResult.ts";

export const getRecipes = async () => {
  return fetch('http://127.0.0.1:42069/search')
      .then(res => res.json())
      .then(res => res.results)
      .catch((error) => {
        throw ('Backend API connection error: ' + error)
      })
}

export const useRecipes = () => {
  return useQuery<IRecipeResult[]>({
    queryKey: ['recipesSearchResults'],
    queryFn: getRecipes
  })
}