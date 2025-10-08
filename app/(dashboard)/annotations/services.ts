"use server"

import api from "@/lib/api"
import { revalidateTag } from "next/cache"

export async function uploadSentences(payload: FormData) {
    try {

        const response = await api.formData('sentences/upload-csv', payload)
        return response
    } catch (error) {
        return error

    }
}

export async function getSentences() {
    try {
        const response = await api.get('sentences', {
            tags: ['sentences']
        });
        return response;
    } catch (error) {
        console.error('Error fetching sentences:', error);
        return { error: 'Failed to fetch sentences' };
    }
}

export async function revalidateSentences() {
    await revalidateTag('sentences');
}