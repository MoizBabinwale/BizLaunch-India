import API_BASE_URL from "../config/baseURL";
import { storage } from "./storage";

const REQUEST_TIMEOUT = 15000;

// ===============================
// Parse Response
// ===============================
const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  let data = {};

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = {
      message: await response.text(),
    };
  }

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong.");

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

// ===============================
// API Request
// ===============================
export const apiRequest = async (path, options = {}) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const token = storage.getToken();

    const headers = {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...(options.body instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      credentials: "include",
      headers,
      body: options.body,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await parseResponse(response);

    return data;
  } catch (error) {
    clearTimeout(timeout);

    // Request Timeout
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    // Unauthorized
    if (error.status === 401) {
      storage.clear();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Network Error
    if (error.message === "Failed to fetch") {
      throw new Error("Unable to connect to server.");
    }

    throw error;
  }
};
