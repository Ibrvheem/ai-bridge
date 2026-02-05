"use server";

import api from "@/lib/api";
import { revalidateTag } from "next/cache";
import { AnnotateSentenceSchema } from "./types";

export async function uploadSentences(payload: FormData) {
  try {
    const response = await api.formData("sentences/upload-csv", payload);
    return response;
  } catch (error) {
    return error;
  }
}

export async function uploadStats() {
  try {
    const response = await api.get("sentences/upload-stats", {
      tags: ["sentences"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching upload stats:", error);
    return { error: "Failed to fetch upload stats" };
  }
}

export async function getUploadHistory() {
  try {
    const response = await api.get("sentences/upload-history", {
      tags: ["sentences"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching upload history:", error);
    return { error: "Failed to fetch upload history" };
  }
}

export async function revalidateSentences() {
  await revalidateTag("sentences");
}

// Get unannotated sentences
export async function getUnannotatedSentences() {
  try {
    const response = await api.get("sentences/unannotated", {
      tags: ["sentences", "annotations"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching unannotated sentences:", error);
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
    revalidateTag("annotations");
    revalidateTag("sentences");
    return response;
  } catch (error) {
    console.error("Error annotating sentence:", error);
    return { error: "Failed to annotate sentence" };
  }
}

// Get export stats
export async function getExportStats() {
  try {
    const response = await api.get("sentences/export-stats", {
      tags: ["annotations", "exports"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching export stats:", error);
    return { exportable_count: 0, total_exported: 0 };
  }
}

// Get export history
export async function getExportHistory() {
  try {
    const response = await api.get("sentences/export-history", {
      tags: ["exports"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching export history:", error);
    return [];
  }
}

// Export annotations
export async function exportAnnotations(fileName?: string) {
  try {
    const response = await api.post("sentences/export", {
      file_name: fileName,
    });
    revalidateTag("exports");
    revalidateTag("annotations");
    return response;
  } catch (error) {
    console.error("Error exporting annotations:", error);
    return { error: "Failed to export annotations" };
  }
}

// Get all sentences paginated
export async function getAllSentences(
  page: number = 1,
  limit: number = 20,
  filter?: string,
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (filter) {
      params.set("filter", filter);
    }
    const response = await api.get(`sentences?${params.toString()}`, {
      tags: ["sentences"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching sentences:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}
