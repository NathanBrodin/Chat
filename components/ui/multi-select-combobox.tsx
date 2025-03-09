"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useEffect, useState } from "react"

export type Item = {
  value: string
  label: string
}

export interface MultiSelectComboboxProps {
  items: Item[]
  emptyMessage?: string
  searchPlaceholder?: string
  onChange?: (values: Item[]) => void
  value?: Item[]
  defaultValue?: Item[]
}

export function MultiSelectCombobox({
  items,
  emptyMessage = "No item found.",
  searchPlaceholder = "Search items...",
  onChange,
  value,
  defaultValue = [],
}: MultiSelectComboboxProps) {
  const [selectedValues, setSelectedValues] = useState<Item[]>(value || defaultValue)

  // Update internal state when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value)
    }
  }, [value])

  const handleSelect = (itemValue: Item) => {
    const newValues = selectedValues.includes(itemValue)
      ? selectedValues.filter((item) => item !== itemValue)
      : [...selectedValues, itemValue]

    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  return (
    <Command className="w-72">
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem key={item.value} value={item.label} onSelect={() => handleSelect(item)}>
              <Check className={cn("mr-2 h-4 w-4", selectedValues.includes(item) ? "opacity-100" : "opacity-0")} />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
