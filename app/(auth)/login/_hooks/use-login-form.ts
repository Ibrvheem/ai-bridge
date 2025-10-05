"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "../services";
import { loginSchema } from "../types";

export function useLoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema)
  })
  const { handleSubmit, formState: { isSubmitting } } = form

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await login(values)
      console.log(response, 'response')

      if (response.access_token) {
        toast.success('Login Successful')
        window.location.href = '/annotations'

        return response

      } else {

        toast.error(response.message || response.error || 'Invalid credentials')
        return response
      }
    } catch (error: any) {
      toast.error(error.message || error.error || error || 'Something went wrong')
      return error
    }
  })

  return {
    form,
    onSubmit,
    isSubmitting
  }
}