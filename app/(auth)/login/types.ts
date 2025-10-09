import z, { email } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})
export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),

})
export type LoginSchema = z.infer<typeof loginSchema>;
export type UserSchema = z.infer<typeof userSchema>;    