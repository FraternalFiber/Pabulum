import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {Link} from "react-router-dom";
import noImagePlaceholder from "@/assets/images/no_image_placeholder.png"

type RecipeResultCardProps = {
  id: number
  title: string
  imageUrl?: string
  className?: string
}

// Small card with brief information about a recipe shown in the search results page.
// Show no image placeholder when imageUrl is not given
export function RecipeResultCard({id, title, imageUrl = noImagePlaceholder, className}: RecipeResultCardProps) {
  return (
      <Link to={`/recipe/${id}`}>
        <Card className={cn(className, 'w-full hover:bg-secondary')}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
              <div style={{backgroundImage: `url(${imageUrl}), url(${noImagePlaceholder})`}} className={'w-full h-52 bg-no-repeat bg-cover bg-center rounded-sm'}></div>
          </CardContent>
          <CardFooter className={'mt-5'}>
            <Button type={'button'} className={'block'}>Show</Button>
          </CardFooter>
        </Card>
      </Link>
  )
}