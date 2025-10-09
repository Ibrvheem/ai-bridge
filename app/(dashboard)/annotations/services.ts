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

export async function uploadStats() {
    try {
        const response = await api.get('sentences/upload-stats', {
            tags: ['sentences']
        });
        return response;
    } catch (error) {
        console.error('Error fetching upload stats:', error);
        return { error: 'Failed to fetch upload stats' };
    }
}

export async function getUploadHistory() {
    try {
        const response = await api.get('sentences/upload-history', {
            tags: ['sentences']
        });
        return response;
    } catch (error) {
        console.error('Error fetching upload history:', error);
        return { error: 'Failed to fetch upload history' };
    }
}

export async function revalidateSentences() {
    await revalidateTag('sentences');
}