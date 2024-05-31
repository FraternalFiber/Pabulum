// Type for URL search params when searching in recipes from API
export type TRecipeSearchParams = {
  q: string
  diet: Array<string>
  cuisine: Array<string>
  mealType: Array<string>
}