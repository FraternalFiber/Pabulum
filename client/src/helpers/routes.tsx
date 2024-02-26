import React from "react";
import Home from "@/pages/Home";

interface RouteElement {
  path: string
  element: React.JSX.Element
  title: string
}

export const routes: Array<RouteElement> = [
  {
    path: '/',
    element: <Home/>,
    title: 'Pabulum | Home'
  }
]