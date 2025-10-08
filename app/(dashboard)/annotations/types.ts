import z from "zod";

export const uploadCSVSchema = z.object({
    file: z.instanceof(File).refine((file) =>
        file.type === "text/csv" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel",
        { message: "Invalid file type. Please upload a CSV, XLSX, or XLS file." }
    ),
    language: z.string(),
})

export const sentenceSchema = z.object({
    id: z.string(),
    sentence: z.string(),
    user: { email: z.string(), _id: z.string() },
    original_content: z.string().optional(),
    bias_category: z.string().optional(),
    language: z.string().optional(),
    document_id: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type SentenceSchema = z.infer<typeof sentenceSchema>;