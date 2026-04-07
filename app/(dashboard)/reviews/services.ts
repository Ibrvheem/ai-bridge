"use server";

import api from "@/lib/api";
import { revalidateTag } from "next/cache";

// ==================== REVIEWER: ASSIGNMENTS ====================

// Get my assigned annotators
export async function getMyAssignments() {
  try {
    const response = await api.get("reviews/my-assignments", {
      tags: ["reviews"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}

// Get annotator's sessions (that I'm assigned to review)
export async function getAnnotatorSessions(annotatorId: string) {
  try {
    const response = await api.get(
      `reviews/annotator/${annotatorId}/sessions`,
      {
        tags: ["reviews"],
      },
    );
    return response;
  } catch (error) {
    console.error("Error fetching annotator sessions:", error);
    return [];
  }
}

// Start a review for a specific session
export async function startSessionReview(
  documentId: string,
  annotatorId: string,
) {
  try {
    const response = await api.post("reviews/start", {
      document_id: documentId,
      annotator_id: annotatorId,
    });
    revalidateTag("reviews");
    return response;
  } catch (error) {
    console.error("Error starting review:", error);
    return { error: "Failed to start review" };
  }
}

// ==================== REVIEW SESSIONS ====================

// Get all review sessions
export async function getReviewSessions() {
  try {
    const response = await api.get("reviews", {
      tags: ["reviews"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching review sessions:", error);
    return [];
  }
}

// Get single review session
export async function getReviewSession(id: string) {
  try {
    const response = await api.get(`reviews/${id}`, {
      tags: ["reviews"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching review session:", error);
    return null;
  }
}

// Get review session stats
export async function getReviewSessionStats(id: string) {
  try {
    const response = await api.get(`reviews/${id}/stats`, {
      tags: ["reviews"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching review session stats:", error);
    return {
      total_sentences: 0,
      total_reviewed: 0,
      total_accepted: 0,
      total_rejected: 0,
      remaining: 0,
      status: "active",
    };
  }
}

// Get sentences for review (pending or reviewed)
export async function getReviewSentences(id: string, filter?: string) {
  try {
    const endpoint = filter
      ? `reviews/${id}/sentences?filter=${filter}`
      : `reviews/${id}/sentences`;
    const response = await api.get(endpoint, {
      tags: ["reviews"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching review sentences:", error);
    return [];
  }
}

// Submit a review decision
export async function submitReview(
  sessionId: string,
  sentenceId: string,
  data: { qa_status: string; review_notes?: string },
) {
  try {
    const response = await api.patch(
      `reviews/${sessionId}/sentences/${sentenceId}`,
      data,
    );
    revalidateTag("reviews");
    return response;
  } catch (error) {
    console.error("Error submitting review:", error);
    return { error: "Failed to submit review" };
  }
}

// ==================== ANNOTATOR: MY APPEALS ====================

// Get all my rejected/disputed sentences
export async function getMyRejectedSentences() {
  try {
    const response = await api.get("sentences/my-rejected", {
      tags: ["reviews", "sessions"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching rejected sentences:", error);
    return [];
  }
}

// Dispute/appeal a rejected sentence
export async function disputeSentence(
  sentenceId: string,
  disputeNotes: string,
) {
  try {
    const response = await api.patch(`sentences/dispute/${sentenceId}`, {
      dispute_notes: disputeNotes,
    });
    revalidateTag("reviews");
    revalidateTag("sessions");
    return response;
  } catch (error) {
    console.error("Error disputing sentence:", error);
    return { error: "Failed to submit appeal" };
  }
}

// Re-annotate a rejected sentence (fix & resubmit)
export async function reAnnotateSentence(
  sentenceId: string,
  data: Record<string, unknown>,
) {
  try {
    const response = await api.patch(`sentences/annotate/${sentenceId}`, data);
    revalidateTag("reviews");
    revalidateTag("sessions");
    return response;
  } catch (error) {
    console.error("Error re-annotating sentence:", error);
    return { error: "Failed to resubmit annotation" };
  }
}
