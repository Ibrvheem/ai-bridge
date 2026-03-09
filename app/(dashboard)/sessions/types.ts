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

export const uploadCSVSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) =>
        file.type === "text/csv" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel",
      { message: "Invalid file type. Please upload a CSV, XLSX, or XLS file." },
    ),
  language: z.string().optional(),
});

export const uploadHistorySchema = z.object({
  _id: z.string(),
  original_filename: z.string(),
  file_size: z.number(),
  status: z.enum(["completed", "failed", "processing"]),
  total_rows: z.number(),
  successful_inserts: z.number(),
  duplicate_count: z.number(),
  created_at: z.string(),
  download_url: z.string().url(),
});

export type UploadHistorySchema = z.infer<typeof uploadHistorySchema>;

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

// Export history record
export const exportRecordSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  sentence_count: z.number(),
  file_name: z.string(),
  s3_key: z.string(),
  download_url: z.string().optional(),
  exported_at: z.string(),
  created_at: z.string(),
});

export type ExportRecord = z.infer<typeof exportRecordSchema>;

// Export stats
export interface ExportStats {
  exportable_count: number;
  total_exported: number;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Sentence list item
export interface SentenceListItem {
  _id: string;
  text: string;
  language: string;
  country: string;
  source_type: string;
  domain: string;
  theme: string;
  bias_label: string | null;
  target_gender: string | null;
  exported_at: string | null;
  created_at: string;
  collector_id?: { email: string };
  annotator_id?: { email: string };
}

// Session (upload)
export interface Session {
  _id: string;
  document_id: string;
  user_id: string;
  original_filename: string;
  s3_key: string;
  file_size: number;
  mime_type: string;
  total_rows: number;
  successful_inserts: number;
  failed_inserts: number;
  duplicate_count: number;
  status: "completed" | "failed" | "processing";
  created_at: string;
  updated_at: string;
  download_url?: string;
}

// Session stats
export interface SessionStats {
  total: number;
  annotated: number;
  unannotated: number;
  exported: number;
  exportable: number;
  progress: number;
}
