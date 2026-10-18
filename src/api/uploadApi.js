import API_BASE_URL from "../config/baseURL";
import { api } from "./index";

export const uploadImage = async (file) => {
  const body = new FormData();
  body.append("image", file);
  const result = await api("/uploads/images", { method: "POST", body });
  return new URL(result.url, API_BASE_URL).href;
};