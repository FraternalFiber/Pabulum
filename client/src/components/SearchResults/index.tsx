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
                    <div className={'mt-9 flex flex-col gap-5 md:flex-row'}>
                        {results.map((result) => (
                            <RecipeResultCard title={result.title} imageUrl={result.image} key={result.id}/>
                        ))}
                    </div>
                )
                : (
                    <div className={'mt-7 ml-2'}>
                        <p>No results</p>
                    </div>
                )
            }
        </>
    )
}