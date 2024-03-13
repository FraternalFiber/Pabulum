import {useParams} from "react-router-dom";
import {useRecipe} from "@/services/useRecipe.ts";
import {Menu} from "@/components/Menu";
import {Main} from "@/components/Main";
import {MoveLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function Recipe() {
  const { id } = useParams<{id?: string}>() || {}
  const {
    data: recipe,
    isLoading: recipeLoading,
    error: recipeError
  } = useRecipe(id || '')
  const navigate = useNavigate()

  // navigate back when the back button is clicked
  function handleBackButton() {
    navigate(-1)
  }

  return (
      <>
        <Menu/>
        <Main>
          <div className={'mt-2'}>
            {recipeLoading && <p>Loading...</p>}
            {recipeError && <p>Error</p>}
            {recipe && (
                <div className={'flex flex-col gap-y-5'}>
                  <div className={'flex gap-x-2 hover:cursor-pointer select-none'} onClick={handleBackButton}>
                    <MoveLeft />
                    <div>Back</div>
                  </div>
                  <img src={recipe.image} alt={recipe.title} className={'rounded-sm max-w-[28rem]'}/>
                  <h1 className={'text-2xl font-bold'}>{recipe.title}</h1>
                  <div className={'flex gap-x-4'}>
                    {recipe.vegan && <p>✅ Vegan</p>}
                    {recipe.vegetarian && <p>✅ Vegetarian</p>}
                    {recipe.glutenFree && <p>✅ Gluten free</p>}
                    {recipe.dairyFree && <p>✅ Dairy free</p>}
                  </div>
                  <div>
                    <div>Ingredients:</div>
                    <ul>
                      {recipe.extendedIngredients?.map((ingredient : any) => (
                         <li className={'list-disc ml-5'} key={ingredient.id}>{ingredient.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
            )}
          </div>
        </Main>
      </>
  )
}