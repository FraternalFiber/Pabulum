import { Button } from "@/components/ui/button.tsx";
import { Minus } from "lucide-react";

type SubtractButtonProps = {
  form: any;
  fieldName: "prepTime" | "servingsNumber";
  step?: number;
  minValue?: number;
};

// Button to decrease the number of minutes or portions
export function SubtractButton({ form, fieldName, step = 1, minValue = 0 }: SubtractButtonProps) {
  function subtract() {
    const oldValue = Number(form.getValues(fieldName));

    // Subtract value only if input contains a number and it won't exceed the minimum value
    if (!isNaN(oldValue) && oldValue > minValue) {
      const remainder = oldValue % step;
      let newValue: number;

      // If oldValue is indivisible by step -> set newValue to oldValue rounded down to nearest multiple of step
      // (e.g. 32 -> 30, not 27 if step is 5)
      if (remainder != 0) {
        newValue = oldValue - remainder;
      } else {
        newValue = oldValue - step;
      }

      if (newValue < minValue) {
        newValue = minValue;
      }

      form.setValue(fieldName, newValue);
    }
  }

  return (
    <Button type={"button"} className={"h-9 p-2 rounded-full"} onClick={subtract}>
      <Minus size={20} />
    </Button>
  );
}
