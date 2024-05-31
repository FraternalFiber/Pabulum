import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import { useEffect } from "react";
import { SearchForm } from "@/components/SearchForm";
import { Heading } from "@/components/Heading";

// Page to search for recipes
export function Search() {
  useEffect(() => {
    document.title = "Search recipes - Pabulum";
  }, []);

  return (
    <>
      <Menu />
      <Main>
        <Heading content={"Find your favourite recipes"} />
        <SearchForm />
      </Main>
    </>
  );
}
