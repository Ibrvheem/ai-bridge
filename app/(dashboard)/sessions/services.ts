"use server";

import api from "@/lib/api";
import { revalidateTag } from "next/cache";
import { AnnotateSentenceSchema } from "./types";

export async function uploadSentences(payload: FormData) {
  try {
    const response = await api.formData("sentences/upload-csv", payload);
    revalidateTag("sessions");
    return response;
  } catch (error) {
    return error;
  }
}

// Get all sessions (uploads)
export async function getSessions() {
  try {
    const response = await api.get("sentences/upload-history", {
      tags: ["sessions"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

// Annotate a sentence
export async function annotateSentence(
  sentenceId: string,
  data: AnnotateSentenceSchema,
) {
  try {
    const response = await api.patch(`sentences/annotate/${sentenceId}`, data);
    revalidateTag("sessions");
    return response;
  } catch (error) {
    console.error("Error annotating sentence:", error);
    return { error: "Failed to annotate sentence" };
  }
}

// ==================== SESSION-SPECIFIC ====================

// Get session stats
export async function getSessionStats(documentId: string) {
  try {
    const response = await api.get(`sentences/session/${documentId}/stats`, {
      tags: ["sessions"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching session stats:", error);
    return {
      total: 0,
      annotated: 0,
      unannotated: 0,
      exported: 0,
      exportable: 0,
      progress: 0,
    };
  }
}

// Get unannotated sentences for a session
export async function getSessionUnannotated(documentId: string) {
  try {
    const response = await api.get(
      `sentences/session/${documentId}/unannotated`,
      {
        tags: ["sessions"],
      },
    );
    return response;
  } catch (error) {
    console.error("Error fetching session sentences:", error);
    return [];
  }
}

// Export session annotations
export async function exportSession(
  documentId: string,
  exportAll: boolean = false,
) {
  try {
    const response = await api.post(`sentences/session/${documentId}/export`, {
      export_all: exportAll,
    });
    revalidateTag("sessions");
    return response;
  } catch (error) {
    console.error("Error exporting session:", error);
    return { error: "Failed to export session" };
  }
}
