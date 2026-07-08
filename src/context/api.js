import API_BASE_URL from "../config/baseURL";

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : { message: await response.text() };

  if (!response.ok) {
    // Use the error message from the server's JSON response if available
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // Important for sending cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  return parseResponse(response);
};
