"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ThumbsUp,
  ThumbsDown,
  SkipForward,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AnnotatedData,
  QAStatus,
  ReviewHistoryEntry,
} from "@/lib/types/data-collection.types";
import { submitReview } from "../../services";
import dayjs from "@/lib/dayjs";

interface ReviewerProps {
  sentences: AnnotatedData[];
  sessionId: string;
}

export function Reviewer({ sentences, sessionId }: ReviewerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submittingAction, setSubmittingAction] = useState<QAStatus | null>(
    null,
  );
  const [reviewNotes, setReviewNotes] = useState("");
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

  // Reset notes when switching sentences
  useEffect(() => {
    setReviewNotes("");
  }, [currentIndex]);

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

  const isSubmitting = submittingAction !== null;

  const handleReviewAction = async (qaStatus: QAStatus) => {
    if (!currentSentence) return;

    setSubmittingAction(qaStatus);
    try {
      const result = await submitReview(sessionId, currentSentence._id, {
        qa_status: qaStatus,
        review_notes: reviewNotes || undefined,
      });

      if (result?.error) {
        const errorMessage = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.error || "Failed to submit review";
        toast.error(errorMessage);
        return;
      }

      const statusLabel =
        qaStatus === QAStatus.ACCEPTED ? "Accepted" : "Rejected";
      toast.success(`Sentence marked as ${statusLabel}`);

      setReviewNotes("");
      router.refresh();

      if (totalSentences <= 1) {
        toast.success("Review session complete!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmittingAction(null);
    }
  };

  if (!currentSentence) {
    return null;
  }

  const annotatorName =
    typeof currentSentence.annotator_id === "object" &&
    currentSentence.annotator_id
      ? `${currentSentence.annotator_id.first_name || ""} ${currentSentence.annotator_id.last_name || ""}`.trim() ||
        currentSentence.annotator_id.email
      : null;

  const isAppeal = currentSentence.qa_status === QAStatus.DISPUTED;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <Card className="border-slate-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                {currentIndex + 1} of {totalSentences} pending
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
                onClick={() => handleNext()}
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
      <Card
        className={`border-slate-200 ${isAppeal ? "border-amber-300 ring-1 ring-amber-200" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Sentence to Review</CardTitle>
              {isAppeal && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Appeal
                </Badge>
              )}
            </div>
            {annotatorName && (
              <span className="text-sm text-slate-500">
                Annotated by: {annotatorName}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-base text-slate-900 leading-relaxed">
              {currentSentence.text}
            </p>
          </div>

          {/* Metadata */}
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

      {/* Annotation Details (read-only) */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Annotation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Target Gender
              </p>
              <p className="text-sm text-slate-900 capitalize">
                {currentSentence.target_gender?.replace(/_/g, " ") || "—"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Bias Label</p>
              <p className="text-sm text-slate-900 capitalize">
                {currentSentence.bias_label?.replace(/-/g, " ") || "—"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Explicitness</p>
              <p className="text-sm text-slate-900 capitalize">
                {currentSentence.explicitness || "—"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Stereotype Category
              </p>
              <p className="text-sm text-slate-900 capitalize">
                {currentSentence.stereotype_category?.replace(/_/g, " ") || "—"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Sentiment</p>
              <p className="text-sm text-slate-900 capitalize">
                {currentSentence.sentiment_toward_referent || "—"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Device</p>
              <p className="text-sm text-slate-900 capitalize">
                {currentSentence.device || "—"}
              </p>
            </div>
          </div>
          {currentSentence.notes && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Annotator Notes
              </p>
              <p className="text-sm text-slate-900 mt-1">
                {currentSentence.notes}
              </p>
            </div>
          )}

          {/* Review conversation trail */}
          {currentSentence.review_history &&
            currentSentence.review_history.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-slate-500">
                  Review History
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currentSentence.review_history.map(
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
                          className={`rounded-lg border p-3 ${bgColor}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <MessageSquare
                                className={`h-3.5 w-3.5 ${textColor}`}
                              />
                              <span
                                className={`text-xs font-medium ${textColor}`}
                              >
                                {userName} — {actionLabel}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">
                              {dayjs(entry.created_at).format(
                                "MMM D, YYYY h:mm A",
                              )}
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
        </CardContent>
      </Card>

      {/* Review Actions */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Review Decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="review-notes">Review Notes (Optional)</Label>
            <Textarea
              id="review-notes"
              placeholder="Add notes about your review decision..."
              className="mt-1.5 resize-none"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="destructive"
              onClick={() => handleReviewAction(QAStatus.REJECTED)}
              disabled={isSubmitting}
            >
              {submittingAction === QAStatus.REJECTED && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <ThumbsDown className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleReviewAction(QAStatus.ACCEPTED)}
              disabled={isSubmitting}
            >
              {submittingAction === QAStatus.ACCEPTED && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <ThumbsUp className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
