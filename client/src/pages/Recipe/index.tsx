import {useParams} from "react-router-dom";
import {useRecipe} from "@/services/useRecipe.ts";
import {Menu} from "@/components/Menu";
import {Main} from "@/components/Main";
import {Clock as ClockIcon, UsersRound as UsersRoundIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {BackButton} from "@/components/BackButton";
import {cn} from "@/lib/utils.ts";
import {Table, TableBody, TableCaption, TableCell, TableRow} from "@/components/ui/table.tsx";
import {TIngredient} from "@/types/TIngredient.ts";
import {TNutrient} from "@/types/TNutrient.ts";
import {TRecipeStep} from "@/types/TRecipeStep.ts";

type RecipeLabelProps = {
  children?: React.ReactNode
}

function RecipeLabel({children}: RecipeLabelProps) {
  return <div className={'text-2xl font-medium mb-2'}>{children}</div>
}

export function Recipe() {
  const { id } = useParams<{id?: string}>() || {}
  const {
    data: recipe,
    isLoading: recipeLoading,
    error: recipeError
  } = useRecipe(id || '')
  const [showImage, setShowImage] = useState<boolean>(false)

  // get ingredients and steps instructions from recipe and set to state variables
  useEffect(() => {
    console.log(recipe)
  }, [recipe]);

  // show image when it's loaded correctly
  const handleImageLoad = () => {
    setShowImage(true)
  }

  return (
      <>
        <Menu/>
        <Main>
          <div className={'mt-2'}>
            {recipeLoading && <p>Loading...</p>}
            {recipeError && <p>Error</p>}
            {recipe && (
                <div className={'flex flex-col gap-y-8'}>
                  {/* Back button */}
                  <BackButton/>
                  {/* Main photo - show only if recipe contains an image and image is loaded correctly */}
                  {recipe.image && (
                      <img src={recipe.image}
                           onLoad={handleImageLoad}
                           alt={recipe.title}
                           className={cn('rounded-sm max-w-[28rem]', showImage ? 'block' : 'hidden')}/>
                  )}
                  {/* Title */}
                  <h1 className={'text-3xl font-bold'}>{recipe.title}</h1>
                  <div className={'flex flex-col gap-y-5'}>
                    <div className={'flex gap-x-6'}>
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
                        <div className={'flex gap-x-4'}>
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
                                <TableCell>{ingredient.name} - {ingredient.quantity}</TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Nutrition facts */}
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
                  </div>
                  {/* Steps */}
                  <div>
                    <RecipeLabel>Steps</RecipeLabel>
                    <div className={'mt-4'}>
                      {recipe.steps.map((step: TRecipeStep) => (
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
            )}
          </div>
        </Main>
      </>
  )
}