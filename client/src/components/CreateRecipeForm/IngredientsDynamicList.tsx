import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "@/components/ui/button.tsx";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { TIngredient } from "@/types/TIngredient.ts";

type IngredientsTableProps = {
  form: any;
};

type IngredientRow = {
  id: string;
  name: string;
  quantity: string;
};

// Part of a CreateRecipeForm component, for adding ingredients dynamically
export function IngredientsDynamicList({ form }: IngredientsTableProps) {
  // Every pair of inputs (name and quantity) is added to an ingredients array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  // remove an ingredient row with a specific index
  function removeIngredient(index: number) {
    remove(index);

    // add a new blank row if the last one has been removed
    if (fields.length == 1) {
      append({ name: "", quantity: "" });
    }
  }

  // returns true if ingredient name and quantity are empty
  function isEmptyRow(ingredientRow: TIngredient): boolean {
    return !ingredientRow.name && !ingredientRow.quantity;
  }

  // returns index of first empty row after the current row or -1 if such not found
  function getNextEmptyRowIndex(ingredientFields: IngredientRow[], currentIndex: number): number {
    for (let index = currentIndex + 1; index < ingredientFields.length; index++) {
      if (isEmptyRow(ingredientFields[index])) {
        return index;
      }
    }

    return -1;
  }

  // Add new ingredient row when Enter is pressed inside inputs
  function handleKeyDown(e: any, currentRowIndex: number) {
    if (e.key == "Enter") {
      const ingredientFields = form.watch("ingredients");
      const nextEmptyRowIndex: number = getNextEmptyRowIndex(ingredientFields, currentRowIndex);

      // set focus on next empty row if found
      if (nextEmptyRowIndex >= 0) {
        form.setFocus(`ingredients.${nextEmptyRowIndex}.name`, { shouldSelect: true });
      }
      // else add a new ingredient row
      else {
        append({ name: "", quantity: "" });
      }

      // prevent form from submitting after clicking Enter
      e.preventDefault();
    }
  }

  return (
    <>
      <div className={"text-2xl mt-7 font-semibold"}>Ingredients</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={"text-black"}>Ingredient name</TableHead>
            <TableHead className={"text-black pl-0 md:pl-4"} colSpan={2}>
              Quantity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              {/*#region Ingredient name input */}
              <TableCell>
                <FormField
                  name={`ingredients.${index}.name`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={"Ingredient name"}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              {/*#endregion*/}
              {/*#region Ingredient quantity input */}
              <TableCell className={"pl-0 pr-2 md:pl-4 md:pr-4"}>
                <FormField
                  name={`ingredients.${index}.quantity`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={"Quantity"}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              {/*#endregion*/}
              {/*#region Button to delete a row with an ingredient */}
              <TableCell className={"m-0 p-0 pr-2"}>
                <Button
                  type={"button"}
                  className={"bg-transparent hover:bg-destructive"}
                  onClick={() => removeIngredient(index)}
                  data-testid={"delete-ingredient-button"}
                >
                  <Trash2 color={"black"} />
                </Button>
              </TableCell>
              {/*#endregion*/}
            </TableRow>
          ))}
        </TableBody>
        {/*#region Button to add a row with a new ingredient */}
        <TableCaption>
          <Button
            type={"button"}
            onClick={() => append({ name: "", quantity: "" })}
            data-testid={"add-ingredient-button"}
          >
            <Plus />
          </Button>
        </TableCaption>
        {/*#endregion*/}
      </Table>
    </>
  );
}
