import {useQuery} from "@tanstack/react-query";
import {IRecipeResult} from "@/types/IRecipeResult.ts";
import {IRecipeSearchParams} from "@/types/IRecipeSearchParams.ts";

export const getRecipes = async (searchParams : IRecipeSearchParams) => {
  const url = new URL('http://127.0.0.1:42069/search?')
  const params = new URLSearchParams({q: searchParams.q})

  // Add an array of filters to url.search params
  searchParams.diet.forEach(diet => params.append('diet', diet))
  searchParams.cuisine.forEach(cuisine => params.append('cuisine', cuisine))
  searchParams.mealType.forEach(mealType => params.append('mealType', mealType))
  url.search = params.toString()

  return fetch(url)
      .then(res => res.json())
      .then(res => res.results)
      .catch((error) => {
        throw ('Backend API connection error: ' + error)
      })
}

// service used for fetching recipes data from backend
export const useRecipes = (searchParams : IRecipeSearchParams) => {
  return useQuery<IRecipeResult[]>({
    queryKey: ['recipesSearchResults'],
    queryFn: () => getRecipes(searchParams),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 60 * 60 * 1000 //garbage collect after 60 minutes
  })
}