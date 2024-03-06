import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import {useEffect} from "react";
import Heading from "@/components/Heading";

export default function Home() {
  useEffect(() => {
    document.title = "Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main>
          <Heading text={'Pabulum - tańsi niż nasza DROGA konkurencja'}/>
        </Main>
      </>
  )
}