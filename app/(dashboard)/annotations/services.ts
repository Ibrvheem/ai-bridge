"use server"

import api from "@/lib/api"

export async function uploadSentences(payload: FormData) {
    try {
        console.log(payload)
        const response = await api.formData('sentences/upload-csv', payload)
        console.log(response)
        return response
    } catch (error) {
        return error

    }
}