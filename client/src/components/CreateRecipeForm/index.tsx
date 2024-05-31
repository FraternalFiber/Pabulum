import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { IngredientsDynamicList } from "./IngredientsDynamicList.tsx";
import { StepsDynamicList } from "@/components/CreateRecipeForm/StepsDynamicList.tsx";
import styled from "styled-components";
import { availableDietItems } from "@/components/SearchForm/searchFormFilterItems.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  ACCEPTED_IMAGE_TYPES,
  EDIT_RECIPE_ERROR_MESSAGE,
  EDIT_RECIPE_SUCCESS_MESSAGE,
  MAX_PREP_TIME,
  MAX_SERVINGS_NUMBER,
  MIN_SERVINGS_NUMBER,
  POST_RECIPE_ERROR_MESSAGE,
  POST_RECIPE_SUCCESS_MESSAGE,
  PREP_TIME_STEP,
  SERVINGS_NUMBER_STEP,
} from "@/helpers/constants.ts";
import { SubtractButton } from "@/components/CreateRecipeForm/SubtractButton.tsx";
import { AddButton } from "@/components/CreateRecipeForm/AddButton.tsx";
import { postRecipe } from "@/services/postRecipe.ts";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { formSchema } from "@/components/CreateRecipeForm/schemas.ts";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { TRecipeDetails } from "@/types/TRecipeDetails.ts";
import { editRecipe } from "@/services/editRecipe.ts";
import { ImageLabelAndPreview } from "@/components/CreateRecipeForm/ImageLabelAndPreview.tsx";

const FormLabelStyled = styled(FormLabel).attrs({
  className: "text-2xl",
})``;

type CreateRecipeFormProps = {
  mode?: "create" | "edit";
  initialData?: TRecipeDetails;
  recipeId?: string;
};

