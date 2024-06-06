import { RecipeResultCard } from "@/components/RecipeResultCard/index.tsx";
import { useRecipes } from "@/services/useRecipes.ts";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LoadingSkeletons } from "@/components/SearchResults/LoadingSkeletons.tsx";
import { ErrorAlert } from "@/components/ErrorAlert";
import { NoResults } from "@/components/SearchResults/NoResults.tsx";
import { TDataSource } from "@/types/TDataSource.ts";
import { useUserRecipes } from "@/services/useUserRecipes.ts";

type SearchResultsProps = {
  searchParams: any;
  dataSource: TDataSource;
};

// Container with recipes result cards shown after submitting a SearchForm
export function SearchResults({ searchParams, dataSource }: SearchResultsProps) {
  const [URLSearchParams] = useSearchParams();

  const {
    data: recipes,
    isLoading,
    isError,
    refetch,
  } = dataSource === "online"
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useRecipes(searchParams)
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useUserRecipes(searchParams);

  // Refetch when search params changed
  useEffect(() => {
    refetch();
  }, [URLSearchParams]);

  if (isLoading) {
    return <LoadingSkeletons />;
  }

  if (isError) {
    return <ErrorAlert className={"mt-16"} message={"Sorry, we couldn't load your recipes."} />;
  }

  return recipes?.length ? ( //if recipes is not null and not empty
    <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
      {recipes.map((result) => (
        <RecipeResultCard
          id={result.id}
          title={result.title}
          imageUrl={result.image}
          key={result.id}
          dataSource={dataSource}
        />
      ))}
    </div>
  ) : (
    <div>
      <NoResults query={searchParams.q} />
    </div>
  );
}
