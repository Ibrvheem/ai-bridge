"use server"

import api from "@/lib/api"
import { revalidateTag } from "next/cache"
import { BiasCategoryType } from "./types";

export async function getUnannotatedSentences() {
    try {
        const response = await api.get('sentences/unannotated', {
            tags: ['sentences']
        });
        return response;
    } catch (error) {
        console.error('Error fetching sentences:', error);
        return { error: 'Failed to fetch sentences' };
    }
}

export async function getAnnotatedSentences() {
    try {
        const response = await api.get('sentences/annotated', {
            tags: ['sentences']
        });
        return response;
    } catch (error) {
        console.error('Error fetching sentences:', error);
        return { error: 'Failed to fetch sentences' };
    }
}

export async function annotateSentence(sentenceId: string, biasCategory: BiasCategoryType) {
    try {
        const response = await api.patch(`sentences/annotate/${sentenceId}`, {
            bias_category: biasCategory
        });

        revalidateTag('unannotated-sentences');
        return response;
    } catch (error) {
        console.error('Error annotating sentence:', error);
        return { success: false, error: 'Failed to annotate sentence' };
    }
}

export async function getBiasCategories() {
    try {
        const categories = await api.get('sentences/categories');
        return categories;
    } catch (error) {
        console.error('Error fetching bias categories:', error);
        return [];
    }
}
