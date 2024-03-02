import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import {useEffect} from "react";

export default function Pantry() {
  useEffect(() => {
    document.title = "My pantry - Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main/>
      </>
  )
}