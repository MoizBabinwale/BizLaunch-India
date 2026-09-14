import { api } from "./index";

export const getMyBusiness = () => api("/businesses/me");
export const createBusiness = (business) =>
  api("/businesses", { method: "POST", body: JSON.stringify(business) });
export const updateBusiness = (id, business) =>
  api(`/businesses/${id}`, { method: "PUT", body: JSON.stringify(business) });