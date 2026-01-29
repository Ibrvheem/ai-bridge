"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import { annotateSentence } from "../services";
import {
  AnnotateSentenceSchema,
  annotateSentenceSchema,
  DataCollection,
  TargetGender,
  BiasLabel,
  Explicitness,
  StereotypeCategory,
  SentimentTowardReferent,
  Device,
} from "../types";
import { zodResolver } from "@hookform/resolvers/zod";

type AnnotateSentenceModalProps = {
  sentence: DataCollection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const targetGenderOptions = [
  { value: TargetGender.FEMALE, label: "Female" },
  { value: TargetGender.MALE, label: "Male" },
  { value: TargetGender.NEUTRAL, label: "Neutral" },
  { value: TargetGender.MIXED, label: "Mixed" },
  { value: TargetGender.NONBINARY, label: "Non-binary" },
  { value: TargetGender.UNKNOWN, label: "Unknown" },
];

const biasLabelOptions = [
  { value: BiasLabel.STEREOTYPE, label: "Stereotype" },
  { value: BiasLabel.COUNTER_STEREOTYPE, label: "Counter-stereotype" },
  { value: BiasLabel.NEUTRAL, label: "Neutral" },
  { value: BiasLabel.DEROGATION, label: "Derogation" },
];

const explicitnessOptions = [
  { value: Explicitness.EXPLICIT, label: "Explicit" },
  { value: Explicitness.IMPLICIT, label: "Implicit" },
];

const stereotypeCategoryOptions = [
  { value: StereotypeCategory.PROFESSION, label: "Profession" },
  { value: StereotypeCategory.FAMILY_ROLE, label: "Family Role" },
  { value: StereotypeCategory.LEADERSHIP, label: "Leadership" },
  { value: StereotypeCategory.EDUCATION, label: "Education" },
  { value: StereotypeCategory.RELIGION_CULTURE, label: "Religion/Culture" },
  { value: StereotypeCategory.PROVERB_IDIOM, label: "Proverb/Idiom" },
  { value: StereotypeCategory.DAILY_LIFE, label: "Daily Life" },
  { value: StereotypeCategory.APPEARANCE, label: "Appearance" },
  { value: StereotypeCategory.CAPABILITY, label: "Capability" },
];

const sentimentOptions = [
  { value: SentimentTowardReferent.POSITIVE, label: "Positive" },
  { value: SentimentTowardReferent.NEUTRAL, label: "Neutral" },
  { value: SentimentTowardReferent.NEGATIVE, label: "Negative" },
];

const deviceOptions = [
  { value: Device.METAPHOR, label: "Metaphor" },
  { value: Device.PROVERB, label: "Proverb" },
  { value: Device.SARCASM, label: "Sarcasm" },
  { value: Device.QUESTION, label: "Question" },
  { value: Device.DIRECTIVE, label: "Directive" },
  { value: Device.NARRATIVE, label: "Narrative" },
];

export function AnnotateSentenceModal({
  sentence,
  open,
  onOpenChange,
}: AnnotateSentenceModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AnnotateSentenceSchema>({
    resolver: zodResolver(annotateSentenceSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: AnnotateSentenceSchema) => {
    if (!sentence) return;

    setIsLoading(true);
    try {
      const result = await annotateSentence(sentence._id, data);
      if (result.error) {
        const errorMessage = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.error || "Failed to annotate sentence";
        toast.error(errorMessage);
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Annotate Sentence</DialogTitle>
          <DialogDescription>
            Provide bias annotation labels for this data collection entry.
          </DialogDescription>
        </DialogHeader>

        {sentence && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 my-4">
            <p className="text-sm font-medium text-slate-900 mb-2">Text:</p>
            <p className="text-sm text-slate-700">{sentence.text}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-slate-600">Language:</span>{" "}
                {sentence.language}
              </div>
              <div>
                <span className="font-medium text-slate-600">Domain:</span>{" "}
                {sentence.domain}
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target_gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {targetGenderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bias_label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bias Label *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bias label" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {biasLabelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="explicitness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explicitness *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select explicitness" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {explicitnessOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stereotype_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stereotype Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stereotypeCategoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sentiment_toward_referent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sentiment Toward Referent</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sentiment (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sentimentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {deviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this annotation..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
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
