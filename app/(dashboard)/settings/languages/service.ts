"use server"

import api from "@/lib/api"
import { CreateLanguage } from "./types"
import { revalidateTag } from "next/cache"

export async function getLanguages() {
    try {
        const response = await api.get("language", {
            tags: ["languages"]
        })
        return response
    } catch (error) {
        return error
    };
}

export async function createLanguage(data: CreateLanguage) {
    try {
        const response = await api.post("language", data)
        return response

    } catch (error) {

        return error
    }

}
export async function deleteLanguage(id: string) {
    try {
        const response = await api.delete(`language/${id}`)
        return response

    } catch (error) {

        return error
    }

}
export async function revalidateLanguages() {
    revalidateTag("languages")
} 
