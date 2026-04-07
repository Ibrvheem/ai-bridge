"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  annotateSentenceSchema,
  type AnnotateSentenceSchema,
} from "@/app/(dashboard)/sessions/types";
import { AnnotatedData, QAStatus } from "@/lib/types/data-collection.types";
import { disputeSentence, reAnnotateSentence } from "../../services";

export function useRejectedSentence(sentence: AnnotatedData) {
  const router = useRouter();
  const [showAppeal, setShowAppeal] = useState(false);
  const [showReAnnotate, setShowReAnnotate] = useState(false);
  const [appealNotes, setAppealNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisputed = sentence.qa_status === QAStatus.DISPUTED;

  const form = useForm<AnnotateSentenceSchema>({
    resolver: zodResolver(annotateSentenceSchema),
    defaultValues: {
      target_gender: sentence.target_gender || undefined,
      bias_label: sentence.bias_label || undefined,
      explicitness: sentence.explicitness || undefined,
      stereotype_category: sentence.stereotype_category || undefined,
      sentiment_toward_referent:
        sentence.sentiment_toward_referent || undefined,
      device: sentence.device || undefined,
      notes: sentence.notes || "",
    },
  });

  const handleAppeal = async () => {
    if (!appealNotes.trim()) {
      toast.error("Please provide appeal notes");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await disputeSentence(sentence._id, appealNotes);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Appeal submitted successfully");
      setShowAppeal(false);
      setAppealNotes("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit appeal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReAnnotate = form.handleSubmit(
    async (data: AnnotateSentenceSchema) => {
      setIsSubmitting(true);
      try {
        const result = await reAnnotateSentence(sentence._id, data);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Annotation resubmitted for review");
        setShowReAnnotate(false);
        router.refresh();
      } catch (error) {
        toast.error("Failed to resubmit annotation");
      } finally {
        setIsSubmitting(false);
      }
    },
  );

  const toggleAppeal = () => {
    setShowAppeal(!showAppeal);
    setShowReAnnotate(false);
  };

  const toggleReAnnotate = () => {
    setShowReAnnotate(!showReAnnotate);
    setShowAppeal(false);
  };

  const cancelAppeal = () => {
    setShowAppeal(false);
    setAppealNotes("");
  };

  const cancelReAnnotate = () => {
    setShowReAnnotate(false);
  };

  return {
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
  };
}
