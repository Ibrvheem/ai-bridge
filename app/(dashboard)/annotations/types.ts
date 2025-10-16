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

