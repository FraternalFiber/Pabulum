import Menu from "@/components/Menu";
import Main from "@/components/Main";
import {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main/>
      </>
  )
}