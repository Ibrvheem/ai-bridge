import z from "zod";
import {
  TargetGender,
  BiasLabel,
  Explicitness,
  StereotypeCategory,
  SentimentTowardReferent,
  Device,
  QAStatus,
  Script,
  SourceType,
  Domain,
  Theme,
  SensitiveCharacteristic,
  SafetyFlag,
  type DataCollection,
  type Annotation,
  type AnnotatedData,
} from "@/lib/types/data-collection.types";

export {
  TargetGender,
  BiasLabel,
  Explicitness,
  StereotypeCategory,
  SentimentTowardReferent,
  Device,
  QAStatus,
  Script,
  SourceType,
  Domain,
  Theme,
  SensitiveCharacteristic,
  SafetyFlag,
  type DataCollection,
  type Annotation,
  type AnnotatedData,
};

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
