"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Language } from "../types";
import { useLanguageForm } from "../_hooks/use-language-form";
import { Form } from "@/components/ui/form";
import ControlledInput from "@/components/molecules/controlled-input";
import ControlledCheckboxGroup from "@/components/molecules/controlled-checkbox";

export function LanguageFormModal({
  defaultValues,
}: {
  defaultValues?: Language;
}) {
  const { open, setOpen, form, isSubmitting, onSubmit } = useLanguageForm();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues?._id ? "Edit Language" : "Add New Language"}
          </DialogTitle>
          <DialogDescription>
            {defaultValues?._id
              ? "Update language information"
              : "Add a new language for annotation support"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <ControlledInput
            name="name"
            label="Language Name"
            description="Full name of the language (e.g., English)"
          />
          <ControlledInput
            name="code"
            label="Language Code"
            description="ISO 639-1 language code (2-3 characters)"
          />
          <ControlledInput
            name="native_name"
            label="Native Name"
            description="How the language is written in its own script"
          />
          <ControlledCheckboxGroup
            options={[
              {
                label: "Available for selection",
                value: true,
              },
            ]}
            name="isActive"
            label="Status"
            mode="single"
          />
          <Button
            loading={isSubmitting}
            className="mt-2"
            onClick={() => onSubmit()}
          >
            Create Language
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
