import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Button} from "@/components/ui/button.tsx";
import {Trash2} from "lucide-react";
import {useFieldArray} from "react-hook-form";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";

type IngredientsTableProps = {
  form: any
}

// Part of a CreateRecipeForm component, for adding ingredients dynamically
export function IngredientsTable({form}: IngredientsTableProps) {
  // Every pair of inputs (name and quantity) is added to an ingredients array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients'
  })

  function removeIngredient(index: number) {
    remove(index)

    // add a blank row if the last one has been removed
    if(fields.length == 1) {
      append({name: '', quantity: ''})
    }
  }

  return (
      <>
        <div className={'text-2xl mt-7 font-semibold'}>Ingredients</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={'text-black'}>Ingredient name</TableHead>
              <TableHead className={'text-black'} colSpan={2}>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((item, index) => (
                <TableRow key={item.id}>
                  {/* Ingredient name input */}
                  <TableCell>
                    <FormField
                      name={`ingredients.${index}.name`}
                      control={form.control}
                      render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder={'Ingredient name'} {...field}/>
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                      )}
                    />
                  </TableCell>
                  {/* Ingredient quantity input */}
                  <TableCell>
                    <FormField
                        name={`ingredients.${index}.quantity`}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder={'Quantity'} {...field}/>
                              </FormControl>
                            </FormItem>
                        )}
                    />
                  </TableCell>
                  {/* Button to delete a row with an ingredient */}
                  <TableCell className={'m-0 p-0'}>
                    <Button type={'button'} className={'bg-transparent hover:bg-destructive'} onClick={() => removeIngredient(index)}>
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
          {/* Button to add a row with a new ingredient */}
          <TableCaption>
            <Button type={'button'} onClick={() => append({name: '', quantity: ''})}>+</Button>
          </TableCaption>
        </Table>
      </>
  )
}