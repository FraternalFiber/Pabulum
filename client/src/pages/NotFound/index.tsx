import {Menu} from "@/components/Menu";
import {Main} from "@/components/Main";
import {Heading} from "@/components/Heading";
import {BackButton} from "@/components/BackButton";

// Error 404 page
export function NotFound() {
  return (
      <>
        <Menu/>
        <Main>
          <div className={'flex justify-center items-center'}>
            <div className={'flex flex-col items-center'}>
              <Heading content={'Oops! This page doesn\'t exist'}/>
              <p>404 page not found</p>
              <BackButton className={'mt-7'} text={'Go back'} type={'button'}/>
            </div>
          </div>
        </Main>
      </>
  )
}