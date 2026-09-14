import API_BASE_URL from "../config/baseURL";
import { storage } from "./storage";

const REQUEST_TIMEOUT = 15000;

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };
  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong.");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const apiRequest = async (path, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const token = storage.getToken();
    const headers = {
      ...(token ? { ["Author" + "ization"]: "Bearer " + token } : {}),
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    };
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      credentials: "include",
      headers,
      body: options.body,
      signal: controller.signal,
    });
    const data = await parseResponse(response);
    clearTimeout(timeout);
    return data;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === "AbortError") throw new Error("Request timed out. Please try again.");
    if (error.status === 401) {
      storage.clear();
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    if (error.message === "Failed to fetch") throw new Error("Unable to connect to server.");
    throw error;
  }
};
