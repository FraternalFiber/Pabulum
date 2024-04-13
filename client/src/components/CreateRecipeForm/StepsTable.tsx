import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Button} from "@/components/ui/button.tsx";
import {XCircle} from "lucide-react";
import {useFieldArray} from "react-hook-form";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

type StepsTableProps = {
  form: any
}

// Part of a CreateRecipeForm component, for adding steps dynamically
export function StepsTable({form}: StepsTableProps) {
  // Every step is added to a steps array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'steps'
  })

  return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={'text-black'}>Steps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((item, index) => (
              <TableRow key={item.id}>
                {/* Ingredient name input */}
                <TableCell>
                  <div className={'text-2xl w-'}>{index + 1}</div>
                </TableCell>
                <TableCell>
                  <FormField
                    name={`steps.${index}.instruction`}
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field}/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                  />
                  {/*<FormField*/}
                  {/*  name={`steps.${index}.number`}*/}
                  {/*  control={form.control}*/}
                  {/*  render={({field}) => (*/}
                  {/*      <FormItem>*/}
                  {/*        <FormControl>*/}
                  {/*          <Input type={'number'} {...field} value={index+1}/>*/}
                  {/*        </FormControl>*/}
                  {/*        <FormMessage/>*/}
                  {/*      </FormItem>*/}
                  {/*  )}*/}
                  {/*/>*/}
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