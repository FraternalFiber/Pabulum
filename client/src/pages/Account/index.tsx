import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import {useEffect} from "react";

export function Account() {
  useEffect(() => {
    document.title = "Account - Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main/>
      </>
  )
}