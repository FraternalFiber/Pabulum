import { TUserRecipeSearchParams } from "@/types/TUserRecipeSearchParams.ts";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { TRecipeResult } from "@/types/TRecipeResult.ts";
import { BACKEND_SERVER_URL } from "@/helpers/constants.ts";

// Function for fetching user recipes
const getUserRecipes = async (searchParams: TUserRecipeSearchParams, queryClient: QueryClient) => {
  const url = new URL(`${BACKEND_SERVER_URL}/user/recipes/search?`)
  // const params = new URLSearchParams({q: searchParams.q})
  const params = new URLSearchParams()

  // Add an array of filters to url.search params
  if (searchParams.q) params.append('q', searchParams.q)
  searchParams.diet?.forEach(diet => params.append('diet', diet))

  url.search = params.toString()

  // If search results are in cache, return them to prevent a refetch
  const cachedData = queryClient.getQueryData(['userSearchResults', searchParams])
  if(cachedData) {
    return cachedData
  }

  return fetch(url)
    .then(res => res.json())
    .then(res => {
      return res
    })
    .catch((error) => {
      throw ('Backend API connection error: ' + error)
    })
}

// Service used for fetching recipes data from API or user database
export const useUserRecipes = (searchParams: TUserRecipeSearchParams) => {
  const queryClient = useQueryClient()

  return useQuery<TRecipeResult[]>({
    queryKey: ["userSearchResults", searchParams],
    queryFn: () => getUserRecipes(searchParams, queryClient),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity, //keep data fresh for infinity until user refreshes the page
    gcTime: Infinity, //don't garbage collect
  });
}