"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ThumbsDown,
  AlertTriangle,
  MessageSquare,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AnnotatedData,
  QAStatus,
  ReviewHistoryEntry,
} from "@/lib/types/data-collection.types";
import { annotateSentence, disputeSentence } from "../../services";
import dayjs from "@/lib/dayjs";

interface RejectedSentencesProps {
  sentences: AnnotatedData[];
}

export function RejectedSentences({ sentences }: RejectedSentencesProps) {
  const [expanded, setExpanded] = useState(false);

  if (sentences.length === 0) return null;

  return (
    <Card className="border-red-200">
      <CardHeader className="pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ThumbsDown className="h-5 w-5 text-red-500" />
              Rejected Sentences
            </CardTitle>
            <Badge variant="destructive">{sentences.length}</Badge>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            These sentences were rejected by the reviewer. You can re-annotate
            them or appeal the rejection.
          </p>
          {sentences.map((sentence) => (
            <RejectedSentenceItem key={sentence._id} sentence={sentence} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

function RejectedSentenceItem({ sentence }: { sentence: AnnotatedData }) {
  const router = useRouter();
  const [showDispute, setShowDispute] = useState(false);
  const [disputeNotes, setDisputeNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisputed = sentence.qa_status === QAStatus.DISPUTED;

  const handleDispute = async () => {
    if (!disputeNotes.trim()) {
      toast.error("Please provide appeal notes");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await disputeSentence(sentence._id, disputeNotes);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Appeal submitted successfully");
      setShowDispute(false);
      setDisputeNotes("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit appeal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReAnnotate = async () => {
    setIsSubmitting(true);
    try {
      // Re-annotating resets the sentence - submit with same annotation data
      // The backend resets qa_status to needs_review on re-annotation
      const result = await annotateSentence(sentence._id, {
        target_gender: sentence.target_gender,
        bias_label: sentence.bias_label,
        explicitness: sentence.explicitness,
        stereotype_category: sentence.stereotype_category,
        sentiment_toward_referent: sentence.sentiment_toward_referent,
        device: sentence.device,
        notes: sentence.notes,
      });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Sentence re-submitted for review");
      router.refresh();
    } catch (error) {
      toast.error("Failed to re-annotate sentence");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-red-100 bg-red-50/50 p-4 space-y-3">
      {/* Sentence text */}
      <div className="rounded-lg bg-white p-3 border border-slate-200">
        <p className="text-sm text-slate-900">{sentence.text}</p>
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

        {!isDisputed && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDispute(!showDispute)}
              disabled={isSubmitting}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Appeal
            </Button>
            <Button
              size="sm"
              onClick={handleReAnnotate}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              )}
              <RotateCcw className="h-4 w-4 mr-1" />
              Re-annotate
            </Button>
          </div>
        )}
      </div>

      {/* Dispute form */}
      {showDispute && !isDisputed && (
        <div className="space-y-2 pt-2 border-t border-red-200">
          <Textarea
            placeholder="Explain why you disagree with the rejection..."
            className="resize-none text-sm"
            value={disputeNotes}
            onChange={(e) => setDisputeNotes(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowDispute(false);
                setDisputeNotes("");
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDispute}
              disabled={isSubmitting || !disputeNotes.trim()}
            >
              {isSubmitting && (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              )}
              Submit Appeal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
