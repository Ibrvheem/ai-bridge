"use server";

import api from "@/lib/api";
import { revalidateTag } from "next/cache";
import { AnnotateSentenceSchema, DataCollection } from "./types";

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
    return response;
  } catch (error) {
    console.error("Error annotating sentence:", error);
    return { success: false, error: "Failed to annotate sentence" };
  }
}
