"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { annotateSentence, getBiasCategories } from "../services";
import {
  AnnotateSentenceSchema,
  annotateSentenceSchema,
  SentenceSchema,
} from "../types";
import { zodResolver } from "@hookform/resolvers/zod";

type AnnotateSentenceModalProps = {
  sentence: SentenceSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AnnotateSentenceModal({
  sentence,
  open,
  onOpenChange,
}: AnnotateSentenceModalProps) {
  const [biasCategories, setBiasCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AnnotateSentenceSchema>({
    resolver: zodResolver(annotateSentenceSchema),
  });

  // Fetch bias categories when modal opens
  useEffect(() => {
    if (open) {
      getBiasCategories().then(setBiasCategories);
    }
  }, [open]);

  const onSubmit = async (data: AnnotateSentenceSchema) => {
    if (!sentence) return;

    setIsLoading(true);
    try {
      const result = await annotateSentence(sentence._id, data.bias_category);
      if (result.error) {
        toast.error(
          result.message.map((each: string) => {
            return each;
          }) ||
            result.error ||
            "Failed to annotate sentence"
        );
        setIsLoading(false);
        return;
      }
      toast.success("Sentence annotated successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Annotate Sentence</DialogTitle>
          <DialogDescription>
            Select the appropriate bias category for this sentence.
          </DialogDescription>
        </DialogHeader>

        {sentence && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 my-4">
            <p className="text-sm font-medium text-slate-900 mb-2">Sentence:</p>
            <p className="text-sm text-slate-700">{sentence.sentence}</p>
            {sentence.original_content && (
              <>
                <p className="text-sm font-medium text-slate-900 mt-3 mb-2">
                  Original Content:
                </p>
                <p className="text-sm text-slate-700">
                  {sentence.original_content}
                </p>
              </>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bias_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bias Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a bias category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {biasCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Annotation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
