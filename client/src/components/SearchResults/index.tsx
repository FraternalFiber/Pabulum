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
                    <div className={'flex flex-col w-100 gap-5'}>
                        {results.map((result) => (
                            <RecipeResultCard title={result.title} imageUrl={result.image} key={result.id}/>
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