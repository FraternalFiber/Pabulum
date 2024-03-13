import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {Link} from "react-router-dom";

interface RecipeResultCardProps {
  id: number
  title: string
  imageUrl?: string
  className?: string
}

// Small card with brief information about a recipe shown in the search results page.
export function RecipeResultCard({id, title, imageUrl, className}: RecipeResultCardProps) {
  return (
      <Link to={`/recipe/${id}`}>
        <Card className={cn(className, 'w-100 hover:bg-secondary')}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/*<AspectRatio ratio={3 / 2}>*/}
              <div style={{backgroundImage: `url(${imageUrl})`}} className={'w-100 h-52 bg-no-repeat bg-cover bg-center rounded-sm'}></div>
              {/*<img src={imageUrl} alt={title} className={'rounded-sm w-100 h-auto'}/>*/}
            {/*</AspectRatio>*/}
          </CardContent>
          <CardFooter className={'mt-5'}>
            <Button type={'button'} className={'block'}>Show</Button>
          </CardFooter>
        </Card>
      </Link>
  )
}