import API_BASE_URL from "../config/baseURL";

const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const api = async (
  endpoint,
  { method = "GET", body, headers = {} } = {}
) => {
  const token = sessionStorage.getItem("token");

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    body,
  });

  return parseResponse(response);
};