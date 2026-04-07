"use client";

import {
  ThumbsDown,
  AlertTriangle,
  MessageSquare,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import ControlledSelect from "@/components/molecules/controlled-select";
import ControlledTextarea from "@/components/molecules/controlled-textarea";
import {
  AnnotatedData,
  QAStatus,
  ReviewHistoryEntry,
  TargetGender,
  BiasLabel,
  Explicitness,
  StereotypeCategory,
  SentimentTowardReferent,
  Device,
} from "@/lib/types/data-collection.types";
import { useRejectedSentence } from "../_hooks/use-rejected-sentence";
import dayjs from "@/lib/dayjs";

const targetGenderOptions = [
  { value: TargetGender.FEMALE, name: "Female" },
  { value: TargetGender.MALE, name: "Male" },
  { value: TargetGender.NEUTRAL, name: "Neutral" },
  { value: TargetGender.MIXED, name: "Mixed" },
  { value: TargetGender.NONBINARY, name: "Non-binary" },
  { value: TargetGender.UNKNOWN, name: "Unknown" },
];

const biasLabelOptions = [
  { value: BiasLabel.STEREOTYPE, name: "Stereotype" },
  { value: BiasLabel.COUNTER_STEREOTYPE, name: "Counter-stereotype" },
  { value: BiasLabel.NEUTRAL, name: "Neutral" },
  { value: BiasLabel.DEROGATION, name: "Derogation" },
];

const explicitnessOptions = [
  { value: Explicitness.EXPLICIT, name: "Explicit" },
  { value: Explicitness.IMPLICIT, name: "Implicit" },
];

const stereotypeCategoryOptions = [
  { value: StereotypeCategory.PROFESSION, name: "Profession" },
  { value: StereotypeCategory.FAMILY_ROLE, name: "Family Role" },
  { value: StereotypeCategory.LEADERSHIP, name: "Leadership" },
  { value: StereotypeCategory.EDUCATION, name: "Education" },
  { value: StereotypeCategory.RELIGION_CULTURE, name: "Religion/Culture" },
  { value: StereotypeCategory.PROVERB_IDIOM, name: "Proverb/Idiom" },
  { value: StereotypeCategory.DAILY_LIFE, name: "Daily Life" },
  { value: StereotypeCategory.APPEARANCE, name: "Appearance" },
  { value: StereotypeCategory.CAPABILITY, name: "Capability" },
];

const sentimentOptions = [
  { value: SentimentTowardReferent.POSITIVE, name: "Positive" },
  { value: SentimentTowardReferent.NEUTRAL, name: "Neutral" },
  { value: SentimentTowardReferent.NEGATIVE, name: "Negative" },
];

const deviceOptions = [
  { value: Device.METAPHOR, name: "Metaphor" },
  { value: Device.PROVERB, name: "Proverb" },
  { value: Device.SARCASM, name: "Sarcasm" },
  { value: Device.QUESTION, name: "Question" },
  { value: Device.DIRECTIVE, name: "Directive" },
  { value: Device.NARRATIVE, name: "Narrative" },
];

export function RejectedSentenceItem({
  sentence,
}: {
  sentence: AnnotatedData;
}) {
  const {
    form,
    isDisputed,
    isSubmitting,
    showAppeal,
    showReAnnotate,
    appealNotes,
    setAppealNotes,
    handleAppeal,
    handleReAnnotate,
    toggleAppeal,
    toggleReAnnotate,
    cancelAppeal,
    cancelReAnnotate,
  } = useRejectedSentence(sentence);

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4 space-y-3">
        {/* Sentence text */}
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
          <p className="text-sm text-slate-900">{sentence.text}</p>
        </div>

        {/* Current annotation values */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-slate-500 capitalize">
            {sentence.language || "—"}
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-500 capitalize">
            {sentence.target_gender?.replace(/_/g, " ") || "—"}
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-500 capitalize">
            {sentence.bias_label?.replace(/-/g, " ") || "—"}
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-500 capitalize">
            {sentence.explicitness || "—"}
          </span>
        </div>

        {/* Review conversation trail */}
        {sentence.review_history && sentence.review_history.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Review History</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sentence.review_history.map(
                (entry: ReviewHistoryEntry, index: number) => {
                  const userName =
                    typeof entry.user_id === "object" && entry.user_id
                      ? `${entry.user_id.first_name || ""} ${entry.user_id.last_name || ""}`.trim() ||
                        entry.user_id.email
                      : "Unknown";

                  const isReviewer = entry.action !== "appealed";
                  const bgColor = isReviewer
                    ? entry.action === "rejected"
                      ? "border-red-200 bg-red-50"
                      : "border-green-200 bg-green-50"
                    : "border-amber-200 bg-amber-50";
                  const textColor = isReviewer
                    ? entry.action === "rejected"
                      ? "text-red-700"
                      : "text-green-700"
                    : "text-amber-700";
                  const actionLabel =
                    entry.action === "rejected"
                      ? "Rejected"
                      : entry.action === "accepted"
                        ? "Accepted"
                        : "Appealed";

                  return (
                    <div
                      key={entry._id || index}
                      className={`rounded-lg border p-2.5 ${bgColor}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className={`h-3 w-3 ${textColor}`} />
                          <span className={`text-xs font-medium ${textColor}`}>
                            {userName} — {actionLabel}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {dayjs(entry.created_at).format("MMM D, h:mm A")}
                        </span>
                      </div>
                      {entry.notes && (
                        <p
                          className={`text-sm ${textColor.replace("700", "900")}`}
                        >
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}

        {/* Fallback: show review notes if no history yet (legacy data) */}
        {(!sentence.review_history || sentence.review_history.length === 0) &&
          sentence.review_notes && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-amber-600" />
                <p className="text-xs font-medium text-amber-700">
                  Reviewer Notes
                </p>
              </div>
              <p className="text-sm text-amber-900">{sentence.review_notes}</p>
            </div>
          )}

        {/* Status and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDisputed ? (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Appealed
              </Badge>
            ) : (
              <Badge variant="destructive">
                <ThumbsDown className="h-3 w-3 mr-1" />
                Rejected
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isDisputed && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAppeal}
                disabled={isSubmitting}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Appeal
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleReAnnotate}
              disabled={isSubmitting}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Fix &amp; Resubmit
            </Button>
          </div>
        </div>

        {/* Appeal form */}
        {showAppeal && !isDisputed && (
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <Textarea
              placeholder="Explain why you disagree with the rejection..."
              className="resize-none text-sm"
              value={appealNotes}
              onChange={(e) => setAppealNotes(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={cancelAppeal}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleAppeal}
                disabled={isSubmitting || !appealNotes.trim()}
              >
                {isSubmitting && (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                )}
                Submit Appeal
              </Button>
            </div>
          </div>
        )}

        {/* Fix & Resubmit form */}
        {showReAnnotate && (
          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-3">
              Update your annotation and resubmit for review
            </p>
            <Form {...form}>
              <form onSubmit={handleReAnnotate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ControlledSelect
                    name="target_gender"
                    label="Target Gender *"
                    placeholder="Select..."
                    values={targetGenderOptions}
                  />
                  <ControlledSelect
                    name="bias_label"
                    label="Bias Label *"
                    placeholder="Select..."
                    values={biasLabelOptions}
                  />
                  <ControlledSelect
                    name="explicitness"
                    label="Explicitness *"
                    placeholder="Select..."
                    values={explicitnessOptions}
                  />
                  <ControlledSelect
                    name="stereotype_category"
                    label="Stereotype Category"
                    placeholder="Select..."
                    values={stereotypeCategoryOptions}
                    optional
                  />
                  <ControlledSelect
                    name="sentiment_toward_referent"
                    label="Sentiment"
                    placeholder="Select..."
                    values={sentimentOptions}
                    optional
                  />
                  <ControlledSelect
                    name="device"
                    label="Device"
                    placeholder="Select..."
                    values={deviceOptions}
                    optional
                  />
                </div>

                <ControlledTextarea
                  name="notes"
                  label="Notes"
                  placeholder="Optional notes about your annotation..."
                  optional
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={cancelReAnnotate}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    )}
                    Resubmit for Review
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
