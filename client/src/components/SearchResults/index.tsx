import {RecipeResultCard} from "@/components/RecipeResultCard/index.js";
// import {IRecipeResult} from "@/types/IRecipeResult.ts";
import {useRecipes} from "@/services/useRecipes.ts";

interface SearchResultsProps {
    // results: Array<IRecipeResult> | undefined
    query: string
}

// Container with recipes result cards shown after submitting a SearchForm
// export function SearchResults({results}: SearchResultsProps) {
export function SearchResults({query}: SearchResultsProps) {
    const {
      data: recipes,
      isLoading: recipesLoading,
      error: recipesError
    } = useRecipes(query)

    if(recipesLoading) {
        return <p>Loading...</p>
    }

    if(recipesError) {
        return <p>An error occurred while fetching recipes</p>
    }

    console.log(recipes)

    return (
        <>
            {recipes?.length //if recipes is not null and not empty
                ? (
                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-100 gap-5'}>
                        {recipes.map((result) => (
                            <RecipeResultCard id={result.id} title={result.title} imageUrl={result.image} key={result.id}/>
                        ))}
                    </div>
                )
                : (
                    <div>
                        <p>No results</p>
                    </div>
                )
            }
        </>
    )
}