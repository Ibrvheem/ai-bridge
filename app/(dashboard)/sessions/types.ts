import z from "zod";
import {
  AnnotatedData,
  DataCollection,
  TargetGender,
  BiasLabel,
  Explicitness,
  StereotypeCategory,
  SentimentTowardReferent,
  Device,
  QAStatus,
} from "@/lib/types/data-collection.types";

// Re-export annotation types for use in components
export {
  TargetGender,
  BiasLabel,
  Explicitness,
  StereotypeCategory,
  SentimentTowardReferent,
  Device,
  QAStatus,
  type DataCollection,
  type AnnotatedData,
};

// Session Status enum matching backend
export enum SessionStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  EXPORTED = "exported",
}

// Export record type
export const exportRecordSchema = z.object({
  exported_at: z.string(),
  exported_by: z.string().optional(),
  sentence_count: z.number(),
  file_name: z.string(),
  download_url: z.string().optional(),
});

export type ExportRecord = z.infer<typeof exportRecordSchema>;

// Annotation session schema
export const annotationSessionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  user_id: z.string(),
  status: z.nativeEnum(SessionStatus),
  annotated_sentence_ids: z.array(z.string()),
  exported_sentence_ids: z.array(z.string()),
  total_annotated: z.number(),
  total_exported: z.number(),
  started_at: z.string(),
  last_activity_at: z.string(),
  completed_at: z.string().optional().nullable(),
  exports: z.array(exportRecordSchema),
  language_filter: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type AnnotationSession = z.infer<typeof annotationSessionSchema>;

// Session with sentences (sentences are annotated)
export interface AnnotationSessionWithSentences extends AnnotationSession {
  sentences: AnnotatedData[];
  exportable_count: number;
}

// Session stats
export interface SessionStats {
  total_annotated: number;
  total_exported: number;
  exportable_count: number;
  exports_count: number;
  status: SessionStatus;
  started_at: string;
  last_activity_at: string;
  completed_at?: string;
}

// User session stats
export interface UserSessionStats {
  total_sessions: number;
  active_sessions: number;
  completed_sessions: number;
  total_annotated: number;
  total_exported: number;
  unique_exported_sentences: number;
}

// Create session DTO
export const createSessionSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  description: z.string().optional(),
  language_filter: z.string().optional(),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>;

// Update session DTO
export const updateSessionSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(SessionStatus).optional(),
  language_filter: z.string().optional(),
});

export type UpdateSessionDto = z.infer<typeof updateSessionSchema>;

// Export session DTO
export const exportSessionSchema = z.object({
  sentence_ids: z.array(z.string()).optional(),
  file_name: z.string().optional(),
});

export type ExportSessionDto = z.infer<typeof exportSessionSchema>;

// Export response
export interface ExportResponse {
  success: boolean;
  message: string;
  export: {
    file_name: string;
    download_url: string;
    sentence_count: number;
    exported_at: string;
  };
  session: {
    total_annotated: number;
    total_exported: number;
    remaining_to_export: number;
  };
}

// Annotation schema for sentence annotation
export const annotateSentenceSchema = z.object({
  target_gender: z.nativeEnum(TargetGender),
  bias_label: z.nativeEnum(BiasLabel),
  explicitness: z.nativeEnum(Explicitness),
  stereotype_category: z.nativeEnum(StereotypeCategory).optional().nullable(),
  sentiment_toward_referent: z
    .nativeEnum(SentimentTowardReferent)
    .optional()
    .nullable(),
  device: z.nativeEnum(Device).optional().nullable(),
  qa_status: z.nativeEnum(QAStatus).optional(),
  notes: z.string().optional().nullable(),
  annotation_time_seconds: z.number().optional(),
});

export type AnnotateSentenceSchema = z.infer<typeof annotateSentenceSchema>;
