"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileDropzone, FileDropzoneProps } from "./file-dropzone";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface ControlledFileDropzoneProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<FileDropzoneProps, "file" | "onFileSelect" | "label"> {
  name: TName;
  control?: Control<TFieldValues>;
  label?: string;
  description?: string;
  optional?: boolean;
}

export function ControlledFileDropzone<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  description,
  optional,
  ...dropzoneProps
}: ControlledFileDropzoneProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {optional && (
                <span className="text-muted-foreground"> (optional)</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <FileDropzone
              file={field.value || null}
              onFileSelect={field.onChange}
              {...dropzoneProps}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
