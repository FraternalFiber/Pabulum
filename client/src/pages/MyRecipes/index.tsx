import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import {useEffect} from "react";

export function MyRecipes() {
  useEffect(() => {
    document.title = "My recipes - Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main/>
      </>
  )
}