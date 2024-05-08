import {useParams} from "react-router-dom";
import {useRecipe} from "@/services/useRecipe.ts";
import {Menu} from "@/components/Menu";
import {Main} from "@/components/Main";
import {Clock as ClockIcon, UsersRound as UsersRoundIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {BackButton} from "@/components/BackButton";

export function Recipe() {
  const { id } = useParams<{id?: string}>() || {}
  const {
    data: recipe,
    isLoading: recipeLoading,
    error: recipeError
  } = useRecipe(id || '')
  const [ingredients, setIngredients] = useState<Array<object>>()
  const [instructions, setInstructions] = useState<Array<object>>()

  useEffect(() => {
    setIngredients(recipe?.extendedIngredients)
    setInstructions(recipe?.analyzedInstructions[0].steps)
  }, [recipe]);

  return (
      <>
        <Menu/>
        <Main>
          <div className={'mt-2'}>
            {recipeLoading && <p>Loading...</p>}
            {recipeError && <p>Error</p>}
            {recipe && (
                <div className={'flex flex-col gap-y-5'}>
                  {/* Back button */}
                  <BackButton/>
                  {/* Main photo - show if recipe contains an image */}
                  {recipe.image && (<img src={recipe.image} alt={recipe.title} className={'rounded-sm max-w-[28rem]'}/>)}
                  {/* Title */}
                  <h1 className={'text-3xl font-bold'}>{recipe.title}</h1>
                  <div className={'flex gap-x-6'}>
                    {/* Preparation time */}
                    <div className={'flex gap-x-2'}>
                      <ClockIcon/>
                      <div>{recipe.readyInMinutes} min</div>
                    </div>
                    {/* Number of servings */}
                    <div className={'flex gap-x-2'}>
                      <UsersRoundIcon />
                      <div>{recipe.servings} servings</div>
                    </div>
                  </div>
                  {/* Badges */}
                  <div className={'flex gap-x-4'}>
                    {recipe.vegan && <p>✅ Vegan</p>}
                    {recipe.vegetarian && <p>✅ Vegetarian</p>}
                    {recipe.glutenFree && <p>✅ Gluten free</p>}
                    {recipe.dairyFree && <p>✅ Dairy free</p>}
                  </div>
                  {/* Ingredients */}
                  <div>
                    <div className={'text-2xl font-medium mb-2'}>Ingredients:</div>
                    <ul>
                      {ingredients?.map((ingredient: any) => (
                          <li className={'list-disc ml-5'} key={ingredient.id}>{ingredient.name} - {ingredient.amount} {ingredient.unit}</li>
                      ))}
                    </ul>
                  </div>
                  {/* Steps */}
                  <div>
                    <div className={'text-2xl font-medium mb-6 mt-2'}>Instructions:</div>
                    <div>
                      {instructions?.map((step: any) => (
                          <div key={step.number}>
                            <div className={'font-bold'}>Step {step.number}</div>
                            <p>{step.step}</p>
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