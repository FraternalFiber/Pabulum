import {useQuery} from "@tanstack/react-query";
import {IRecipeResult} from "@/types/IRecipeResult.ts";
// import {IRecipeSearchParams} from "@/types/IRecipeSearchParams.ts";

export const getRecipes = async (query : string) => {
  // if(recipeSearchParams != null) {
  const url = new URL('http://127.0.0.1:42069/search?')
  url.search = new URLSearchParams({q: query}).toString()

  return fetch(url)
      .then(res => res.json())
      .then(res => res.results)
      .catch((error) => {
        throw ('Backend API connection error: ' + error)
      })
}

export const useRecipes = (query : string) => {
  return useQuery<IRecipeResult[]>({
    queryKey: ['recipesSearchResults'],
    queryFn: () => getRecipes(query),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 60 * 60 * 1000 //garbage collect after 60 minutes
  })
}