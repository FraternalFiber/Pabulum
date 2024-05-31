import {useQuery} from "@tanstack/react-query";
import {BACKEND_SERVER_URL} from "@/helpers/constants.ts";
import {TRecipeDetails} from "@/types/TRecipeDetails.ts";
import { TDataSource } from "@/types/TDataSource.ts";

export const getRecipe = async (id: string, dataSource: TDataSource) => {
  // Create a URL for fetch depending on data source (online/user)
  const url = BACKEND_SERVER_URL.concat(dataSource === 'online'
    ? `/recipes/${id}`
    : `/user/recipes/${id}`)

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw {
          status: res.status,
          statusText: res.statusText
        }
      }

      return res.json();
    })
    .catch((error) => {
      throw { error: error.statusText, status: error.status };
    });
}

export const useRecipe = (id: string, source: TDataSource) => {
  return useQuery<TRecipeDetails>({
    queryKey: ['recipe', source, id],
    queryFn: () => getRecipe(id, source),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // keep data fresh for infinity until user refreshes the page
    gcTime: Infinity, // don't garbage collect
    // retry: false // try fetching only once
  })
}