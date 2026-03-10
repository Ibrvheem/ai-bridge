"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signup } from "../services";
import { signupSchema, SignupSchema } from "../types";

export function useSignupForm() {
  const router = useRouter();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { confirmPassword, ...payload } = values;
      const response = await signup(payload);

      if (response.statusCode === 201 || response.id || response.success) {
        toast.success("Account created successfully! Please login.");
        router.push("/login");
        return response;
      } else {
        toast.error(
          response.message || response.error || "Failed to create account",
        );
        return response;
      }
    } catch (error: any) {
      toast.error(
        error.message || error.error || error || "Something went wrong",
      );
      return error;
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting,
  };
}
