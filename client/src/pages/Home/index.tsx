import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import {useEffect} from "react";
import {HomeSearchBar} from "@/components/HomeSearchBar";
import LogoTextOnly from "@/assets/images/logo_text_only.svg"

export function Home() {
  useEffect(() => {
    document.title = "Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main>
          <div className={'w-full mt-10 flex flex-col justify-center items-center'}>
            <img src={LogoTextOnly} alt={'Pabulum'} className={'w-full max-w-72'}/>
            <div className={'italic text-xl mt-3'}>Savor the flavor, master the meal!</div>
            <HomeSearchBar className={'mt-10'}/>
          </div>
        </Main>
      </>
  )
}
