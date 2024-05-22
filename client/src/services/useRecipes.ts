import {QueryClient, useQuery, useQueryClient} from "@tanstack/react-query";
import {TRecipeResult} from "@/types/TRecipeResult.ts";
import {TRecipeSearchParams} from "@/types/TRecipeSearchParams.ts";
import {BACKEND_SERVER_URL} from "@/helpers/constants.ts";

export const getRecipes = async (searchParams: TRecipeSearchParams, queryClient: QueryClient) => {
  const url = new URL(`${BACKEND_SERVER_URL}/recipes/search?`)
  const params = new URLSearchParams({q: searchParams.q})

  // Add an array of filters to url.search params
  searchParams.diet.forEach(diet => params.append('diet', diet))
  searchParams.cuisine.forEach(cuisine => params.append('cuisine', cuisine))
  searchParams.mealType.forEach(mealType => params.append('mealType', mealType))
  url.search = params.toString()

  // If search results are in cache, return them to prevent a refetch
  const cachedData = queryClient.getQueryData(['searchResults', searchParams])
  if(cachedData) {
    return cachedData
  }

  return fetch(url)
      .then(res => res.json())
      .then(res => {
        // update the cache manually
        // queryClient.setQueryData(['searchResults', searchParams.q], res.results);
        return res.results
      })
      .catch((error) => {
        throw ('Backend API connection error: ' + error)
      })
}

// service used for fetching recipes data from backend
export const useRecipes = (searchParams: TRecipeSearchParams) => {
  const queryClient = useQueryClient()

  return useQuery<TRecipeResult[]>({
    queryKey: ['searchResults', searchParams],
    queryFn: () => getRecipes(searchParams, queryClient),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity, //keep data fresh for infinity until user refreshes the page
    gcTime: Infinity, //don't garbage collect
    // refetchInterval: false, //disable background refetching (not working)
  })
}