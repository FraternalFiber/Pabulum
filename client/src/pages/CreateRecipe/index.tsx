import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import {useEffect} from "react";
import {Heading} from "@/components/Heading";
import {CreateRecipeForm} from "@/components/CreateRecipeForm";

export function CreateRecipe() {
  useEffect(() => {
    document.title = "Create recipe - Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main>
          <Heading text={'Create recipe'}/>
          <CreateRecipeForm/>
        </Main>
      </>
  )
}