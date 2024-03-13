import {RecipeResultCard} from "@/components/RecipeResultCard/index.js";
import {IRecipeResult} from "@/types/IRecipeResult.ts";

interface SearchResultsProps {
    results: Array<IRecipeResult> | undefined
}

// Container with recipes result cards shown after submitting a SearchForm
export function SearchResults({results}: SearchResultsProps) {
    return (
        <>
            {results
                ? (
                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-100 gap-5'}>
                        {results.map((result) => (
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