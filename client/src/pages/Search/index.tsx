import Menu from "@/components/Menu";
import Main from "@/components/Main";
import {useEffect} from "react";

export default function Search() {
  useEffect(() => {
    document.title = "Search recipes - Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main/>
      </>
  )
}