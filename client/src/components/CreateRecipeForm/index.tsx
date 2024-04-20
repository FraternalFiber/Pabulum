import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {IngredientsDynamicList} from "./IngredientsDynamicList.tsx";
import {StepsDynamicList} from "@/components/CreateRecipeForm/StepsDynamicList.tsx";
import styled from "styled-components";
import {dietItems} from "@/components/SearchForm/searchFormFilterItems.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {
  MAX_INGREDIENT_NAME_LEN, MAX_INGREDIENT_QUANTITY_LEN,
  MAX_PREP_TIME,
  MAX_RECIPE_DESCRIPTION_LEN,
  MAX_RECIPE_TITLE_LEN,
  MAX_SERVINGS_NUMBER,
  MAX_STEP_INSTRUCTION_LEN, MIN_PREP_TIME, MIN_SERVINGS_NUMBER, PREP_TIME_STEP, SERVINGS_NUMBER_STEP
} from "@/helpers/constants.ts";
import {SubtractButton} from "@/components/CreateRecipeForm/SubtractButton.tsx";
import {AddButton} from "@/components/CreateRecipeForm/AddButton.tsx";

// Schema for a single ingredient
const ingredientSchema = z.object({
  name: z.string()
      .min(1, {message: 'Enter an ingredient name'})
      .max(MAX_INGREDIENT_NAME_LEN, {message: `Enter no more than ${MAX_INGREDIENT_NAME_LEN} characters`}),
  quantity: z.string().min(0)
      .max(30, {message: `Enter no more than ${MAX_INGREDIENT_QUANTITY_LEN} characters`})
  // amount: z.number().min(1).max(10000),
  // unit: z.string().min(0).max(20)
})

// Schema for a single recipe step
const stepSchema = z.object({
  // number: z.coerce.number().int().positive(),
  instruction: z.string()
      .min(1, {message: 'Enter a step'})
      .max(MAX_STEP_INSTRUCTION_LEN, {message: `Enter no more than ${MAX_STEP_INSTRUCTION_LEN} characters`})
})

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  title: z.string().trim()
      .min(1, {message: 'Enter a recipe title'})
      .max(MAX_RECIPE_TITLE_LEN, {message: `Enter no more than ${MAX_RECIPE_TITLE_LEN} characters`}),
  preparationTime: z.coerce
      .number({invalid_type_error: 'Enter a number'})
      .min(MIN_PREP_TIME, {message: `Min time is ${MIN_PREP_TIME} minutes`})
      .max(MAX_PREP_TIME, {message: `Max time is ${MAX_PREP_TIME} minutes`}),
  servingsNumber: z.coerce
      .number({invalid_type_error: 'Enter a number'})
      .int({message: 'Enter an integer number'})
      .min(MIN_SERVINGS_NUMBER, {message: `Min number of servings is ${MIN_SERVINGS_NUMBER}`})
      .max(MAX_SERVINGS_NUMBER, {message: `Max number of servings is ${MAX_SERVINGS_NUMBER}`}),
  description: z.string().trim()
      .min(0)
      .max(MAX_RECIPE_DESCRIPTION_LEN, {message: `Enter no more than ${MAX_RECIPE_DESCRIPTION_LEN} characters`}),
  diets: z.array(z.string()),
  ingredients: z.array(ingredientSchema),
  steps: z.array(stepSchema)
})

const FormLabelStyled = styled(FormLabel).attrs({
  className: 'text-2xl'
})``

// Form to create a new recipe
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className={'flex flex-col gap-y-5 max-w-[40rem]'}>
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
                        <div className={'flex gap-x-2 items-center'}>
                          <SubtractButton form={form} fieldName={'preparationTime'} step={PREP_TIME_STEP}/>
                          <FormControl>
                            <Input type={'text'} className={'w-14'} placeholder={'20'} {...field}/>
                          </FormControl>
                          <AddButton form={form} fieldName={'preparationTime'} step={PREP_TIME_STEP} maxValue={MAX_PREP_TIME}/>
                        </div>
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
                        <div className={'flex gap-x-2 items-center'}>
                          <SubtractButton form={form} fieldName={'servingsNumber'} minValue={MIN_SERVINGS_NUMBER} step={SERVINGS_NUMBER_STEP}/>
                          <FormControl>
                            <Input type={'text'} className={'w-14'} placeholder={'4'} {...field}/>
                          </FormControl>
                          <AddButton form={form} fieldName={'servingsNumber'}  step={SERVINGS_NUMBER_STEP}/>
                        </div>
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
            <IngredientsDynamicList form={form}/>
            <StepsDynamicList form={form}/>
            <Button type={'submit'} className={'mt-5'}>Create</Button>
          </form>
        </Form>
      </>
  )
}