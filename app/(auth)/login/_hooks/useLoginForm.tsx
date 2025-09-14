"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function useLoginForm() {
  const form = useForm({});
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { replace } = useRouter();
  const onSubmit = handleSubmit((values) => {
    try {
      console.log("Handle Logic here", values);
      replace("/playground");
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
