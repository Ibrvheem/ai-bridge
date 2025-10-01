import { z } from "zod";

export const languageSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, "Language name is required"),
    native_name: z.string().min(1, "Native name is required"),
    code: z.string().min(2, "Language code must be at least 2 characters").max(3, "Language code must be at most 3 characters"),
    isActive: z.boolean(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    __v: z.number().optional(),
});

export const createLanguageSchema = z.object({
    name: z.string().min(1, "Language name is required"),
    native_name: z.string().min(1, "Native name is required"),
    code: z.string().min(2, "Language code must be at least 2 characters").max(3, "Language code must be at most 3 characters"),
    isActive: z.boolean(),
});

export const updateLanguageSchema = createLanguageSchema.partial();

export const languageFormSchema = z.object({
    name: z.string().min(1, "Language name is required"),
    native_name: z.string().min(1, "Native name is required"),
    code: z.string().min(2, "Language code must be at least 2 characters").max(3, "Language code must be at most 3 characters"),
    isActive: z.boolean(),
});

export const languagesArraySchema = z.array(languageSchema);

export const languageResponseSchema = z.object({
    success: z.boolean(),
    data: languageSchema,
    message: z.string().optional(),
});

export const languagesResponseSchema = z.object({
    success: z.boolean(),
    data: languagesArraySchema,
    message: z.string().optional(),
});

export const errorResponseSchema = z.object({
    success: z.literal(false),
    error: z.string(),
    message: z.string().optional(),
});

export type Language = z.infer<typeof languageSchema>;
export type CreateLanguage = z.infer<typeof createLanguageSchema>;
export type UpdateLanguage = z.infer<typeof updateLanguageSchema>;
export type LanguageForm = z.infer<typeof languageFormSchema>;
export type Languages = z.infer<typeof languagesArraySchema>;
export type LanguageResponse = z.infer<typeof languageResponseSchema>;
export type LanguagesResponse = z.infer<typeof languagesResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;