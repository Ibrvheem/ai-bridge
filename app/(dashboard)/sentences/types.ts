import z from "zod";

export const sentenceSchema = z.object({
    _id: z.string(),
    sentence: z.string(),
    user: z.object({ email: z.string(), _id: z.string() }),
    annotated_by: z.string().optional(),
    original_content: z.string().optional(),
    bias_category: z.string().optional(),
    language: z.string().optional(),
    document_id: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

enum BiasCategory {
    GENDER = 'GENDER',
    RACE_ETHNICITY = 'RACE_ETHNICITY',
    AGE = 'AGE',
    DISABILITY = 'DISABILITY',
    RELIGION = 'RELIGION',
    NATIONALITY = 'NATIONALITY',
    SOCIOECONOMIC = 'SOCIOECONOMIC',
    NONE = 'NONE'
}

export const annotateSentenceSchema = z.object({
    bias_category: z.nativeEnum(BiasCategory),
})

export const biasCategorySchema = z.nativeEnum(BiasCategory);

export type BiasCategoryType = z.infer<typeof biasCategorySchema>;

export type SentenceSchema = z.infer<typeof sentenceSchema>;

export type AnnotateSentenceSchema = z.infer<typeof annotateSentenceSchema>;