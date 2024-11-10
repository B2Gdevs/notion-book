"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Command } from "cmdk";
import { Badge } from "./ui/badge";
import { cn } from "..";

export interface SelectableItem {
  id: string;
  displayText: string;
}

interface FancyMultiSelectProps {
  items: SelectableItem[];
  selectedItems?: SelectableItem[];
  className?: string;
  placeholder?: string;
  onItemSelect?: (item: SelectableItem) => void;  
  onItemRemove?: (item: SelectableItem) => void;  
  onCreate?: (inputValue: string) => void;
}

export function FancyMultiSelect({
  items,
  selectedItems = [],
  className,
  placeholder = "Select items...",
  onItemSelect,
  onItemRemove,
  onCreate
}: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SelectableItem[]>(selectedItems);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    setSelected(selectedItems);
  }, [selectedItems]);

  const handleUnselect = React.useCallback((item: SelectableItem) => {
    const newSelected = selected.filter((s) => s.id !== item.id);
    setSelected(newSelected);
    if (onItemRemove) {
      onItemRemove(item);
    }
  }, [selected, onItemRemove]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (event.key === "Delete" || event.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...selected];
            newSelected.pop();
            setSelected(newSelected);
            if (onItemRemove && newSelected.length < selected.length) {
              onItemRemove(selected[selected.length - 1]);
            }
          }
        } else if (event.key === "Escape") {
          input.blur();
        } else if (event.key === "Enter" && onCreate && inputValue.trim() !== "" && !selected.some(s => s.displayText === inputValue)) {
          onCreate(inputValue.trim());
          setInputValue("");
        }
      }
    },
    [selected, onItemRemove, onCreate, inputValue]
  );

  const selectables = items.filter(
    (item) => !selected.find((s) => s.id === item.id)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={cn("overflow-visible bg-transparent", className)}
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <Badge key={item.id} variant="secondary">
              {item.displayText}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleUnselect(item);
                  }
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={() => handleUnselect(item)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <Command.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <Command.List>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <Command.Group className="h-full overflow-auto">
                {selectables.map((item) => (
                  <Command.Item
                    key={item.id}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      setSelected((prev) => [...prev, item]);
                      if (onItemSelect) {
                        onItemSelect(item);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {item.displayText}
                  </Command.Item>
                ))}
              </Command.Group>
            </div>
          ) : null}
        </Command.List>
      </div>
    </Command>
  );
}