import {useQuery} from "@tanstack/react-query";
import {BACKEND_SERVER_URL} from "@/helpers/constants.ts";
import {TRecipeDetails} from "@/types/TRecipeDetails.ts";

export const getRecipe = async (id: string) => {
  return fetch(`${BACKEND_SERVER_URL}/recipe/${id}`)
      .then(res => res.json())
      .catch((error) => {
        throw ('Backend API connection error: ' + error)
      })
}

export const useRecipe = (id: string) => {
  console.log(id)
  return useQuery<TRecipeDetails>({
    queryKey: ['recipe', id],
    queryFn: () => getRecipe(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // keep data fresh for infinity until user refreshes the page
    gcTime: Infinity // don't garbage collect
  })
}