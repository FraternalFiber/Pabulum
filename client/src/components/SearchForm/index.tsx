import { z } from "zod";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {SearchResults} from "@/components/SearchResults";
import {IRecipeResult} from "@/types/IRecipeResult.ts";
import {cuisineItems, dietItems} from './searchFormFilterItems.ts'
import {SearchFormFilter} from "@/components/SearchForm/SearchFormFilter.tsx";
// import {FancyMultiSelect} from "@/components/ui/fancy-multi-select.tsx";

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  searchTerm: z
      .string()
      .trim()
      .min(2, {message: "Enter at least 2 characters"})
      .max(50, {message: "Enter no more than 50 characters."}),
  dietItems: z.array(z.string()),
  cuisineItems: z.array(z.string())
})

export function SearchForm() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<Array<IRecipeResult> | null>(null)

  // Form definition using a Zod schema for validation. "z.infer" infers a TypeScript type from a Zod schema.
  const form = useForm<z.infer<typeof formSchema>>({
    // use forSchema to validate form data
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: "",
      dietItems: [],
      cuisineItems: []
    }
  })

  // Code executed after submitting a form
  function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitted(true)
    console.log(values)

    fetch('http://127.0.0.1:42069/search')
        .then(res => res.json())
        .then((res) => {
          console.log(res.results)
          setSearchResults(res.results)
        })
        .catch((error) => {
          console.error('Backend API connection error: ', error)
          throw ('Backend API connection error: ' + error)
        })
  }

  return (
      <>
        {/* Main form form searching recipes */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={'flex flex-col'}>
            <div className={'flex gap-x-2'}>
              {/* Main search field */}
              <FormField
                  control={form.control}
                  name={'searchTerm'}
                  render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <Input className={'w-64'} placeholder={"Dish name..."} {...field}/>
                        </FormControl>
                      </FormItem>
                  )}
              />
              <Button type={'submit'}>Search</Button>
            </div>
            <div className={'mt-3 flex gap-x-3'}>
              {/* Diet filter */}
              <SearchFormFilter title={'Diet'} name={'dietItems'} items={dietItems} form={form}/>
              {/* Cuisine filter */}
              <SearchFormFilter title={'Cuisine'} name={'cuisineItems'} items={cuisineItems} form={form}/>
            </div>
          </form>
        </Form>
        {/* If form submitted show search results */}
        {isSubmitted &&
           <SearchResults results={searchResults}/>
        }
      </>
  );
}