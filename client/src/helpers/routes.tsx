import React from "react";
import {Home} from "@/pages/Home";
import {Search} from "@/pages/Search";
import {Discover} from "@/pages/Discover";
import {MyRecipes} from "@/pages/MyRecipes";
import {Pantry} from "@/pages/Pantry";
import {CreateRecipe} from "@/pages/CreateRecipe";
import {Account} from "@/pages/Account";
import {Recipe} from "@/pages/Recipe";
import {NotFound} from "@/pages/NotFound";
import { EditRecipe } from "@/pages/EditRecipe";

interface RouteElement {
  path: string
  element: React.JSX.Element
}

export const routes: Array<RouteElement> = [
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/search',
    element: <Search/>
  },
  {
    path: '/discover',
    element: <Discover/>
  },
  {
    path: '/user/recipes',
    element: <MyRecipes/>
  },
  {
    path: '/user/recipes/create',
    element: <CreateRecipe/>
  },
  {
    path: '/user/recipes/:id/edit',
    element: <EditRecipe/>
  },
  {
    path: '/recipes/:id',
    element: <Recipe dataSource={'online'}/>
  },
  {
    path: '/user/recipes/:id',
    element: <Recipe dataSource={'user'}/>
  },
  {
    path: '/pantry',
    element: <Pantry/>
  },
  {
    path: '/account',
    element: <Account/>
  },
  {
    path: '*',
    element: <NotFound/>
  }
]