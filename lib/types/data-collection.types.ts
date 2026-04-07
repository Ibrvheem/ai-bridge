export enum Script {
  LATIN = "latin",
  GEEZ = "geez",
  ARABIC = "arabic",
  AJAMI = "ajami",
  TIFINAGH = "tifinagh",
  NKO = "nko",
  VAI = "vai",
  OTHER = "other",
}

export enum SourceType {
  COMMUNITY = "community",
  WEB_PUBLIC = "web_public",
  INTERVIEW = "interview",
  MEDIA = "media",
  OTHER = "other",
}

export enum Domain {
  CULTURE_AND_RELIGION = "culture_and_religion",
  EDUCATION = "education",
  HEALTH = "health",
  LIVELIHOODS_AND_WORK = "livelihoods_and_work",
  GOVERNANCE_CIVIC = "governance_civic",
  MEDIA_AND_ONLINE = "media_and_online",
  HOUSEHOLD_AND_CARE = "household_and_care",
}

export enum Theme {
  STEREOTYPES = "stereotypes",
  HATE_OR_INSULT = "hate_or_insult",
  MISINFORMATION = "misinformation",
  PUBLIC_INTEREST = "public_interest",
  SPECIALIZED_ADVICE = "specialized_advice",
}

export enum SensitiveCharacteristic {
  AGE = "age",
  DISABILITY = "disability",
  ETHNICITY = "ethnicity",
  GENDER = "gender",
  HEALTH_STATUS = "health_status",
  INCOME_LEVEL = "income_level",
  NATIONALITY = "nationality",
  RELIGION = "religion",
  TRIBE = "tribe",
  OTHER = "other",
}

export enum SafetyFlag {
  SAFE = "safe",
  SENSITIVE = "sensitive",
  REJECT = "reject",
}

export enum TargetGender {
  FEMALE = "female",
  MALE = "male",
  NEUTRAL = "neutral",
  MIXED = "mixed",
  NONBINARY = "nonbinary",
  UNKNOWN = "unknown",
}

export enum BiasLabel {
  STEREOTYPE = "stereotype",
  COUNTER_STEREOTYPE = "counter-stereotype",
  NEUTRAL = "neutral",
  DEROGATION = "derogation",
}

export enum Explicitness {
  EXPLICIT = "explicit",
  IMPLICIT = "implicit",
}

export enum StereotypeCategory {
  PROFESSION = "profession",
  FAMILY_ROLE = "family_role",
  LEADERSHIP = "leadership",
  EDUCATION = "education",
  RELIGION_CULTURE = "religion_culture",
  PROVERB_IDIOM = "proverb_idiom",
  DAILY_LIFE = "daily_life",
  APPEARANCE = "appearance",
  CAPABILITY = "capability",
}

export enum SentimentTowardReferent {
  POSITIVE = "positive",
  NEUTRAL = "neutral",
  NEGATIVE = "negative",
}

export enum Device {
  METAPHOR = "metaphor",
  PROVERB = "proverb",
  SARCASM = "sarcasm",
  QUESTION = "question",
  DIRECTIVE = "directive",
  NARRATIVE = "narrative",
}

export enum QAStatus {
  ACCEPTED = "accepted",
  NEEDS_REVIEW = "needs_review",
  REJECTED = "rejected",
  DISPUTED = "disputed",
}

export type DataCollection = {
  _id: string;
  language: string;
  script: Script;
  country: string;
  region_dialect?: string;
  source_type: SourceType;
  source_ref?: string;
  collection_date: Date;
  text: string;
  domain: Domain;
  topic?: string;
  theme: Theme;
  sensitive_characteristic?: SensitiveCharacteristic | null;
  safety_flag: SafetyFlag;
  pii_removed: boolean;
  collector_id: string;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Annotation = {
  target_gender: TargetGender;
  bias_label: BiasLabel;
  explicitness: Explicitness;
  stereotype_category?: StereotypeCategory | null;
  sentiment_toward_referent?: SentimentTowardReferent | null;
  device?: Device | null;
  annotator_id?:
    | string
    | { email: string; first_name?: string; last_name?: string };
  annotation_date?: Date;
  qa_status: QAStatus;
  notes?: string | null;
  annotation_time_seconds?: number;
  review_notes?: string | null;
  dispute_notes?: string | null;
  review_history?: ReviewHistoryEntry[];
};

export type ReviewHistoryEntry = {
  _id?: string;
  user_id:
    | string
    | { _id: string; email: string; first_name?: string; last_name?: string };
  action: "accepted" | "rejected" | "appealed";
  notes?: string | null;
  created_at: string;
};

export type AnnotatedData = DataCollection & Annotation;

export interface ReviewSession {
  _id: string;
  name: string;
  reviewer_id: string;
  annotator_id: string;
  document_id: string;
  status: "active" | "completed";
  sentence_ids: string[];
  reviewed_sentence_ids: string[];
  total_sentences: number;
  total_reviewed: number;
  total_accepted: number;
  total_rejected: number;
  started_at: string;
  last_activity_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewAssignment {
  _id: string;
  reviewer_id: string;
  annotator_id: string | { _id: string; email: string };
  created_at: string;
  updated_at: string;
}

export interface AnnotatorSession {
  _id: string;
  document_id: string;
  original_filename: string;
  file_size: number;
  total_rows: number;
  successful_inserts: number;
  status: string;
  created_at: string;
  annotated_count: number;
  has_active_review: boolean;
  active_review_id: string | null;
}

export interface ReviewSessionStats {
  total_sentences: number;
  total_reviewed: number;
  total_accepted: number;
  total_rejected: number;
  remaining: number;
  status: string;
}
