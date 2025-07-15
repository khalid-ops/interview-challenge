import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export default function MultiSelectCombobox({
  options,
  selected,
  onSelectionChange,
  placeholder,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter((item) => item !== value))
    } else {
      onSelectionChange([...selected, value])
    }
  }

  const handleRemove = (value: string) => {
    onSelectionChange(selected.filter((item) => item !== value))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {selected.length > 0 ? `${selected.length} selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value)
            return (
              <Badge key={value} variant="secondary" className="text-xs">
                {option?.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRemove(value)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleRemove(value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}