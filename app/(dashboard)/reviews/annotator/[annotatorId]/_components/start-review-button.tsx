"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startSessionReview } from "../../../services";

interface StartReviewButtonProps {
  documentId: string;
  annotatorId: string;
}

export function StartReviewButton({
  documentId,
  annotatorId,
}: StartReviewButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const result = await startSessionReview(documentId, annotatorId);

      if (result?.error || result?.statusCode >= 400) {
        const msg =
          result?.message || result?.error || "Failed to start review";
        toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
        return;
      }

      toast.success("Review session created!");
      router.push(`/reviews/${result._id}`);
    } catch (error) {
      toast.error("Failed to start review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button size="sm" onClick={handleStart} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Play className="h-4 w-4 mr-2" />
      )}
      Start Review
    </Button>
  );
}
