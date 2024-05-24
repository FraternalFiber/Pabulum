import {cn} from "@/lib/utils.ts";
import {AspectRatio} from "@/components/ui/aspect-ratio.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Clock as ClockIcon, UsersRound as UsersRoundIcon} from "lucide-react";
import {Table, TableBody, TableCaption, TableCell, TableRow} from "@/components/ui/table.tsx";
import {TNutrient} from "@/types/TNutrient.ts";
import {TStep} from "@/types/TStep.ts";
import {Separator} from "@/components/ui/separator.tsx";
import React, {useState} from "react";
import {useRecipe} from "@/services/useRecipe.ts";
import {ErrorAlert} from "@/components/ErrorAlert/ErrorAlert.tsx";
import {LoadingSkeletons} from "@/components/RecipeDetails/LoadingSkeletons.tsx";
import { TDataSource } from "@/types/TDataSource.ts";
import { TIngredient } from "@/types/TIngredient.ts";

type RecipeLabelProps = {
  children?: React.ReactNode
}

function RecipeLabel({children}: RecipeLabelProps) {
  return <div className={'text-2xl font-medium mb-2'}>{children}</div>
}

type RecipeDetailsProps = {
  recipeId: string
  dataSource: TDataSource
}

export function RecipeDetails({recipeId, dataSource}: RecipeDetailsProps) {
  const { data: recipe, isLoading, isError} = useRecipe(recipeId, dataSource)
  const [showImage, setShowImage] = useState<boolean>(false)
  const [imageError, setImageError] = useState<boolean>(false)

  // Show image when it's loaded correctly
  const handleImageLoad = () => {
    setShowImage(true)
  }

  // Set error when image isn't loaded correctly to hide image container
  const handleImageError = () => {
    setImageError(true)
  }

  if (isLoading) {
    return (
        <LoadingSkeletons/>
    )
  }

  if (isError) {
    return (
        <>
          <ErrorAlert className={'mt-20'} message={"Sorry, we couldn't load your recipe"}/>
        </>
    )
  }

  if (recipe) {
    return (
        <div className={'flex flex-col gap-y-8'}>
          {/* Recipe image - show only if recipe contains an image and image is loaded correctly */}
          {recipe.image && (
              <div className={cn('w-full max-w-[28rem]', imageError ? 'hidden' : 'block')}>
                <AspectRatio ratio={3 / 2}>
                  <img src={recipe.image}
                       onLoad={handleImageLoad}
                       onError={handleImageError}
                       alt={recipe.title}
                       className={cn('rounded-sm w-full', showImage ? 'block' : 'hidden')}/>

                  {/* Image loading placeholder */}
                  <Skeleton className={cn('w-full h-full', showImage ? 'hidden' : 'block')}/>
                </AspectRatio>
              </div>
          )}
          {/* Title */}
          <h1 className={'text-3xl font-bold'}>{recipe.title}</h1>
          <div className={'flex flex-col gap-y-5'}>
            <div className={'flex gap-x-6 flex-wrap gap-y-2'}>
              {/* Preparation time */}
              <div className={'flex gap-x-2'}>
                <ClockIcon/>
                <div>{recipe.prepTime} min</div>
              </div>
              {/* Number of servings */}
              <div className={'flex gap-x-2'}>
                <UsersRoundIcon/>
                <div>{recipe.servingsNumber} servings</div>
              </div>
            </div>
            {/* Diet badges - show box only when array is not empty */}
            {recipe.diets.length > 0 && (
                <div className={'flex gap-x-4 flex-wrap gap-y-2'}>
                  {recipe.diets.map((diet: string, index: number) => (
                      <p key={index}>✅ {diet}</p>
                  ))}
                </div>
            )}
          </div>
          <div className={'flex gap-y-10 flex-col md:flex-row md:gap-x-8 lg:gap-x-14'}>
            {/* Ingredients */}
            <div>
              <RecipeLabel>Ingredients</RecipeLabel>
              <Table className={'text-md'}>
                <TableBody>
                  {recipe.ingredients.map((ingredient: TIngredient, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{ingredient.name} {ingredient.quantity ? `- ${ingredient.quantity}` : ''}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Nutrition facts - show if exist */}
            {recipe.nutrients && (
              <div>
                <RecipeLabel>Nutrition facts</RecipeLabel>
                <Table className={'text-md'}>
                  <TableBody>
                    {recipe.nutrients.map((nutrient: TNutrient) => (
                        <TableRow key={nutrient.name}>
                          <TableCell>{nutrient.name}</TableCell>
                          <TableCell>{nutrient.quantity}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Amount per serving</TableCaption>
                </Table>
              </div>
            )}
          </div>
          {/* Steps */}
          <div>
            <RecipeLabel>Steps</RecipeLabel>
            <div className={'mt-4'}>
              {recipe.steps.map((step: TStep) => (
                  <div key={step.number}>
                    <div className={'flex gap-x-2'}>
                      <div className={'h-fit font-bold bg-primary rounded-full pr-2 pl-2'}>{step.number}</div>
                      <p>{step.instruction}</p>
                    </div>
                    <Separator className={'mt-4 mb-4'}/>
                  </div>
              ))}
            </div>
          </div>
        </div>
    )
  }
}