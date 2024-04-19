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
import {Minus, Plus} from "lucide-react";
import {
  MAX_INGREDIENT_NAME_LEN, MAX_INGREDIENT_QUANTITY_LEN,
  MAX_PREPARATION_TIME,
  MAX_RECIPE_DESCRIPTION_LEN,
  MAX_RECIPE_TITLE_LEN,
  MAX_SERVINGS_NUMBER,
  MAX_STEP_INSTRUCTION_LEN
} from "@/helpers/constants.ts";

// type for AddButton and SubtractButton
type OperationButtonProps = {
  fieldName: 'preparationTime' | 'servingsNumber'
  step?: number
}

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
  preparationTime: z.coerce.number().int().nonnegative()
      .max(MAX_PREPARATION_TIME, {message: `Max time is ${MAX_PREPARATION_TIME} minutes`}),
  servingsNumber: z.coerce.number().int().positive()
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

  // Button to decrease the number of minutes or portions
  function SubtractButton({fieldName, step = 1}: OperationButtonProps) {
    function subtract() {
      const oldValue = Number(form.getValues(fieldName))

      if(oldValue > 0) {
        const remainder = oldValue % step
        let newValue = 0

        // if oldValue is indivisible by step -> set newValue to oldValue rounded down to nearest multiple of step (e.g. 32 -> 30, not 27 if step is 5)
        if(remainder != 0) {
          newValue = oldValue - remainder
        }
        else {
          newValue = oldValue - step
        }

        form.setValue(fieldName, newValue)
      }
    }

    return (
        <Button type={'button'} className={'h-9 p-2 rounded-full'} onClick={subtract}>
          <Minus size={20}/>
        </Button>
    )
  }

  // Button to increase the number of minutes or portions
  function AddButton({fieldName, step = 1}: OperationButtonProps) {
    function add() {
      form.setValue(fieldName, Number(form.getValues(fieldName)) + step)
    }

    return (
        <Button type={'button'} className={'h-9 p-2 rounded-full'} onClick={add}>
          <Plus size={20}/>
        </Button>
    )
  }

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
                          <SubtractButton fieldName={'preparationTime'} step={5}/>
                          <FormControl>
                            <Input type={'text'} className={'w-14'} placeholder={'20'} {...field}/>
                          </FormControl>
                          <AddButton fieldName={'preparationTime'} step={5}/>
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
                          <SubtractButton fieldName={'servingsNumber'}/>
                          <FormControl>
                            <Input type={'text'} className={'w-14'} placeholder={'4'} {...field}/>
                          </FormControl>
                          <AddButton fieldName={'servingsNumber'}/>
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