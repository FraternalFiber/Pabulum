import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { HeartCrack } from "lucide-react";

type NoResultsParams = {
  query: string;
};

// Alert box showed when no search results found
export function NoResults({ query }: NoResultsParams) {
  return (
    <div className={"flex justify-center mt-16"}>
      <Alert className={"w-fit pr-8"}>
        <HeartCrack size={20} />
        <AlertTitle className={"ml-1.5"}>No results</AlertTitle>
        <AlertDescription className={"ml-1.5"}>
          Sorry, no results found for "{query}"
        </AlertDescription>
      </Alert>
    </div>
  );
}
