"use client";
import { useForm } from "react-hook-form";

export function useLoginForm() {
  const form = useForm({});
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(() => {
    try {
      console.log("Handle Logic here");
    } catch (error) {
      console.error(error);
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting,
  };
}
