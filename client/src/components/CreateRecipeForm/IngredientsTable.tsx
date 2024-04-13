import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Button} from "@/components/ui/button.tsx";
import {XCircle} from "lucide-react";
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

  return (
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
                {/* Button for deleting a row */}
                <TableCell>
                  <Button type={'button'} className={'bg-transparent hover:bg-destructive'} onClick={() => remove(index)}>
                    <XCircle />
                  </Button>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
        {/* Button for adding rows */}
        <TableCaption>
          <Button type={'button'} onClick={() => append({name: '', quantity: ''})}>+</Button>
        </TableCaption>
      </Table>
  )
}