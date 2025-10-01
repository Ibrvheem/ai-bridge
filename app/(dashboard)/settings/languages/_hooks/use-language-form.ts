import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateLanguage, createLanguageSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLanguage, revalidateLanguages } from "../service";
import { toast } from "sonner";



export function useLanguageForm() {
    const [open, setOpen] = useState(false);
    const form = useForm<CreateLanguage>({
        resolver: zodResolver(createLanguageSchema),
        defaultValues: {
            isActive: true
        }
    })
    const { handleSubmit, formState: { isSubmitting } } = form;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = createLanguage(data)
            toast.success("Language added successfully")
            setOpen(false)
            revalidateLanguages()
            return response
        } catch (error) {
            toast.error("Failed to add language")
            return error

        }

    });


    return {
        onSubmit,
        isSubmitting,
        form,
        open,
        setOpen

    }

}

