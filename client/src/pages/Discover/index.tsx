import Menu from "@/components/Menu";
import Main from "@/components/Main";
import {useEffect} from "react";

export default function Discover() {
  useEffect(() => {
    document.title = "Discover - Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main/>
      </>
  )
}