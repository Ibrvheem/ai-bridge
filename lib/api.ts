/* eslint-disable @typescript-eslint/no-explicit-any */
const url = process.env.BASE_URL;
// const url = process.env.NEXT_PUBLIC_DATA_API_HOST;
const getAuthHeader = async () => {
  return {
    Authorization: `Bearer ${""}`,
    "Bypass-Tunnel-Reminder": "Bypass-Tunnel-Reminder",
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      return { message: "Network response was not ok" };
    });
    return { ...errorData, status: response.status };
  }
  return response.json().catch(() => {
    return { message: "Response was not JSON" };
  });
};

export const api = {
  get: async (endpoint: string, params?: any) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "Bypass-Tunnel-Reminder",
      },
      cache: "no-store",
      ...params,
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, payload: any) => {
    const headers = await getAuthHeader();
    console.log(`${url}/${endpoint}`);
    const response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  put: async (endpoint: string, payload: any) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  patch: async (endpoint: string, payload: any) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  formData: async (endpoint: string, formData: FormData) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: formData,
    });
    return handleResponse(response);
  },
};

export default api;
