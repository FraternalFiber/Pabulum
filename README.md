![Pabulum - logo](/client/src/assets/images/logo_with_text_small_bg.svg)

# About project

**Pabulum** is a recipe management platform that combines the best of two worlds: a vast recipe database and personalized features for home cooks. It enables users to search for recipes from large external database, as well as to manage their own.


## Features

- Online recipe search
- Filtering by diet, cuisine and type of meal
- Creating your own recipes
- Browsing and managing your recipes


## Routes description

| Path                      | Description                                                                                                                |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `/`                       | A home page containing a simple search box for finding recipes. Redirects to the `/search` subpage after submitting data.  |
| `/search`                 | A page with a form that allows user to search for recipes with or without filters. Displays results after submitting data. |
| `/recipes/<id>`           | A page displaying detailed information about an online recipe.                                                             |
| `/recipes/create`         | A page containing a form, giving the user the possibility to add a new recipe to their collection.                         |
| `/user/recipes`           | A place where the user can see all their recipes and can search for specific ones.                                         |
| `/user/recipes/<id>`      | A page displaying detailed information about a recipe created by the user.                                                 |
| `/user/recipes/<id>/edit` | A route allowing the user to edit their recipe.                                                                            |




---
### Made by

[@FraternalFiber](https://github.com/FraternalFiber/)
and
[@theMicalo](https://github.com/theMicalo/)