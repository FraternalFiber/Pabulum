import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {IngredientsTable} from "./IngredientsTable.tsx";
import {StepsTable} from "@/components/CreateRecipeForm/StepsTable.tsx";
import styled from "styled-components";
import {dietItems} from "@/components/SearchForm/searchFormFilterItems.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

// Schema for a single ingredient
const ingredientSchema = z.object({
  name: z.string()
      .min(1, {message: 'Enter an ingredient name'})
      .max(80, {message: 'Enter no more than 80 characters'}),
  quantity: z.string().min(0)
      .max(30, {message: 'Enter no more than 30 characters'})
  // amount: z.number().min(1).max(10000),
  // unit: z.string().min(0).max(20)
})

// Schema for a single recipe step
const stepSchema = z.object({
  // number: z.coerce.number().int().positive(),
  instruction: z.string().min(2).max(1000)
})

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  title: z.string().trim()
      .min(2, {message: 'Enter at least 2 characters'})
      .max(80, {message: 'Enter no more than 80 characters'}),
  preparationTime: z.coerce.number().int().nonnegative()
      .max(1440, {message: 'Max time is 1440 minutes'}),
  servingsNumber: z.coerce.number().int().positive()
      .max(1000, {message: 'Max number of servings is 1000'}),
  description: z.string().trim()
      .min(0)
      .max(2000, {message: 'Enter no more than 2000 characters'}),
  diets: z.array(z.string()),
  ingredients: z.array(ingredientSchema),
  steps: z.array(stepSchema)
})

const FormLabelStyled = styled(FormLabel).attrs({
  className: 'text-2xl'
})``

export function CreateRecipeForm() {
  // Code executed after submitting a form
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  // React Hook Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    // use forSchema to validate form data
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      preparationTime: 0,
      servingsNumber: 1,
      description: '',
      diets: [],
      ingredients: [
        {
          name: '',
          quantity: ''
        }
      ],
      steps: [
        {
          instruction: ''
        }
      ]
    }
  })

  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={'flex flex-col gap-y-5'}>
            {/*#region Title input*/}
            <FormField
                name={'title'}
                control={form.control}
                render={({field}) => (
                    <FormItem>
                      <FormLabelStyled>Title</FormLabelStyled>
                      <FormControl>
                        <Input className={''} placeholder={'Italian pizza...'} {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}
            />
            {/*#endregion*/}
            {/*#region Preparation time and servings number inputs */}
            <div className={'flex gap-x-5'}>
              <FormField
                  name={'preparationTime'}
                  control={form.control}
                  render={({field}) => (
                      <FormItem>
                        <FormLabelStyled>Prep time</FormLabelStyled>
                        <FormControl>
                          <Input type={'number'} className={'w-16'} placeholder={'20'} {...field}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  name={'servingsNumber'}
                  control={form.control}
                  render={({field}) => (
                      <FormItem>
                        <FormLabelStyled>Servings</FormLabelStyled>
                        <FormControl>
                          <Input type={'number'} className={'w-16'} placeholder={'20'} {...field}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
            </div>
            {/*#endregion*/}
            {/*#region Description textarea*/}
            <FormField
                name={'description'}
                control={form.control}
                render={({field}) => (
                    <FormItem>
                      <FormLabelStyled>Description</FormLabelStyled>
                      <FormControl>
                        <Textarea className={'h-10 min-h-10'} placeholder={'The best pizza in the world!'} {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}
            />
            {/*#endregion*/}
            {/*#region Diet checkboxes*/}
            <FormLabelStyled>Diets</FormLabelStyled>
            <div className={'flex flex-wrap gap-5'}>
              {dietItems.map((diet) => (
                <FormField
                    key={diet.id}
                    name={'diets'}
                    control={form.control}
                    render={({field}) => {
                      return (
                          <FormItem key={diet.id}>
                            <FormControl>
                              <Checkbox
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, diet.id])
                                    : field.onChange(
                                        field.value?.filter(
                                            (value) => value !== diet.id
                                        )
                                      )
                                }}/>
                            </FormControl>
                            <FormLabel className={'ml-2 cursor-pointer'}>
                              {diet.label}
                            </FormLabel>
                          </FormItem>
                      )
                    }}/>
              ))}
            </div>
            {/*#endregion*/}
            {/*#region Ingredients dynamic list */}
            <IngredientsTable form={form}/>
            {/*#endregion*/}
            {/*#region Steps dynamic list*/}
            <StepsTable form={form}/>
            {/*#endregion*/}
            <Button type={'submit'} className={'mt-5'}>Create</Button>
          </form>
        </Form>
      </>
  )
}