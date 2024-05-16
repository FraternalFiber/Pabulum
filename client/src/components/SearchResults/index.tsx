import {RecipeResultCard} from "@/components/RecipeResultCard/index.js";
import {useRecipes} from "@/services/useRecipes.ts";
import {useEffect} from "react";
import {TRecipeSearchParams} from "@/types/TRecipeSearchParams.ts";
import {useSearchParams} from "react-router-dom";
import {LoadingSkeletons} from "@/components/SearchResults/LoadingSkeletons.tsx";
import {ErrorAlert} from "@/components/ErrorAlert/ErrorAlert.tsx";
import {NoResults} from "@/components/SearchResults/NoResults.tsx";

// Container with recipes result cards shown after submitting a SearchForm
export function SearchResults(searchParams: TRecipeSearchParams) {
    const [URLSearchParams] = useSearchParams()
    const {data: recipes, isLoading, isError, refetch} = useRecipes(searchParams)

    // Refetch when search params changed
    useEffect(() => {
        refetch()
    }, [URLSearchParams])

    if(isLoading) {
        return (
            <LoadingSkeletons/>
        )
    }

    if (isError) {
        return (
            <ErrorAlert className={'mt-16'} message={'Sorry, we couldn\'t load your recipes.'}/>
        )
    }

    return (
        recipes?.length //if recipes is not null and not empty
            ? (
                <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}>
                    {recipes.map((result) => (
                        <RecipeResultCard id={result.id} title={result.title} imageUrl={result.image} key={result.id}/>
                    ))}
                </div>
            )
            : (
                <div>
                    <NoResults query={searchParams.q}/>
                </div>
            )
    )
}