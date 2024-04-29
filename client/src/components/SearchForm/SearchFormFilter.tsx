import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {TSearchFormFilter} from "@/types/TSearchFormFilter.ts";
import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.tsx";
import {cn} from "@/lib/utils.ts";

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

type FilterBadgeProps = {
  optionsNumber: number
}

// Badge that shows a number of selected filters (unless it equals 0)
function FilterBadge({optionsNumber}: FilterBadgeProps) {
  if(optionsNumber > 0) {
    return (
        <>
          <Badge className={'absolute -top-2 -right-2 pr-2 pl-2 hover:bg-primary'}>{optionsNumber}</Badge>
        </>
    )
  }

  return <></>
}

// Search form filter, consists of a button that opens a popover with a list of checkboxes
export function SearchFormFilter({title, name, items, form}: SearchFormFilterProps) {
  const [filterChecked, setFilterChecked] = useState<boolean>(false)
  const watchFilter = form.watch(name)

  // change the filter button appearance when any checkboxes inside checked (badge with number later)
  useEffect(() => {
    if(watchFilter.length > 0) {
      setFilterChecked(true)
    }
    else {
      setFilterChecked(false)
    }
  }, [watchFilter]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className={cn('relative', filterChecked ? 'border-primary' : '')}>
          {title}
          <FilterBadge optionsNumber={watchFilter.length}/>
        </Button>
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