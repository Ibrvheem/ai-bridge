"use client"
import { toast } from "sonner"
import { deleteLanguage, revalidateLanguages } from "../service"
import { useState } from "react"


export function useDeleteLanguage(languageId: string) {
    const [loading, setLoading] = useState(false)
    async function handleDelete() {
        try {
            setLoading(true)
            const response = await deleteLanguage(languageId)
            revalidateLanguages()
            toast.success("Language deleted successfully")
            return response
        } catch (error) {
            toast.error("Failed to delete language")
            return error

        } finally {
            setLoading(false)
        }
    }
    return {
        loading,
        handleDelete
    }
}