import React from "react";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Discover from "@/pages/Discover";
import MyRecipes from "@/pages/MyRecipes";
import Pantry from "@/pages/Pantry";
import CreateRecipe from "@/pages/CreateRecipe";
import Account from "@/pages/Account";

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
    path: '/recipe',
    element: <MyRecipes/>
  },
  {
    path: '/pantry',
    element: <Pantry/>
  },
  {
    path: '/recipe/create',
    element: <CreateRecipe/>
  },
  {
    path: '/account',
    element: <Account/>
  }
]