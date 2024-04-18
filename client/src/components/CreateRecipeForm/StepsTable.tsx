import {Button} from "@/components/ui/button.tsx";
import {Trash2} from "lucide-react";
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

  function removeStep(index: number) {
    remove(index)

    // add a blank row if the last one has been removed
    if(fields.length == 1) {
      append({instruction: ''})
    }
  }

  // return (
  //     <Table>
  //       <TableHeader>
  //         <TableRow>
  //           <TableHead className={'text-black'}>Steps</TableHead>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>
  //         {fields.map((item, index) => (
  //             <TableRow key={item.id}>
  //               {/* Ingredient name input */}
  //               <TableCell>
  //                 <div className={'text-2xl w-'}>{index + 1}</div>
  //               </TableCell>
  //               <TableCell>
  //                 <FormField
  //                   name={`steps.${index}.instruction`}
  //                   control={form.control}
  //                   render={({field}) => (
  //                       <FormItem>
  //                         <FormControl>
  //                           <Textarea {...field}/>
  //                         </FormControl>
  //                         <FormMessage/>
  //                       </FormItem>
  //                   )}
  //                 />
  //                 {/*<FormField*/}
  //                 {/*  name={`steps.${index}.number`}*/}
  //                 {/*  control={form.control}*/}
  //                 {/*  render={({field}) => (*/}
  //                 {/*      <FormItem>*/}
  //                 {/*        <FormControl>*/}
  //                 {/*          <Input type={'number'} {...field} value={index+1}/>*/}
  //                 {/*        </FormControl>*/}
  //                 {/*        <FormMessage/>*/}
  //                 {/*      </FormItem>*/}
  //                 {/*  )}*/}
  //                 {/*/>*/}
  //               </TableCell>
  //               {/* Button to delete a row with a step */}
  //               <TableCell>
  //                 <Button type={'button'} className={'bg-transparent hover:bg-destructive'} onClick={() => removeStep(index)}>
  //                   <XCircle />
  //                 </Button>
  //               </TableCell>
  //             </TableRow>
  //         ))}
  //       </TableBody>
  //       {/* Button to add a row with a new step */}
  //       <TableCaption>
  //         <Button type={'button'} onClick={() => append({name: '', quantity: ''})}>+</Button>
  //       </TableCaption>
  //     </Table>
  // )


  return (
      <div className={'flex flex-col mt-5 gap-y-6'}>
        <div className={'text-2xl font-semibold'}>Steps</div>
        <div className={'flex flex-col gap-y-6'}>
          {fields.map((item, index) => (
              <div key={item.id} className={'grid grid-cols-[auto_1fr_auto] pl-0 sm:pl-3'}>
                {/* Step number */}
                <div>
                  <div className={'text-2xl w-'}>{index + 1}</div>
                </div>
                {/* Step instruction */}
                <div className={'ml-5 sm:ml-6 mr-2'}>
                  <FormField
                    name={`steps.${index}.instruction`}
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} placeholder={index == 0 ? 'Mix the yeast with the water...' : ''}/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                  />
                </div>
                {/* Button to delete a row with a step */}
                <div>
                  <Button type={'button'} className={'bg-transparent hover:bg-destructive'} onClick={() => removeStep(index)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
          ))}
        </div>
        {/* Button to add a row with a new step */}
        <div className={'flex justify-center mt-2'}>
          <Button type={'button'} onClick={() => append({name: '', quantity: ''})}>+</Button>
        </div>
      </div>
  )
}