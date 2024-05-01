import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";

type AddButtonProps = {
  form: any
  fieldName: 'prepTime' | 'servingsNumber'
  step?: number
  maxValue?: number
}

// Button to increase the number of minutes or portions
export function AddButton({form, fieldName, step = 1, maxValue}: AddButtonProps) {
  function add() {
    const oldValue = Number(form.getValues(fieldName))

    // add value only if input contains a number
    // check if oldValue is less than maxValue only if maxValue is set
    if(!isNaN(oldValue) && (!maxValue || oldValue < maxValue)) {
      const remainder = oldValue % step
      let newValue: number

      // if oldValue is indivisible by step -> set newValue to oldValue rounded up to the nearest multiple of step
      // (e.g. 41 -> 44, not 46 if step is 5)
      if(remainder != 0) {
        newValue = oldValue + step - remainder
      }
      else {
        newValue = oldValue + step
      }

      // check if newValue is greater than maxValue only if maxValue is set
      if(maxValue && newValue > maxValue) {
        newValue = maxValue
      }

      form.setValue(fieldName, newValue)
    }
  }

  return (
      <Button type={'button'} className={'h-9 p-2 rounded-full'} onClick={add}>
        <Plus size={20}/>
      </Button>
  )
}