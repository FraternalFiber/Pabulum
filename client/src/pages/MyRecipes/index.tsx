import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import { useEffect } from "react";
import { Heading } from "@/components/Heading";
import { UserSearchForm } from "@/components/UserSearchForm";

export function MyRecipes() {
  useEffect(() => {
    document.title = "My recipes - Pabulum";
  }, []);

  return (
    <>
      <Menu />
      <Main>
        <Heading content={"My recipes"} />
        <UserSearchForm />
      </Main>
    </>
  );
}
