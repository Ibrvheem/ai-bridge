"use server";

import api from "@/lib/api";
import { revalidateTag } from "next/cache";
import {
  AnnotationSession,
  AnnotationSessionWithSentences,
  CreateSessionDto,
  UpdateSessionDto,
  ExportSessionDto,
  ExportResponse,
  SessionStats,
  UserSessionStats,
} from "./types";

// Get all sessions for the current user
export async function getSessions(): Promise<AnnotationSession[]> {
  try {
    const response = await api.get("annotation-sessions", {
      tags: ["sessions"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

// Get user's session statistics
export async function getUserSessionStats(): Promise<UserSessionStats | null> {
  try {
    const response = await api.get("annotation-sessions/stats", {
      tags: ["sessions"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching user session stats:", error);
    return null;
  }
}

// Get a single session
export async function getSession(
  sessionId: string,
): Promise<AnnotationSession | null> {
  try {
    const response = await api.get(`annotation-sessions/${sessionId}`, {
      tags: ["sessions", `session-${sessionId}`],
    });
    return response;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

// Get a session with its sentences
export async function getSessionWithSentences(
  sessionId: string,
): Promise<AnnotationSessionWithSentences | null> {
  try {
    const response = await api.get(
      `annotation-sessions/${sessionId}/sentences`,
      {
        tags: ["sessions", `session-${sessionId}`],
      },
    );
    return response;
  } catch (error) {
    console.error("Error fetching session with sentences:", error);
    return null;
  }
}

// Get session statistics
export async function getSessionStats(
  sessionId: string,
): Promise<SessionStats | null> {
  try {
    const response = await api.get(`annotation-sessions/${sessionId}/stats`, {
      tags: ["sessions", `session-${sessionId}`],
    });
    return response;
  } catch (error) {
    console.error("Error fetching session stats:", error);
    return null;
  }
}

// Create a new session
export async function createSession(data: CreateSessionDto) {
  try {
    const response = await api.post("annotation-sessions", data);
    revalidateTag("sessions");
    return response;
  } catch (error) {
    console.error("Error creating session:", error);
    return { error: "Failed to create session" };
  }
}

// Update a session
export async function updateSession(sessionId: string, data: UpdateSessionDto) {
  try {
    const response = await api.patch(`annotation-sessions/${sessionId}`, data);
    revalidateTag("sessions");
    revalidateTag(`session-${sessionId}`);
    return response;
  } catch (error) {
    console.error("Error updating session:", error);
    return { error: "Failed to update session" };
  }
}

// Add a sentence to a session
export async function addSentenceToSession(
  sessionId: string,
  sentenceId: string,
) {
  try {
    const response = await api.post(
      `annotation-sessions/${sessionId}/sentences`,
      {
        sentence_id: sentenceId,
      },
    );
    revalidateTag("sessions");
    revalidateTag(`session-${sessionId}`);
    return response;
  } catch (error) {
    console.error("Error adding sentence to session:", error);
    return { error: "Failed to add sentence to session" };
  }
}

// Remove a sentence from a session
export async function removeSentenceFromSession(
  sessionId: string,
  sentenceId: string,
) {
  try {
    const response = await api.delete(
      `annotation-sessions/${sessionId}/sentences/${sentenceId}`,
    );
    revalidateTag("sessions");
    revalidateTag(`session-${sessionId}`);
    return response;
  } catch (error) {
    console.error("Error removing sentence from session:", error);
    return { error: "Failed to remove sentence from session" };
  }
}

// Export sentences from a session
export async function exportSession(
  sessionId: string,
  data: ExportSessionDto = {},
): Promise<ExportResponse | { error: string }> {
  try {
    const response = await api.post(
      `annotation-sessions/${sessionId}/export`,
      data,
    );
    revalidateTag("sessions");
    revalidateTag(`session-${sessionId}`);
    return response;
  } catch (error) {
    console.error("Error exporting session:", error);
    return { error: "Failed to export session" };
  }
}

// Get export history for a session
export async function getExportHistory(sessionId: string) {
  try {
    const response = await api.get(`annotation-sessions/${sessionId}/exports`, {
      tags: ["sessions", `session-${sessionId}`],
    });
    return response;
  } catch (error) {
    console.error("Error fetching export history:", error);
    return [];
  }
}

// Regenerate download URL for an export
export async function regenerateExportUrl(
  sessionId: string,
  exportIndex: number,
) {
  try {
    const response = await api.post(
      `annotation-sessions/${sessionId}/exports/${exportIndex}/regenerate-url`,
      {},
    );
    revalidateTag(`session-${sessionId}`);
    return response;
  } catch (error) {
    console.error("Error regenerating export URL:", error);
    return { error: "Failed to regenerate download URL" };
  }
}

// Delete a session
export async function deleteSession(sessionId: string) {
  try {
    const response = await api.delete(`annotation-sessions/${sessionId}`);
    revalidateTag("sessions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting session:", error);
    return { error: "Failed to delete session" };
  }
}

// Check if a sentence has been exported
export async function isSentenceExported(sentenceId: string): Promise<boolean> {
  try {
    const response = await api.get(
      `annotation-sessions/sentence/${sentenceId}/exported`,
    );
    return response;
  } catch (error) {
    console.error("Error checking if sentence is exported:", error);
    return false;
  }
}

// Revalidate sessions cache
export async function revalidateSessions() {
  revalidateTag("sessions");
}

// ============================================
// Sentence-related services (moved from sentences module)
// ============================================

import { AnnotateSentenceSchema, DataCollection } from "./types";

// Get all unannotated sentences
export async function getUnannotatedSentences(): Promise<DataCollection[]> {
  try {
    const response = await api.get("sentences/unannotated", {
      tags: ["sentences"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching sentences:", error);
    return [];
  }
}

// Get all annotated sentences
export async function getAnnotatedSentences(): Promise<DataCollection[]> {
  try {
    const response = await api.get("sentences/annotated", {
      tags: ["sentences"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching sentences:", error);
    return [];
  }
}

// Annotate a sentence
export async function annotateSentence(
  sentenceId: string,
  annotation: AnnotateSentenceSchema,
) {
  try {
    const response = await api.patch(
      `sentences/annotate/${sentenceId}`,
      annotation,
    );

    revalidateTag("sentences");
    revalidateTag("sessions");
    return response;
  } catch (error) {
    console.error("Error annotating sentence:", error);
    return { success: false, error: "Failed to annotate sentence" };
  }
}
