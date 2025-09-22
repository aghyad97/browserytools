"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FREE_FONTS, ALL_FONTS } from "@/constants/fonts";

interface FontPickerProps {
  onChange?: (font: string) => void;
  value?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  showFilters?: boolean;
}

export function FontPicker({
  onChange,
  value,
  width = "auto",
  height = "auto",
  className,
  showFilters = false,
}: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
          style={{ width: typeof width === "number" ? `${width}px` : width }}
        >
          {value ? value : "Select font family"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
        }}
      >
        <Command>
          <CommandInput placeholder="Search font family..." className="h-9" />
          <CommandList>
            <CommandEmpty>No font family found.</CommandEmpty>
            <CommandGroup heading="Free Fonts">
              {FREE_FONTS.map((font) => (
                <CommandItem
                  value={font}
                  key={font}
                  onSelect={() => {
                    onChange?.(font);
                    setIsOpen(false);
                  }}
                  className="hover:cursor-pointer"
                  style={{ fontFamily: font }}
                >
                  {font}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      font === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="All Fonts">
              {ALL_FONTS.filter((f) => !FREE_FONTS.includes(f)).map((font) => (
                <CommandItem
                  value={font}
                  key={font}
                  onSelect={() => {
                    onChange?.(font);
                    setIsOpen(false);
                  }}
                  className="hover:cursor-pointer"
                  style={{ fontFamily: font }}
                >
                  {font}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      font === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
