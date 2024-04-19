import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {TSearchFormFilter} from "@/types/TSearchFormFilter.ts";

// interface FormValues {
//   searchTerm: string,
//   dietItems: string[],
//   cuisineItems: string[]
// }

type SearchFormFilterProps = {
  title: string
  name: string
  items: Array<TSearchFormFilter>
  form: any
}

// Search form filter, consists of a button that opens a popover with a list of checkboxes
export function SearchFormFilter({title, name, items, form}: SearchFormFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'}>{title}</Button>
      </PopoverTrigger>
      <PopoverContent className={'w-auto pr-6'}>
        <FormField
            control={form.control}
            name={name}
            render={() => (
                <FormItem>
                  {items.map((item) => (
                      <FormField
                          key={item.id}
                          control={form.control}
                          name={name}
                          render={({field}) => {
                            return (
                                <FormItem key={item.id} className={'flex items-center space-x-3 space-y-0'}>
                                  <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                              ? field.onChange([...field.value, item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                      (value: never) => value !== item.id
                                                  )
                                              )
                                        }}
                                    />
                                  </FormControl>
                                  <FormLabel className={'text-base'}>
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                            )
                          }}
                      />
                  ))}
                </FormItem>
            )}
        />
      </PopoverContent>
    </Popover>
  )
}