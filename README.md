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


## Running app

- For running the project a file with a private key taken from ([Firebase](https://console.firebase.google.com/) -> Project Overview -> Project settings -> Service accounts) is needed in the `creds.json` file  under project directory `/server/firebase/`
- Next thing to do is pasting API key from ([Spoonacular API](https://spoonacular.com/food-api) -> console -> Profile) into the `.env` file under project directory `/server/` as following: `SPOONACULAR_APIKEY=<API key here>`

- In console go to project directory
- in both `/server/` and `/client/` directories run `npm install` to install all needed dependencies
- To run server run `npm run dev` command in `/server/` directory
- To run client run `npm run dev` command in `/client/` directory

## Running Cypress tests

- Run the app by following the instructions above
- In project root directory run `npx cypress open`
- In Cypress window click E2E tests, choose prefered browser and choose tests to run


---
### Made by

[@FraternalFiber](https://github.com/FraternalFiber/)
and
[@theMicalo](https://github.com/theMicalo/)
