import Menu from "@/components/Menu";
import Main from "@/components/Main";
import {useEffect} from "react";

export default function CreateRecipe() {
  useEffect(() => {
    document.title = "Create recipe - Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main/>
      </>
  )
}