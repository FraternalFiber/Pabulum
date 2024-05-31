import { useParams } from "react-router-dom";
import { Menu } from "@/components/Menu";
import { Main } from "@/components/Main";
import { RecipeDetails } from "@/components/RecipeDetails";
import { BackButton } from "@/components/BackButton";
import { TDataSource } from "@/types/TDataSource.ts";

type RecipeProps = {
  dataSource: TDataSource;
};

export function Recipe({ dataSource }: RecipeProps) {
  // Get recipe id from route params
  const { id = "" } = useParams<{ id: string }>();

  return (
    <>
      <Menu />
      <Main>
        <div className={"mt-2"}>
          <BackButton className={"mb-8"} />
          <RecipeDetails recipeId={id} dataSource={dataSource} />
        </div>
      </Main>
    </>
  );
}
