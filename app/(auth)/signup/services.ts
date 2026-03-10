"use server";

import api from "@/lib/api";

export async function signup(data: { email: string; password: string }) {
  try {
    const response = await api.post("auth/signup", data);
    return response;
  } catch (error) {
    return error;
  }
}
