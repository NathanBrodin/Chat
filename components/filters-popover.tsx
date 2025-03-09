import { Check, SlidersHorizontalIcon, XIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useEffect, useState } from "react"
import { Item, MultiSelectCombobox } from "./ui/multi-select-combobox"
import { Badge } from "./ui/badge"
import { AnimatePresence, motion } from "motion/react"
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command"
import { cn } from "@/lib/utils"

// Country data
const countries = [
  { value: "AR", label: "Argentina" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "BD", label: "Bangladesh" },
  { value: "BA", label: "Bosnia and Herzegovina" },
  { value: "BR", label: "Brazil" },
  { value: "BG", label: "Bulgaria" },
  { value: "CM", label: "Cameroon" },
  { value: "CA", label: "Canada" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "People's Republic of China" },
  { value: "CZ", label: "Czech Republic" },
  { value: "DK", label: "Denmark" },
  { value: "EG", label: "Egypt" },
  { value: "ET", label: "Ethiopia" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "HK", label: "Hong Kong" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IE", label: "Ireland" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JP", label: "Japan" },
  { value: "XK", label: "Kosovo" },
  { value: "LV", label: "Latvia" },
  { value: "LB", label: "Lebanon" },
  { value: "MG", label: "Madagascar" },
  { value: "MY", label: "Malaysia" },
  { value: "MX", label: "Mexico" },
  { value: "MD", label: "Moldova, Republic of" },
  { value: "NL", label: "Netherlands" },
  { value: "NP", label: "Nepal" },
  { value: "NZ", label: "New Zealand" },
  { value: "NG", label: "Nigeria" },
  { value: "NO", label: "Norway" },
  { value: "PK", label: "Pakistan" },
  { value: "PA", label: "Panama" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russian Federation" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "RS", label: "Serbia" },
  { value: "SG", label: "Singapore" },
  { value: "SI", label: "Slovenia" },
  { value: "KR", label: "South Korea" },
  { value: "ES", label: "Spain" },
  { value: "LK", label: "Sri Lanka" },
  { value: "SR", label: "Suriname" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "TW", label: "Taiwan" },
  { value: "TH", label: "Thailand" },
  { value: "TN", label: "Tunisia" },
  { value: "TR", label: "Türkiye" },
  { value: "UA", label: "Ukraine" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States of America" },
  { value: "UZ", label: "Uzbekistan" },
  { value: "VN", label: "Vietnam" },
]

// Date range options
const dateRanges = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this-week", label: "This Week" },
  { value: "last-week", label: "Last Week" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "this-year", label: "This Year" },
  { value: "last-year", label: "Last Year" },
]

export type Filters = {
  countries: Item[]
  dateRange: Item | null
}

interface FiltersPopoverProps {
  filters: Filters
  onApplyFilters: (filters: Filters) => void
}

export function FiltersPopover({ filters, onApplyFilters }: FiltersPopoverProps) {
  const [open, setOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<Filters>({
    countries: filters.countries,
    dateRange: filters.dateRange,
  })

  // Update temp filters when selected filters change (for synchronization)
  useEffect(() => {
    setTempFilters({
      countries: filters.countries,
      dateRange: filters.dateRange,
    })
  }, [filters])

  function handleCountriesSelect(items: Item[]) {
    setTempFilters((prev) => ({
      ...prev,
      countries: items,
    }))
  }

  function handleRemoveCountry(value: string) {
    setTempFilters((prev) => ({
      ...prev,
      countries: prev.countries.filter((country) => country.value !== value),
    }))
  }

  function handleRemoveDateRange() {
    setTempFilters((prev) => ({
      ...prev,
      dateRange: null,
    }))
  }

  function handleRangeSelect(value: string) {
    const selectedRange = dateRanges.find((range) => range.value === value)

    if (selectedRange) {
      setTempFilters((prev) => {
        // If the same range is clicked again, deselect it
        if (prev?.dateRange?.value === value) {
          return {
            ...prev,
            dateRange: null,
          }
        }
        // Otherwise select the new range
        return {
          ...prev,
          dateRange: selectedRange,
        }
      })
    }
  }

  function clearAll() {
    setTempFilters({
      countries: [],
      dateRange: null,
    })
  }

  function handleApplyFilters() {
    // Update parent state with temp filters
    onApplyFilters(tempFilters)
    // Close the popover
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <span className="px-2">Filters</span> <SlidersHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-fit max-w-xl flex-col gap-4">
        <div className="flex min-h-[22px] flex-wrap gap-1">
          <AnimatePresence>
            {!tempFilters.dateRange && !tempFilters.countries.length && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                No filters selected
              </Badge>
            )}
            {tempFilters.countries.map((country) => (
              <motion.div
                layout
                key={country.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  {country.label}
                  <XIcon className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveCountry(country.value)} />
                </Badge>
              </motion.div>
            ))}
            {tempFilters.dateRange && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  {tempFilters.dateRange.label}
                  <XIcon className="h-3 w-3 cursor-pointer" onClick={handleRemoveDateRange} />
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col rounded border">
            <h4 className="border-b px-4 py-2 text-sm font-medium">Countries</h4>
            <MultiSelectCombobox
              items={countries}
              searchPlaceholder="Search countries..."
              value={tempFilters.countries}
              onChange={handleCountriesSelect}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="rounded border pb-1">
              <h4 className="border-b px-4 py-2 text-sm font-medium">Date Range</h4>
              <Command className="relative h-fit rounded-none border-none">
                <CommandList>
                  <CommandGroup>
                    {dateRanges.map((item) => (
                      <CommandItem key={item.value} value={item.value} onSelect={handleRangeSelect}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            tempFilters.dateRange?.value === item.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
