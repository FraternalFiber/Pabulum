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
import {availableDietItems} from "@/components/SearchForm/searchFormFilterItems.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_INGREDIENT_NAME_LEN,
  MAX_INGREDIENT_QUANTITY_LEN,
  MAX_PREP_TIME,
  MAX_RECIPE_DESCRIPTION_LEN, MAX_RECIPE_IMAGE_SIZE,
  MAX_RECIPE_TITLE_LEN,
  MAX_SERVINGS_NUMBER,
  MAX_STEP_INSTRUCTION_LEN,
  MIN_PREP_TIME,
  MIN_SERVINGS_NUMBER,
  POST_RECIPE_ERROR_MESSAGE, POST_RECIPE_SUCCESS_MESSAGE,
  PREP_TIME_STEP,
  SERVINGS_NUMBER_STEP
} from "@/helpers/constants.ts";
import {SubtractButton} from "@/components/CreateRecipeForm/SubtractButton.tsx";
import {AddButton} from "@/components/CreateRecipeForm/AddButton.tsx";
import {postRecipe} from "@/services/postRecipe.ts";
import {toast} from "sonner";
import {useState} from "react";
import {ImagePreview} from "@/components/CreateRecipeForm/ImagePreview.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {AspectRatio} from "@/components/ui/aspect-ratio.tsx";

// Schema for a single ingredient
const ingredientSchema = z.object({
  name: z.string().trim()
      .min(1, {message: 'Enter an ingredient name'})
      .max(MAX_INGREDIENT_NAME_LEN, {message: `Enter no more than ${MAX_INGREDIENT_NAME_LEN} characters`}),
  quantity: z.string().trim()
      .max(30, {message: `Enter no more than ${MAX_INGREDIENT_QUANTITY_LEN} characters`})
      .optional()
})

// Schema for a single recipe step
const stepSchema = z.object({
  instruction: z
      .string()
      .trim()
      .min(1, {message: 'Enter a step'})
      .max(MAX_STEP_INSTRUCTION_LEN, {message: `Enter no more than ${MAX_STEP_INSTRUCTION_LEN} characters`})
})

// List of available diets for validation (only IDs)
const availableDiets = availableDietItems.map(diet => diet.id)

// Schema for a single diet, checks if diet is in a list of available diets
const dietSchema = z.string().refine(diet => availableDiets.includes(diet),{
  message: 'Invalid diet, must be one of: ' + availableDiets.join(', ')
})

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  title: z
      .string()
      .trim()
      .min(1, {message: 'Enter a recipe title'})
      .max(MAX_RECIPE_TITLE_LEN, {message: `Enter no more than ${MAX_RECIPE_TITLE_LEN} characters`}),
  image: z
      .custom<File>((file) => file instanceof File, {message: 'Expected a file'})
      .refine((file) => file.size <= MAX_RECIPE_IMAGE_SIZE, 'Max file size is 5 MB')
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'File type not supported. Use one of .jpg, .jpeg, .png and .jfif.')
      .optional(),
  prepTime: z
      .coerce.number({invalid_type_error: 'Enter a number'})
      .min(MIN_PREP_TIME, {message: `Min time is ${MIN_PREP_TIME} minutes`})
      .max(MAX_PREP_TIME, {message: `Max time is ${MAX_PREP_TIME} minutes`}),
  servingsNumber: z
      .coerce.number({invalid_type_error: 'Enter a number'})
      .int({message: 'Enter an integer number'})
      .min(MIN_SERVINGS_NUMBER, {message: `Min number of servings is ${MIN_SERVINGS_NUMBER}`})
      .max(MAX_SERVINGS_NUMBER, {message: `Max number of servings is ${MAX_SERVINGS_NUMBER}`}),
  description: z
      .string()
      .trim()
      .min(0)
      .max(MAX_RECIPE_DESCRIPTION_LEN, {message: `Enter no more than ${MAX_RECIPE_DESCRIPTION_LEN} characters`}),
  diets: z.array(dietSchema),
  ingredients: z.array(ingredientSchema),
  steps: z.array(stepSchema).transform((steps) => {
    // add indexes to steps to make sure they are in correct order
    return steps.map((step, index) => ({
      ...step,
      number: index + 1
    }))
  })
})

const FormLabelStyled = styled(FormLabel).attrs({
  className: 'text-2xl'
})``

