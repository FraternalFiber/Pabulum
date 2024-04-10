import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

// Schema for a single ingredient
const ingredientSchema = z.object({
  name: z.string(),
  amount: z.number().min(1).max(10000),
  unit: z.string().min(1).max(20)
})

// Schema for a single recipe step
const stepSchema = z.string().min(2).max(1000)

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  title: z.string().trim()
      .min(2, {message: "Enter at least 2 characters"})
      .max(80, {message: "Enter no more than 80 characters."}),
  preparationTime: z.number().nonnegative().int().min(0).max(1440),
  servingsNumber: z.number().positive().int().min(1).max(1000),
  description: z.string().min(1).max(2000),
  ingredients: z.array(ingredientSchema),
  steps: z.array(stepSchema)
})

export function CreateRecipeForm() {
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    // use forSchema to validate form data
    resolver: zodResolver(formSchema),
    // set default values to URL params if they are not undefined (e.g. when reloading page)
    defaultValues: {
      title: '',
      preparationTime: 0,
      servingsNumber: 1,
      description: '',
      ingredients: [],
      steps: []
    }
  })

  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={'flex flex-col gap-y-5'}>
            {/* Title */}
            <FormField
                name={'title'}
                control={form.control}
                render={({field}) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input className={'w-96'} placeholder={'Italian pizza...'} {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}
            />
            {/* Preparation time and servings number */}
            <div className={'flex gap-x-5'}>
              <FormField
                  name={'preparationTime'}
                  control={form.control}
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Preparation time</FormLabel>
                        <FormControl>
                          <Input className={'w-16'} placeholder={'20'} {...field}/>
                        </FormControl>
                      </FormItem>
                  )}
              />
              <FormField
                  name={'servingsNumber'}
                  control={form.control}
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Servings</FormLabel>
                        <FormControl>
                          <Input className={'w-16'} placeholder={'20'} {...field}/>
                        </FormControl>
                      </FormItem>
                  )}
              />
            </div>
            <Button type={'submit'} className={'w-96 mt-5'}>Create</Button>
          </form>
        </Form>
      </>
  )
}