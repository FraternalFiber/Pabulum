import {useEffect, useRef, useState} from "react";
import {ChevronsUpDown} from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Command, CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {TSearchFormFilterItem} from "@/types/TSearchFormFilterItem.ts";
import { Badge } from "@/components/ui/badge.tsx";

type SearchFormFilterNewProps = {
  title: string
  fieldName: string
  items: Array<TSearchFormFilterItem>
  form: any
}

type FilterBadgeProps = {
  value: number
}

// Badge that shows a number of selected filters (unless it equals 0)
function FilterBadge({value}: FilterBadgeProps) {
  if(value > 0) {
    return (
      <>
        {/*<Badge className={'absolute -top-2 -right-2 pr-2 pl-2 hover:bg-primary text-md font-bold'}>{value}</Badge>*/}
        <div className={'absolute -top-2 -right-2 bg-primary p-0.5 pl-2 pr-2 rounded-full font-bold'}>{value}</div>
      </>
    )
  }

  return <></>
}

// Multiple select box, via: https://craft.mxkaske.dev/post/fancy-box
export function SearchFormFilterNew({title, fieldName, items, form}: SearchFormFilterNewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<Array<TSearchFormFilterItem>>([]);

  // Set default value on load
  useEffect(() => {
    setSelectedValues(items.filter((item) => form.getValues(fieldName).includes(item.value)))
  }, []);

  // Set form field value when selectedValues changed
  useEffect(() => {
    form.setValue(fieldName, selectedValues.map((item) => item.value))
  }, [selectedValues]);

  // Toggle item in selected values list
  const toggleItem = (item: TSearchFormFilterItem) => {
    setSelectedValues((currentItems) =>
      !currentItems.includes(item)
        ? [...currentItems, item]
        : currentItems.filter((l) => l.value !== item.value)
    );
    inputRef?.current?.focus();
  };

  const onComboboxOpenChange = (value: boolean) => {
    // inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
    setOpenCombobox(value);
  };

  return (
    <div className="max-w-[200px]">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className={cn("relative w-44 justify-between text-foreground", selectedValues.length > 0 ? 'border-primary ' : '')}
          >
            <span className="truncate">
              {/*{selectedValues.length === 0 && title}*/}
              {/*{selectedValues.length === 1 && selectedValues[0].label}*/}
              {/*{selectedValues.length === 2 &&*/}
              {/*  selectedValues.map(({ label }) => label).join(", ")}*/}
              {/*{selectedValues.length > 2 &&*/}
              {/*  `${selectedValues.length} ${title.toLowerCase()}s`}*/}
              {title}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            {/*Items selected indicator*/}
            <FilterBadge value={selectedValues.length}/>
            {/*<div className={cn('-top-2 -right-2 bg-primary pl-1.5 pr-1.5 rounded-full', selectedValues.length > 0 ? 'absolute' : 'hidden')}>{selectedValues.length}</div>*/}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search items..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandGroup className="max-h-[min(calc(var(--radix-popover-content-available-height)-3rem),15rem)] overflow-auto">
              {items.map((item) => {
                const isActive = selectedValues.includes(item);

                return (
                  <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => toggleItem(item)}
                      className={'hover:cursor-pointer flex gap-x-3 pl-3'}>
                    <Checkbox checked={isActive}/>
                    <div className="text-base">{item.label}</div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandEmpty className={'p-2 text-center text-sm'}>No results</CommandEmpty>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}