// Form to create a new recipe
export function CreateRecipeForm() {
  // state used to store value of image for upload
  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  const [imageFileValue, setImageFileValue] = useState('')

  // Code executed after submitting a form
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    // show a loading toast
    const loadingToastId = toast.loading('Creating a recipe...')

    try {
      // post recipe data to database
      const response = await postRecipe(values)

      if(response.success) {
        // dismiss a loading toast and show a success toast
        toast.dismiss(loadingToastId)
        toast.success(POST_RECIPE_SUCCESS_MESSAGE)
        console.log(response.message)

        // REDIRECT TO NEWLY CREATED RECIPE HERE
      }
      else {
        // dismiss a loading toast and show an error toast
        toast.dismiss(loadingToastId)
        toast.error(POST_RECIPE_ERROR_MESSAGE)
        console.error(`${POST_RECIPE_ERROR_MESSAGE}: ${response.message}`)
        console.error(response.message)
      }
    }
    catch(error) {
      // dismiss a loading toast and show an error toast
      toast.dismiss(loadingToastId)
      toast.error(POST_RECIPE_ERROR_MESSAGE)
      console.error(`${POST_RECIPE_ERROR_MESSAGE}: ${error}`)
    }
  }

  // React Hook Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    // use forSchema to validate form data
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      image: undefined,
      prepTime: 0,
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

  const deleteImage = () => {
    // form.trigger('image').then(() => {
      setImageFile(undefined)
      setImageFileValue('')
      form.setValue('image', undefined)
    // })
  }

  const handleImageError = () => {
    form.setError('image', {type: 'custom', message: "File couldn't be loaded correctly"})
    deleteImage()
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
                        <Input placeholder={'Italian pizza...'} {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}
            />
            {/*#endregion*/}
            {/*#region Image*/}
            <FormField
              name={'image'}
              control={form.control}
              render={({field}) => (
                  <FormItem>
                    <FormLabelStyled>Image</FormLabelStyled>
                    <FormControl>
                      <div className={'pt-1'}>
                        {/*Visible label for uploading files to input*/}
                        {!imageFile && (
                            <Label htmlFor={'imageUploadInput'} className={'block w-full sm:max-w-96 cursor-pointer'}>
                              <Card>
                                <CardContent className={'w-full h-full flex justify-center items-center text-lg hover:underline underline-offset-2 decoration-2 p-5'}>
                                  Upload image
                                </CardContent>
                              </Card>
                            </Label>
                        )}

                        {/*Preview of an image to upload - show when file is set*/}
                        {imageFile && (
                            <div className={'w-full max-w-96 mb-2'}>
                              <AspectRatio ratio={3 / 2}>
                                <ImagePreview file={imageFile} deleteImage={deleteImage} handleImageError={handleImageError}/>
                              </AspectRatio>
                            </div>
                        )}

                        <Input
                            {...field}
                            type={'file'}
                            id={'imageUploadInput'}
                            className={'hidden'}
                            value={imageFileValue}
                            accept={ACCEPTED_IMAGE_TYPES.toString()}
                            onChange={(e) => {
                              setImageFileValue(e.target.value)
                              form.setValue('image', e.target.files?.[0])

                              // Trigger field validation
                              form.trigger('image').then((valid) => {
                                if(valid) {
                                  // Set image file if it's valid
                                  setImageFile(e.target.files?.[0])
                                }
                                else {
                                  // Delete image file if it's not valid
                                  deleteImage()
                                }
                              })
                            }}/>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}
            />

            {/*#endregion*/}
            {/*#region Preparation time and servings number inputs */}
            <div className={'flex gap-x-8'}>
              <FormField
                  name={'prepTime'}
                  control={form.control}
                  render={({field}) => (
                      <FormItem>
                        <FormLabelStyled>Prep time</FormLabelStyled>
                        <div className={'flex gap-x-2 items-center'}>
                          <SubtractButton form={form} fieldName={'prepTime'} step={PREP_TIME_STEP}/>
                          <FormControl>
                            <Input type={'text'} className={'w-12'} placeholder={'20'} {...field}/>
                          </FormControl>
                          <div>min</div>
                          <AddButton form={form} fieldName={'prepTime'} step={PREP_TIME_STEP} maxValue={MAX_PREP_TIME}/>
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
                            <Input type={'text'} className={'w-12'} placeholder={'4'} {...field}/>
                          </FormControl>
                          <AddButton form={form} fieldName={'servingsNumber'} step={SERVINGS_NUMBER_STEP} maxValue={MAX_SERVINGS_NUMBER}/>
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
              {availableDietItems.map((diet) => (
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