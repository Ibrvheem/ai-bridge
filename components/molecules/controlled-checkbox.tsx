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

export default function ControlledCheckboxGroup({
  name,
  options,
  label,
  description,
  className,
  optional,
  disabled = false,
}: {
  name: string;
  options: { label: string; value: string }[];
  label?: ReactNode;
  description?: string;
  className?: string;
  optional?: boolean;
  disabled?: boolean;
}) {
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
                  key={option.value}
                  className="flex items-center space-x-0 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      value={option.value}
                      checked={
                        Array.isArray(field?.value) &&
                        field.value.includes(option.value)
                      }
                      onCheckedChange={(checked) => {
                        const currentValue = Array.isArray(field.value)
                          ? field.value
                          : [];
                        const newValue = checked
                          ? [...currentValue, option.value]
                          : currentValue.filter(
                              (val: string) => val !== option.value
                            );
                        field.onChange(newValue);
                      }}
                      disabled={disabled}
                      className="!h-5 !w-5 space-y-0"
                    />
                  </FormControl>
                  <span className="text-sm text-black/70">{option.label}</span>
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
