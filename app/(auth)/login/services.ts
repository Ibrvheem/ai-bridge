"use server"
import api from "@/lib/api";
import { setAuthTokens } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { LoginSchema } from "./types";

export async function login(data: LoginSchema) {
    try {
        const response = await api.post('auth/signin', data)
        console.log(response, 'response from login service')
        // If login successful and we have tokens, set them in cookies
        if (response.access_token) {

            console.log('Login successful, setting auth tokens');
            await setAuthTokens({
                access_token: response.access_token,
                refresh_token: response.refresh_token
            });

            // Revalidate the auth state
            revalidatePath('/annotations');
            revalidatePath('/signin');

            return { ...response, redirectToDashboard: true };
        }

        return response
    } catch (error) {
        return error
    }
}