import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Link } from "react-router-dom";
import noImagePlaceholder from "@/assets/images/no_image_placeholder.png";
import { TDataSource } from "@/types/TDataSource.ts";

type RecipeResultCardProps = {
  id: number;
  title: string;
  imageUrl?: string;
  dataSource: TDataSource;
  className?: string;
};

// Small card with brief information about a recipe shown in the search results page.
// Show no-image placeholder when imageUrl is not given
export function RecipeResultCard({
  id,
  title,
  imageUrl = noImagePlaceholder,
  dataSource,
  className,
}: RecipeResultCardProps) {
  // Set path to recipe depending on data source (online/user)
  const path = dataSource === "online" ? `/recipes/${id}` : `/user/recipes/${id}`;

  return (
    <Link to={path} role={"link"} data-testid="recipe-result-card">
      <Card className={cn(className, "w-full hover:bg-secondary")}>
        <CardHeader>
          <CardTitle className={"break-words"}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            style={{ backgroundImage: `url(${imageUrl}), url(${noImagePlaceholder})` }}
            className={"w-full h-52 bg-no-repeat bg-cover bg-center rounded-sm"}
            data-testid={"recipe-result-card-image"}
          ></div>
        </CardContent>
        <CardFooter className={"mt-5"}>
          <Button type={"button"} className={"block"}>
            Show
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
