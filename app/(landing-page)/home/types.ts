import z from "zod";

export const findDetectionPayload = z.object({
    text: z.string().min(1, "Text is required"),
})
export type FindDetectionPayload = z.infer<typeof findDetectionPayload>;