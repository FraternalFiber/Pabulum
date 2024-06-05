import { useEffect } from "react";
import { Heading } from "@/components/Heading";
import { CreateRecipeForm } from "@/components/CreateRecipeForm";
import { useRecipe } from "@/services/useRecipe.ts";
import { useParams } from "react-router-dom";
import { LoadingSkeletons } from "@/pages/EditRecipe/LoadingSkeletons.tsx";
import { ErrorAlert } from "@/components/ErrorAlert/ErrorAlert.tsx";
import { BackButton } from "@/components/BackButton";

// Page for creating or editing recipe. Default mode is "create".
export function EditRecipe() {
  // Get recipe id from route params
  const { id = "" } = useParams<{ id: string }>();
  // Get recipe data
  const { data: recipe, isLoading, isError } = useRecipe(id, "user");

  useEffect(() => {
    document.title = "Edit recipe - Pabulum";
  }, []);

  // To be improved: code duplication

  if (isLoading) {
    return (
      <>
        <BackButton className={"mb-8 mt-2"} />
        <Heading content={"Edit recipe"} />
        <LoadingSkeletons />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <BackButton className={"mb-8 mt-2"} />
        <Heading content={"Edit recipe"} />
        <ErrorAlert className={"mt-20"} message={"Sorry, we couldn't load your recipe"} />
      </>
    );
  }

  if (recipe) {
    return (
      <>
        <BackButton className={"mb-8 mt-2"} />
        <Heading content={"Edit recipe"} />
        <CreateRecipeForm mode={"edit"} initialData={recipe} recipeId={id} />
      </>
    );
  }
}
