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
  MAX_PREP_TIME,
  MAX_SERVINGS_NUMBER,
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
import {
  formSchema,
} from "@/components/CreateRecipeForm/schemas.ts";
import {useNavigate} from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const FormLabelStyled = styled(FormLabel).attrs({
  className: 'text-2xl'
})``

// Form to create a new recipe
export function CreateRecipeForm() {
  // state used to store value of image for upload
  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  const [imageFileValue, setImageFileValue] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // Used for managing cache data
  const queryClient = useQueryClient()
  // Used for redirecting
  const navigate = useNavigate();

  // Code executed after submitting a form
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    // Show a loading toast
    const loadingToastId = toast.loading('Creating a recipe...')
    setIsLoading(true)

    try {
      // Post recipe data to database
      const response = await postRecipe(values, queryClient)

      if(response.success) {
        // Dismiss a loading toast and show a success toast
        toast.dismiss(loadingToastId)
        toast.success(POST_RECIPE_SUCCESS_MESSAGE)

        console.log(response.message)
        console.log(response.id)

        // Redirect to a newly created recipe
        setTimeout(() => {
          navigate({
            pathname: `/user/recipes/${response.id}`,
          })
        }, 1000)
      }
      else {
        // Dismiss a loading toast and show an error toast
        toast.dismiss(loadingToastId)
        setIsLoading(false)
        toast.error(POST_RECIPE_ERROR_MESSAGE)
        console.error(`${POST_RECIPE_ERROR_MESSAGE}: ${response.message}`)
        console.error(response.message)
      }
    }
    catch(error) {
      // Dismiss a loading toast and show an error toast
      toast.dismiss(loadingToastId)
      setIsLoading(false)
      toast.error(POST_RECIPE_ERROR_MESSAGE)
      console.error(`${POST_RECIPE_ERROR_MESSAGE}: ${error}`)
    }
  }

  // React Hook Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    // Use forSchema to validate form data
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
            <div className={'flex gap-x-8 flex-wrap gap-y-5'}>
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
                    key={diet.value}
                    name={'diets'}
                    control={form.control}
                    render={({field}) => {
                      return (
                          <FormItem key={diet.value}>
                            <FormControl>
                              <Checkbox
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, diet.value])
                                    : field.onChange(
                                        field.value?.filter(
                                            (value) => value !== diet.value
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
            <Button type={'submit'} className={'mt-5 select-none transition'} disabled={isLoading}>Create</Button>
          </form>
        </Form>
      </>
  )
}