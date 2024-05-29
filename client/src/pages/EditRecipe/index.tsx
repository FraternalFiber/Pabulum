import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import { useEffect } from "react";
import { Heading } from "@/components/Heading";
import { CreateRecipeForm } from "@/components/CreateRecipeForm";
import { useRecipe } from "@/services/useRecipe.ts";
import { useParams } from "react-router-dom";

// Page for creating or editing recipe. Default mode is "create".
export function EditRecipe() {
  // Get recipe id from route params
  const { id = '' } = useParams<{id: string}>()
  // Get recipe data
  const { data: recipe, isLoading, isError } = useRecipe(id, 'user')

  useEffect(() => {
    document.title = "Edit recipe - Pabulum"
  }, [])

  if (isLoading) {
    return (
      <>
        <Menu/>
        <Main>
          <Heading content={"Edit recipe"}/>
          <p>Loading...</p>
        </Main>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Menu/>
        <Main>
          <Heading content={"Edit recipe"}/>
          <p>Error!</p>
        </Main>
      </>
    )
  }

  if (recipe) {
    return (
      <>
        <Menu/>
        <Main>
          <Heading content={"Edit recipe"}/>
          <CreateRecipeForm mode={"edit"} initialData={recipe} recipeId={id}/>
        </Main>
      </>
    )
  }

}