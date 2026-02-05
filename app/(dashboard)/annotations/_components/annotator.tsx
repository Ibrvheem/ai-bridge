"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  SkipForward,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { annotateSentence } from "../services";

interface AnnotatorProps {
  sentences: DataCollection[];
  onAnnotationComplete?: () => void;
}

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

export function Annotator({ sentences, onAnnotationComplete }: AnnotatorProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [annotationStartTime, setAnnotationStartTime] = useState<number>(
    Date.now(),
  );
  const [sessionStartTime] = useState<number>(Date.now());

  const currentSentence = sentences[currentIndex] || null;
  const totalSentences = sentences.length;

  // Time tracking
  const elapsedSeconds = useRef(0);
  const [displayTime, setDisplayTime] = useState("0:00");

  useEffect(() => {
    const interval = setInterval(() => {
      elapsedSeconds.current = Math.floor(
        (Date.now() - sessionStartTime) / 1000,
      );
      const minutes = Math.floor(elapsedSeconds.current / 60);
      const seconds = elapsedSeconds.current % 60;
      setDisplayTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const form = useForm<AnnotateSentenceSchema>({
    resolver: zodResolver(annotateSentenceSchema),
    defaultValues: {},
  });

  // Reset form and timer when switching sentences
  useEffect(() => {
    form.reset({
      target_gender: undefined,
      bias_label: undefined,
      explicitness: undefined,
      stereotype_category: undefined,
      sentiment_toward_referent: undefined,
      device: undefined,
      notes: "",
    });
    setAnnotationStartTime(Date.now());
  }, [currentIndex, form]);

  const handleNext = () => {
    if (currentIndex < totalSentences - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const onSubmit = async (data: AnnotateSentenceSchema) => {
    if (!currentSentence) return;

    setIsSubmitting(true);
    try {
      // Calculate annotation time
      const annotationTimeSeconds = Math.floor(
        (Date.now() - annotationStartTime) / 1000,
      );

      // Add timing info to annotation
      const annotationData = {
        ...data,
        annotation_time_seconds: annotationTimeSeconds,
      };

      // Annotate the sentence
      const result = await annotateSentence(
        currentSentence._id,
        annotationData,
      );
      if (result.error) {
        const errorMessage = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.error || "Failed to annotate sentence";
        toast.error(errorMessage);
        setIsSubmitting(false);
        return;
      }

      toast.success("Sentence annotated!");

      // Reset form
      form.reset({
        target_gender: undefined,
        bias_label: undefined,
        explicitness: undefined,
        stereotype_category: undefined,
        sentiment_toward_referent: undefined,
        device: undefined,
        notes: "",
      });

      // Refresh data from server to get updated state
      router.refresh();

      // Check if this was the last sentence
      if (totalSentences <= 1) {
        toast.success("You've annotated all available sentences!");
        onAnnotationComplete?.();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentSentence) {
    return (
      <Card className="border-slate-200">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">
            No sentences to annotate!
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Upload more sentences to continue annotating.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <Card className="border-slate-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                {currentIndex + 1} of {totalSentences} remaining
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{displayTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                disabled={currentIndex === totalSentences - 1}
              >
                Skip
                <SkipForward className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === totalSentences - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress
            value={((currentIndex + 1) / totalSentences) * 100}
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Sentence Display */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Sentence to Annotate</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-base text-slate-900 leading-relaxed">
              {currentSentence.text}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Language</p>
              <p className="text-sm text-slate-900 capitalize">
                {currentSentence.language || "Not specified"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Domain</p>
              <p className="text-sm text-slate-900">
                {currentSentence.domain?.replace(/_/g, " ") || "Not specified"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Theme</p>
              <p className="text-sm text-slate-900">
                {currentSentence.theme?.replace(/_/g, " ") || "Not specified"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Source Type</p>
              <p className="text-sm text-slate-900">
                {currentSentence.source_type?.replace(/_/g, " ") ||
                  "Not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annotation Form */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Annotation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              key={currentSentence._id}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="target_gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Gender *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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
                            <SelectValue placeholder="Select (optional)" />
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
                      <FormLabel>Sentiment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select (optional)" />
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
                            <SelectValue placeholder="Select (optional)" />
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
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes about this annotation..."
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip this sentence
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submit Annotation
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
