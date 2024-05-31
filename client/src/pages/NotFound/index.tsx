import {Menu} from "@/components/Menu";
import {Main} from "@/components/Main";
import {Heading} from "@/components/Heading";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import { useEffect } from "react";

// Error 404 page
export function NotFound() {
  useEffect(() => {
    document.title = "Page not found - Pabulum"
  }, [])

  return (
      <>
        <Menu/>
        <Main>
          <div className={'flex justify-center items-center mt-4'}>
            <div className={'flex flex-col items-center'}>
              <Heading content={'Oops! This page doesn\'t exist'}/>
              <p className={'text-xl'}>404 - page not found</p>
              <div className={'flex gap-x-4 mt-8'}>
                <Link to={'/'}>
                  <Button type={'button'}>Take me home</Button>
                </Link>
              </div>
            </div>
          </div>
        </Main>
      </>
  )
}