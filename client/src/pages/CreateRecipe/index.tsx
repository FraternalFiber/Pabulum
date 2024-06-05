import { useEffect } from "react";
import { Heading } from "@/components/Heading";
import { CreateRecipeForm } from "@/components/CreateRecipeForm";

// Page for creating or editing recipe. Default mode is "create".
export function CreateRecipe() {
  useEffect(() => {
    document.title = "Create recipe - Pabulum";
  }, []);

  return (
    <>
      <Heading content={"Create recipe"} />
      <CreateRecipeForm mode={"create"} />
    </>
  );
}
