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