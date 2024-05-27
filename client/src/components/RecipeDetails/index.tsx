import {cn} from "@/lib/utils.ts";
import {AspectRatio} from "@/components/ui/aspect-ratio.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import { Clock as ClockIcon, SquarePen, Trash2, UsersRound as UsersRoundIcon } from "lucide-react";
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
import { availableDietItems } from "@/components/SearchForm/searchFormFilterItems.ts";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import { toast } from "sonner";
import { DELETE_RECIPE_ERROR_MESSAGE, DELETE_RECIPE_SUCCESS_MESSAGE } from "@/helpers/constants.ts";
import { useNavigate } from "react-router-dom";
import { deleteRecipe } from "@/services/deleteRecipe.ts";

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

type RecipeMenuBarProps = {
  dataSource: TDataSource
  deleteRecipe: () => void
}

function RecipeMenuBar({dataSource, deleteRecipe}: RecipeMenuBarProps) {
  if (dataSource === 'user') {
    return (
      <div className={'w-fit flex gap-x-1 outline outline-1 outline-stone-300 rounded-md p-1'}>
        <Button type={'button'} variant={'ghost'}>
          <SquarePen/>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type={'button'} variant={'ghost'} className={'hover:bg-destructive'}>
              <Trash2/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Your recipe will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type={'button'}
                className={buttonVariants({variant: 'destructive'})}
                onClick={deleteRecipe}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  return <></>
}

export function RecipeDetails({recipeId, dataSource}: RecipeDetailsProps) {
  const { data: recipe, isLoading, isError} = useRecipe(recipeId, dataSource)
  const [showImage, setShowImage] = useState<boolean>(false)
  const [imageError, setImageError] = useState<boolean>(false)
  // Used for redirecting
  const navigate = useNavigate();

  // Show image when it's loaded correctly
  const handleImageLoad = () => {
    setShowImage(true)
  }

  // Set error when image isn't loaded correctly to hide image container
  const handleImageError = () => {
    setImageError(true)
  }

  const handleDeleteRecipe = async () => {
    console.log('delete recipe')
    // show a loading toast
    const loadingToastId = toast.loading('Deleting a recipe...')
    // setIsLoading(true)

    try {
      // post recipe data to database
      const response = await deleteRecipe(recipeId)

      if(response.success) {
        // dismiss a loading toast and show a success toast
        toast.dismiss(loadingToastId)
        toast.success(DELETE_RECIPE_SUCCESS_MESSAGE)

        console.log(response.message)
        console.log(response.id)

        // Redirect to a newly created recipe
        setTimeout(() => {
          navigate({
            pathname: `/user/recipes`,
          })
        }, 1000)
      }
      else {
        // dismiss a loading toast and show an error toast
        toast.dismiss(loadingToastId)
        // setIsLoading(false)
        toast.error(DELETE_RECIPE_ERROR_MESSAGE)
        console.error(`${DELETE_RECIPE_ERROR_MESSAGE}: ${response.message}`)
        console.error(response.message)
      }
    }
    catch(error) {
      // dismiss a loading toast and show an error toast
      toast.dismiss(loadingToastId)
      // setIsLoading(false)
      toast.error(DELETE_RECIPE_ERROR_MESSAGE)
      console.error(`${DELETE_RECIPE_ERROR_MESSAGE}: ${error}`)
    }
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
          <RecipeMenuBar dataSource={dataSource} deleteRecipe={handleDeleteRecipe}/>
          {/* Recipe image - show only if recipe contains an image and image is loaded correctly */}
          {recipe.image && (
              <div className={cn('w-full max-w-[28rem]', imageError ? 'hidden' : 'block')}>
                <AspectRatio ratio={3 / 2}>
                  <img src={recipe.image}
                       onLoad={handleImageLoad}
                       onError={handleImageError}
                       alt={recipe.title}
                       className={cn('rounded-sm w-full h-full object-contain object-center bg-secondary', showImage ? 'block' : 'hidden')}/>

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
                  {availableDietItems.map(dietItem => {
                    if(recipe.diets.includes(dietItem.value)) {
                      return <p key={dietItem.value}>✅ {dietItem.label}</p>
                    }
                  })}
                </div>
            )}
          </div>
          {/* Description */}
          {recipe.description && (
            <div>
              <RecipeLabel>Description</RecipeLabel>
              <p className={'max-w-[40rem]'}>{recipe.description}</p>
            </div>
          )}
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