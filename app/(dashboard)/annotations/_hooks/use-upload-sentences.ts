"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { uploadSentences } from "../services"

const uploadSchema = z.object({
    language: z.string().optional(),
})

type UploadFormData = z.infer<typeof uploadSchema>

export function useUploadSentences() {
    const [file, setFile] = useState<File | null>(null)
    const [open, setOpen] = useState(false)

    const form = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            language: "",
        }
    })

    const { handleSubmit, formState: { isSubmitting } } = form

    const onSubmit = handleSubmit(async (data) => {
        if (!file) {
            toast.error("Please select a file to upload")
            return
        }

        try {
            const formData = new FormData()
            formData.append("file", file)

            if (data.language) {
                formData.append("language", data.language)
            }

            console.log("Uploading file:", file.name)
            console.log("Language:", data.language)

            const response = await uploadSentences(formData)

            console.log(response)

            toast.success("File uploaded successfully!")
            setOpen(false)
            setFile(null)

            form.reset()
            return response
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload file")
        }
    })

    return {
        form,
        file,
        setFile,
        onSubmit,
        open,
        setOpen,
        isSubmitting
    }
}