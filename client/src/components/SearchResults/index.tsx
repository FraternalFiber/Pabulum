import {RecipeResultCard} from "@/components/RecipeResultCard/index.js";
import {RecipeResult} from "@/types/RecipeResult.ts";

interface SearchResultsProps {
    results: Array<RecipeResult> | null
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
                : (<p>No results</p>)
            }
        </>
    )
}