import { useParams } from "react-router-dom";
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
      <div className={"mt-2"}>
        <BackButton className={"mb-8"} />
        <RecipeDetails recipeId={id} dataSource={dataSource} />
      </div>
    </>
  );
}
