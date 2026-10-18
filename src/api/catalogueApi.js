import { api } from "./index";

const businessPath = (businessId, collection) =>
  `/businesses/${businessId}/${collection}`;

const sendJson = (method, body) => ({
  method,
  body: JSON.stringify(body),
});

export const listProducts = (businessId) =>
  api(businessPath(businessId, "products"));
export const createProduct = (businessId, product) =>
  api(businessPath(businessId, "products"), sendJson("POST", product));
export const updateProduct = (businessId, productId, product) =>
  api(`${businessPath(businessId, "products")}/${productId}`, sendJson("PUT", product));
export const deleteProduct = (businessId, productId) =>
  api(`${businessPath(businessId, "products")}/${productId}`, { method: "DELETE" });

export const listServices = (businessId) =>
  api(businessPath(businessId, "services"));
export const createService = (businessId, service) =>
  api(businessPath(businessId, "services"), sendJson("POST", service));
export const updateService = (businessId, serviceId, service) =>
  api(`${businessPath(businessId, "services")}/${serviceId}`, sendJson("PUT", service));
export const deleteService = (businessId, serviceId) =>
  api(`${businessPath(businessId, "services")}/${serviceId}`, { method: "DELETE" });
