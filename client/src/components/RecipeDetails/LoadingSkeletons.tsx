import {Skeleton} from "@/components/ui/skeleton.tsx";
import {AspectRatio} from "@/components/ui/aspect-ratio.tsx";

export function LoadingSkeletons() {
  return (
      <div className={'flex flex-col gap-y-8'}>
        <div className={'w-full max-w-[28rem]'}>
          <AspectRatio ratio={3 / 2}>
            <Skeleton className={'w-full h-full'}/>
          </AspectRatio>
        </div>
        <Skeleton className={'w-full max-w-96 h-8'}/>
        {/*<div className={'flex flex-col gap-y-5'}>*/}
        {/*  <div className={'flex gap-x-6'}>*/}
        {/*    /!* Preparation time *!/*/}
        {/*    <div className={'flex gap-x-2'}>*/}
        {/*      <ClockIcon/>*/}
        {/*      <div>{recipe.prepTime} min</div>*/}
        {/*    </div>*/}
        {/*    /!* Number of servings *!/*/}
        {/*    <div className={'flex gap-x-2'}>*/}
        {/*      <UsersRoundIcon/>*/}
        {/*      <div>{recipe.servingsNumber} servings</div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  /!* Diet badges - show box only when array is not empty *!/*/}
        {/*  {recipe.diets.length > 0 && (*/}
        {/*      <div className={'flex gap-x-4'}>*/}
        {/*        {recipe.diets.map((diet: string, index: number) => (*/}
        {/*            <p key={index}>✅ {diet}</p>*/}
        {/*        ))}*/}
        {/*      </div>*/}
        {/*  )}*/}
        {/*</div>*/}
        <Skeleton className={'w-full max-w-52 h-8'}/>
        {/*<div className={'flex gap-y-10 flex-col md:flex-row md:gap-x-8 lg:gap-x-14'}>*/}
        {/*  /!* Ingredients *!/*/}
        {/*  <div>*/}
        {/*    <RecipeLabel>Ingredients</RecipeLabel>*/}
        {/*    <Table className={'text-md'}>*/}
        {/*      <TableBody>*/}
        {/*        {recipe.ingredients.map((ingredient: TIngredient, index: number) => (*/}
        {/*            <TableRow key={index}>*/}
        {/*              <TableCell>{ingredient.name} - {ingredient.quantity}</TableCell>*/}
        {/*            </TableRow>*/}
        {/*        ))}*/}
        {/*      </TableBody>*/}
        {/*    </Table>*/}
        {/*  </div>*/}
        {/*  /!* Nutrition facts *!/*/}
        {/*  <div>*/}
        {/*    <RecipeLabel>Nutrition facts</RecipeLabel>*/}
        {/*    <Table className={'text-md'}>*/}
        {/*      <TableBody>*/}
        {/*        {recipe.nutrients.map((nutrient: TNutrient) => (*/}
        {/*            <TableRow key={nutrient.name}>*/}
        {/*              <TableCell>{nutrient.name}</TableCell>*/}
        {/*              <TableCell>{nutrient.quantity}</TableCell>*/}
        {/*            </TableRow>*/}
        {/*        ))}*/}
        {/*      </TableBody>*/}
        {/*      <TableCaption>Amount per serving</TableCaption>*/}
        {/*    </Table>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*/!* Steps *!/*/}
        {/*<div>*/}
        {/*  <RecipeLabel>Steps</RecipeLabel>*/}
        {/*  <div className={'mt-4'}>*/}
        {/*    {recipe.steps.map((step: TStep) => (*/}
        {/*        <div key={step.number}>*/}
        {/*          <div className={'flex gap-x-2'}>*/}
        {/*            <div className={'h-fit font-bold bg-primary rounded-full pr-2 pl-2'}>{step.number}</div>*/}
        {/*            <p>{step.instruction}</p>*/}
        {/*          </div>*/}
        {/*          <Separator className={'mt-4 mb-4'}/>*/}
        {/*        </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
  )
}