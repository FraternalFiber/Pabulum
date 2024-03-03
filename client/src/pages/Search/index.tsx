import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import { useEffect } from "react";
import { SearchForm } from "@/components/SearchForm";

export default function Search() {
  useEffect(() => {
    document.title = "Search recipes - Pabulum"
  })

  return (
      <>
        <Menu/>
        <Main>
          <h1 className={'text-2xl md:text-3xl mt-2 mb-7 font-bold tracking-tight'}>
            Find your favourite recipes
          </h1>
          <SearchForm/>
        </Main>
      </>
  )
}