// Form to create a new recipe or edit an existing one
export function CreateRecipeForm({
  mode = "create",
  initialData,
  recipeId,
}: CreateRecipeFormProps) {
  // Used to store value of image for upload
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageFileValue, setImageFileValue] = useState("");
  // Used to store recipe image url if exists (in edit mode)
  const [onlineImageUrl, setOnlineImageUrl] = useState<string | null>(null);
  // Used to check if recipe is uploading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Used for managing cache data
  const queryClient = useQueryClient();
  // Used for redirecting
  const navigate = useNavigate();

  // Set initial data (in edit mode)
  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      for (const [key, value] of Object.entries(initialData)) {
        // @ts-expect-error Key will always be of type one of the keys in initialData
        form.setValue(key, value);
      }

      // Check is recipe contains image
      if (initialData.image) {
        setOnlineImageUrl(initialData.image);
        form.setValue("image", undefined);
      }
    }
  }, []);

  // Code executed after submitting a form
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    // Choose messages depending on mode
    const SUCCESS_MESSAGE =
      mode === "create" ? POST_RECIPE_SUCCESS_MESSAGE : EDIT_RECIPE_SUCCESS_MESSAGE;
    const ERROR_MESSAGE = mode === "create" ? POST_RECIPE_ERROR_MESSAGE : EDIT_RECIPE_ERROR_MESSAGE;

    // Show a loading toast
    const loadingToastId = toast.loading(
      mode === "create" ? "Creating a recipe..." : "Saving changes...",
    );
    setIsLoading(true);

    try {
      // Choose service depending on mode
      const response =
        mode === "edit" && recipeId
          ? await editRecipe(values, queryClient, recipeId)
          : await postRecipe(values, queryClient);

      if (response.success) {
        // Dismiss a loading toast and show a success toast
        toast.dismiss(loadingToastId);
        toast.success(SUCCESS_MESSAGE);

        // Redirect to a newly created recipe
        setTimeout(() => {
          navigate({
            pathname: `/user/recipes/${response.id}`,
          });
        }, 1000);
      } else {
        // Dismiss a loading toast and show an error toast
        toast.dismiss(loadingToastId);
        setIsLoading(false);
        toast.error(ERROR_MESSAGE);
        console.error(`${ERROR_MESSAGE}: ${response.message}`);
      }
    } catch (error) {
      // Dismiss a loading toast and show an error toast
      toast.dismiss(loadingToastId);
      setIsLoading(false);
      toast.error(ERROR_MESSAGE);
      console.error(`${ERROR_MESSAGE}: ${error}`);
    }
  };

  // React Hook Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    // Use forSchema to validate form data
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: undefined,
      prepTime: 0,
      servingsNumber: 1,
      description: "",
      diets: [],
      ingredients: [
        {
          name: "",
          quantity: "",
        },
      ],
      steps: [
        {
          instruction: "",
        },
      ],
      imageChanged: false,
    },
  });

  const deleteImage = () => {
    // form.trigger('image').then(() => {
    setImageFile(undefined);
    setImageFileValue("");
    setOnlineImageUrl(null);
    form.setValue("image", undefined);
    form.setValue("imageChanged", true);
    // })
  };

  const handleImageError = () => {
    form.setError("image", { type: "custom", message: "File couldn't be loaded correctly" });
    deleteImage();
  };

  // Navigate back on cancel (in edit mode)
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={"flex flex-col gap-y-5 max-w-[40rem]"}
        >
          {/*#region Title input*/}
          <FormField
            name={"title"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabelStyled>Title</FormLabelStyled>
                <FormControl>
                  <Input placeholder={"Italian pizza..."} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*#endregion*/}
          {/*#region Image*/}
          <FormField
            name={"image"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabelStyled>Image</FormLabelStyled>
                <FormControl>
                  <div className={"pt-1"}>
                    {/*Visible label for uploading files to input*/}
                    {/*{!imageFile && !onlineImageUrl && (*/}
                    {/*    <Label htmlFor={'imageUploadInput'} className={'block w-full sm:max-w-96 cursor-pointer'}>*/}
                    {/*      <Card>*/}
                    {/*        <CardContent className={'w-full h-full flex justify-center items-center text-lg hover:underline underline-offset-2 decoration-2 p-5'}>*/}
                    {/*          Upload image*/}
                    {/*        </CardContent>*/}
                    {/*      </Card>*/}
                    {/*    </Label>*/}
                    {/*)}*/}

                    {/*/!*Preview of an image to upload - show when file is set*!/*/}
                    {/*{imageFile || onlineImageUrl && (*/}
                    {/*    <div className={'w-full max-w-96 mb-2'}>*/}
                    {/*      <AspectRatio ratio={3 / 2}>*/}
                    {/*        <ImagePreview file={imageFile} deleteImage={deleteImage} handleImageError={handleImageError} onlineImageUrl={onlineImageUrl}/>*/}
                    {/*      </AspectRatio>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    <ImageLabelAndPreview
                      imageFile={imageFile}
                      onlineImageUrl={onlineImageUrl}
                      deleteImage={deleteImage}
                      handleImageError={handleImageError}
                    />

                    <Input
                      {...field}
                      type={"file"}
                      id={"imageUploadInput"}
                      className={"hidden"}
                      value={imageFileValue}
                      accept={ACCEPTED_IMAGE_TYPES.toString()}
                      onChange={(e) => {
                        setImageFileValue(e.target.value);
                        form.setValue("image", e.target.files?.[0]);
                        form.setValue("imageChanged", true);
                        console.log(form.getValues());

                        // Trigger field validation
                        form.trigger("image").then((valid) => {
                          if (valid) {
                            // Set image file if it's valid
                            setImageFile(e.target.files?.[0]);
                          } else {
                            // Delete image file if it's not valid
                            deleteImage();
                          }
                        });
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*#endregion*/}
          {/*#region Preparation time and servings number inputs */}
          <div className={"flex gap-x-8 flex-wrap gap-y-5"}>
            <FormField
              name={"prepTime"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabelStyled>Prep time</FormLabelStyled>
                  <div className={"flex gap-x-2 items-center"}>
                    <SubtractButton form={form} fieldName={"prepTime"} step={PREP_TIME_STEP} />
                    <FormControl>
                      <Input type={"text"} className={"w-12"} placeholder={"20"} {...field} />
                    </FormControl>
                    <div>min</div>
                    <AddButton
                      form={form}
                      fieldName={"prepTime"}
                      step={PREP_TIME_STEP}
                      maxValue={MAX_PREP_TIME}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"servingsNumber"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabelStyled>Servings</FormLabelStyled>
                  <div className={"flex gap-x-2 items-center"}>
                    <SubtractButton
                      form={form}
                      fieldName={"servingsNumber"}
                      minValue={MIN_SERVINGS_NUMBER}
                      step={SERVINGS_NUMBER_STEP}
                    />
                    <FormControl>
                      <Input type={"text"} className={"w-12"} placeholder={"4"} {...field} />
                    </FormControl>
                    <AddButton
                      form={form}
                      fieldName={"servingsNumber"}
                      step={SERVINGS_NUMBER_STEP}
                      maxValue={MAX_SERVINGS_NUMBER}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*#endregion*/}
          {/*#region Description textarea*/}
          <FormField
            name={"description"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabelStyled>Description</FormLabelStyled>
                <FormControl>
                  <Textarea
                    className={"h-10 min-h-10"}
                    placeholder={"The best pizza in the world!"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*#endregion*/}
          {/*#region Diet checkboxes*/}
          <FormLabelStyled>Diets</FormLabelStyled>
          <div className={"flex flex-wrap gap-5"}>
            {availableDietItems.map((diet) => (
              <FormField
                key={diet.value}
                name={"diets"}
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem key={diet.value}>
                      <FormControl>
                        <Checkbox
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, diet.value])
                              : field.onChange(
                                  field.value?.filter((value) => value !== diet.value),
                                );
                          }}
                          // Check initial diets (in edit mode)
                          checked={form.getValues("diets").includes(diet.value)}
                        />
                      </FormControl>
                      <FormLabel className={"ml-2 cursor-pointer"}>{diet.label}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          {/*#endregion*/}
          <IngredientsDynamicList form={form} />
          <StepsDynamicList form={form} />
          <div className={"mt-5 grid grid-flow-col auto-cols-fr gap-x-2"}>
            {/* Cancel button (in edit mode) */}
            {mode === "edit" && (
              <Button
                type={"button"}
                variant={"accent"}
                className={"col-span-1"}
                disabled={isLoading}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            {/* Creat or save changes button */}
            <Button
              type={"submit"}
              className={"select-none transition col-span-2"}
              disabled={isLoading}
            >
              {mode === "create" ? "Create" : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
