import {Button} from "@/components/ui/button.tsx";
import {Plus, Trash2} from "lucide-react";
import {useFieldArray} from "react-hook-form";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {TStep} from "@/types/TStep.ts";

type StepsTableProps = {
  form: any
}

// Part of a CreateRecipeForm component, for adding steps dynamically
export function StepsDynamicList({form}: StepsTableProps) {
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

  // returns true if step instruction is empty
  function isEmptyStep(step: TStep): boolean {
    return !step.instruction
  }

  // returns index of first empty step after the current step or -1 if such not found
  function getNextEmptyStepIndex(stepFields: TStep[], currentIndex: number): number {
    for(let index = currentIndex + 1; index < stepFields.length; index++) {
      if(isEmptyStep(stepFields[index])) {
        return index
      }
    }

    return -1
  }

  // Add new step row when Enter is pressed inside textarea
  function handleKeyDown(e: any, currentRowIndex: number) {
    if(e.key == 'Enter') {
      const stepFields = form.watch('steps')
      const nextEmptyRowIndex: number = getNextEmptyStepIndex(stepFields, currentRowIndex)

      // set focus on next empty step if found
      if(nextEmptyRowIndex >= 0) {
        form.setFocus(`steps.${nextEmptyRowIndex}.instruction`, {shouldSelect: true})
      }
      // else add a new step
      else {
        append({instruction: ''})
      }

      // prevent form from submitting after clicking Enter
      e.preventDefault()
    }
  }

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
                            <Textarea {...field}
                              placeholder={index == 0 ? 'Mix the yeast with the water...' : ''}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              className={'h-16 min-h-16'}/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                  />
                </div>
                {/* Button to delete a row with a step */}
                <div>
                  <Button type={'button'} className={'bg-transparent hover:bg-destructive'} onClick={() => removeStep(index)}>
                    <Trash2 color={'black'}/>
                  </Button>
                </div>
              </div>
          ))}
        </div>
        {/* Button to add a row with a new step */}
        <div className={'flex justify-center mt-2'}>
          <Button type={'button'} onClick={() => append({instruction: ''})}>
            <Plus/>
          </Button>
        </div>
      </div>
  )
}