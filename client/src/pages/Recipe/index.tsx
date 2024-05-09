import {useParams} from "react-router-dom";
import {useRecipe} from "@/services/useRecipe.ts";
import {Menu} from "@/components/Menu";
import {Main} from "@/components/Main";
import {Clock as ClockIcon, UsersRound as UsersRoundIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {BackButton} from "@/components/BackButton";
import {cn} from "@/lib/utils.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

type RecipeLabelProps = {
  children?: React.ReactNode
}

function RecipeLabel({children}: RecipeLabelProps) {
  return <div className={'text-2xl font-medium mb-2'}>{children}</div>
}

// for testing
const nutrients = [
  {
    "name": "Calories",
    "amount": 934.26,
    "unit": "kcal",
    "percentOfDailyNeeds": 46.71
  },
  {
    "name": "Fat",
    "amount": 58.96,
    "unit": "g",
    "percentOfDailyNeeds": 90.7
  },
  {
    "name": "Saturated Fat",
    "amount": 18.51,
    "unit": "g",
    "percentOfDailyNeeds": 115.68
  },
  {
    "name": "Carbohydrates",
    "amount": 61.0,
    "unit": "g",
    "percentOfDailyNeeds": 20.33
  },
  {
    "name": "Net Carbohydrates",
    "amount": 56.24,
    "unit": "g",
    "percentOfDailyNeeds": 20.45
  },
  {
    "name": "Sugar",
    "amount": 13.32,
    "unit": "g",
    "percentOfDailyNeeds": 14.8
  },
  {
    "name": "Cholesterol",
    "amount": 123.11,
    "unit": "mg",
    "percentOfDailyNeeds": 41.04
  },
  {
    "name": "Sodium",
    "amount": 2862.63,
    "unit": "mg",
    "percentOfDailyNeeds": 124.46
  },
  {
    "name": "Protein",
    "amount": 42.86,
    "unit": "g",
    "percentOfDailyNeeds": 85.73
  },
  {
    "name": "Vitamin B3",
    "amount": 8.87,
    "unit": "mg",
    "percentOfDailyNeeds": 44.33
  },
  {
    "name": "Vitamin B6",
    "amount": 0.71,
    "unit": "mg",
    "percentOfDailyNeeds": 35.48
  },
  {
    "name": "Iron",
    "amount": 6.31,
    "unit": "mg",
    "percentOfDailyNeeds": 35.07
  },
  {
    "name": "Vitamin B1",
    "amount": 0.47,
    "unit": "mg",
    "percentOfDailyNeeds": 31.14
  },
  {
    "name": "Potassium",
    "amount": 941.65,
    "unit": "mg",
    "percentOfDailyNeeds": 26.9
  },
  {
    "name": "Phosphorus",
    "amount": 267.7,
    "unit": "mg",
    "percentOfDailyNeeds": 26.77
  },
  {
    "name": "Manganese",
    "amount": 0.51,
    "unit": "mg",
    "percentOfDailyNeeds": 25.4
  },
  {
    "name": "Zinc",
    "amount": 3.79,
    "unit": "mg",
    "percentOfDailyNeeds": 25.29
  },
  {
    "name": "Vitamin B12",
    "amount": 1.42,
    "unit": "µg",
    "percentOfDailyNeeds": 23.74
  },
  {
    "name": "Vitamin E",
    "amount": 3.14,
    "unit": "mg",
    "percentOfDailyNeeds": 20.9
  },
  {
    "name": "Vitamin B2",
    "amount": 0.35,
    "unit": "mg",
    "percentOfDailyNeeds": 20.78
  },
  {
    "name": "Fiber",
    "amount": 4.76,
    "unit": "g",
    "percentOfDailyNeeds": 19.04
  },
  {
    "name": "Vitamin C",
    "amount": 15.62,
    "unit": "mg",
    "percentOfDailyNeeds": 18.94
  },
  {
    "name": "Vitamin A",
    "amount": 883.16,
    "unit": "IU",
    "percentOfDailyNeeds": 17.66
  },
  {
    "name": "Vitamin B5",
    "amount": 1.76,
    "unit": "mg",
    "percentOfDailyNeeds": 17.59
  },
  {
    "name": "Selenium",
    "amount": 11.78,
    "unit": "µg",
    "percentOfDailyNeeds": 16.83
  },
  {
    "name": "Copper",
    "amount": 0.33,
    "unit": "mg",
    "percentOfDailyNeeds": 16.35
  },
  {
    "name": "Vitamin K",
    "amount": 14.68,
    "unit": "µg",
    "percentOfDailyNeeds": 13.98
  },
  {
    "name": "Magnesium",
    "amount": 53.06,
    "unit": "mg",
    "percentOfDailyNeeds": 13.26
  },
  {
    "name": "Calcium",
    "amount": 131.77,
    "unit": "mg",
    "percentOfDailyNeeds": 13.18
  },
  {
    "name": "Vitamin D",
    "amount": 1.93,
    "unit": "µg",
    "percentOfDailyNeeds": 12.9
  },
  {
    "name": "Folate",
    "amount": 25.36,
    "unit": "µg",
    "percentOfDailyNeeds": 6.34
  }
]
const NUTRIENTS_TO_SHOW = ['Calories', 'Fat', 'Carbohydrates', 'Sugar', 'Cholesterol', 'Protein']

export function Recipe() {
  const { id } = useParams<{id?: string}>() || {}
  const {
    data: recipe,
    isLoading: recipeLoading,
    error: recipeError
  } = useRecipe(id || '')
  const [ingredients, setIngredients] = useState<Array<object>>()
  const [instructions, setInstructions] = useState<Array<object>>()
  const [showImage, setShowImage] = useState<boolean>(false)

  // get ingredients and steps instructions from recipe and set to state variables
  useEffect(() => {
    setIngredients(recipe?.extendedIngredients)
    setInstructions(recipe?.analyzedInstructions[0].steps)
  }, [recipe]);

  // show image when it's loaded correctly
  const handleImageLoad = () => {
    setShowImage(true)
  }

  // for testing
  const [filteredNutrients, setFilteredNutrients] = useState<Array<any>>(nutrients)
  useEffect(() => {
    setFilteredNutrients(nutrients.filter((element) => NUTRIENTS_TO_SHOW.includes(element.name)))
  }, []);

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
                  {/* Main photo - show only if recipe contains an image and image is loaded correctly */}
                  {recipe.image && (
                      <img src={recipe.image}
                           onLoad={handleImageLoad}
                           alt={recipe.title}
                           className={cn('rounded-sm max-w-[28rem]', showImage ? 'block' : 'hidden')}/>
                  )}
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
                  <div className={'flex gap-x-12'}>
                    {/* Ingredients */}
                    <div>
                      <RecipeLabel>Ingredients</RecipeLabel>
                      {/*<ul>*/}
                      {/*  {ingredients?.map((ingredient: any) => (*/}
                      {/*      <li className={'list-disc ml-5'}*/}
                      {/*          key={ingredient.id}>{ingredient.name} - {ingredient.amount} {ingredient.unit}</li>*/}
                      {/*  ))}*/}
                      {/*</ul>*/}
                      <Table className={'text-md'}>
                        <TableBody>
                          {ingredients?.map((ingredient: any) => (
                              <TableRow key={ingredient.id}>
                                <TableCell>{ingredient.name} - {ingredient.amount} {ingredient.unit}</TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Nutrition facts */}
                    <div>
                      <RecipeLabel>Nutrition facts:</RecipeLabel>
                      <Table className={'w-auto text-md'}>
                        <TableBody>
                          {filteredNutrients.map((element) => (
                              <TableRow key={element.name}>
                                <TableCell>{element.name}</TableCell>
                                <TableCell>{Math.round(element.amount)} {element.unit}</TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/*<div>*/}
                    {/*  <RecipeLabel>Nutrition facts:</RecipeLabel>*/}
                    {/*  <Table className={'w-auto'}>*/}
                    {/*    <TableBody>*/}
                    {/*      <TableRow>*/}
                    {/*        <TableCell className={'font-bold'}>Calories</TableCell>*/}
                    {/*        <TableCell>934 kcal</TableCell>*/}
                    {/*      </TableRow>*/}
                    {/*      <TableRow>*/}
                    {/*        <TableCell className={'font-bold'}>Fat</TableCell>*/}
                    {/*        <TableCell>59 g</TableCell>*/}
                    {/*      </TableRow>*/}
                    {/*      <TableRow>*/}
                    {/*        <TableCell className={'font-bold'}>Carbohydrates</TableCell>*/}
                    {/*        <TableCell>61 g</TableCell>*/}
                    {/*      </TableRow>*/}
                    {/*      <TableRow>*/}
                    {/*        <TableCell className={'font-bold'}>Sugar</TableCell>*/}
                    {/*        <TableCell>13 g</TableCell>*/}
                    {/*      </TableRow>*/}
                    {/*      <TableRow>*/}
                    {/*        <TableCell className={'font-bold'}>Protein</TableCell>*/}
                    {/*        <TableCell>43 g</TableCell>*/}
                    {/*      </TableRow>*/}
                    {/*      <TableRow>*/}
                    {/*        <TableCell className={'font-bold'}>Fat</TableCell>*/}
                    {/*        <TableCell>59 g</TableCell>*/}
                    {/*      </TableRow>*/}
                    {/*    </TableBody>*/}
                    {/*  </Table>*/}
                    {/*</div>*/}
                  </div>
                  {/* Instructions */}
                  <div>
                    <RecipeLabel>Instructions</RecipeLabel>
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