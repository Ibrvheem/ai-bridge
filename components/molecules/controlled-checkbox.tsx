/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReactNode } from "react";
import { Checkbox } from "../ui/checkbox";

// Type for checkbox options
type CheckboxOption = {
  label: string;
  value: any;
};

// Props interface
interface ControlledCheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  label?: ReactNode;
  description?: string;
  className?: string;
  optional?: boolean;
  disabled?: boolean;
  mode?: "single" | "multiple"; // Add mode to handle different behaviors
}

export default function ControlledCheckboxGroup({
  name,
  options,
  label,
  description,
  className,
  optional,
  disabled = false,
  mode = "multiple", // Default to multiple for backward compatibility
}: ControlledCheckboxGroupProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>
            {label} {optional && <span className="text-xs">(optional)</span>}
          </FormLabel>
          <FormControl>
            <div className={`flex flex-col gap-4 ${className}`}>
              {options.map((option) => (
                <FormItem
                  key={String(option.value)}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={
                        mode === "single"
                          ? field.value === option.value || field.value === true
                          : Array.isArray(field?.value) &&
                            field.value.includes(option.value)
                      }
                      onCheckedChange={(checked) => {
                        if (mode === "single") {
                          // For single mode (like isActive boolean)
                          field.onChange(checked ? option.value : false);
                        } else {
                          // For multiple mode (array of values)
                          const currentValue = Array.isArray(field.value)
                            ? field.value
                            : [];
                          const newValue = checked
                            ? [...currentValue, option.value]
                            : currentValue.filter(
                                (val) => val !== option.value
                              );
                          field.onChange(newValue);
                        }
                      }}
                      disabled={disabled}
                      className="!h-5 !w-5"
                    />
                  </FormControl>
                  <span className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {option.label}
                  </span>
                </FormItem>
              ))}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
