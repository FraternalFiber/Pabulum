import { useEffect } from "react";
import { Heading } from "@/components/Heading";
import { UserSearchForm } from "@/components/UserSearchForm";

export function MyRecipes() {
  useEffect(() => {
    document.title = "My recipes - Pabulum";
  }, []);

  return (
    <>
      <Heading content={"My recipes"} />
      <UserSearchForm />
    </>
  );
}
