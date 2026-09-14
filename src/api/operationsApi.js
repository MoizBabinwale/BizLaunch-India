import { api } from "./index";

const request = (path, options) => api(`/operations/${path}`, options);

export const getMyBusiness = () => api("/businesses/me");
export const getOperationsDashboard = (businessId) =>
  request(`${businessId}/dashboard`);
export const listInventory = (businessId) =>
  request(`${businessId}/inventory`);
export const createInventory = (businessId, item) =>
  request(`${businessId}/inventory`, {
    method: "POST",
    body: JSON.stringify(item),
  });
export const listSales = (businessId) => request(`${businessId}/sales`);
export const createSale = (businessId, sale) =>
  request(`${businessId}/sales`, {
    method: "POST",
    body: JSON.stringify(sale),
  });
export const listCustomers = (businessId) =>
  request(`${businessId}/customers`);
export const listAppointments = (businessId) =>
  request(`${businessId}/appointments`);
export const createAppointment = (businessId, appointment) =>
  request(`${businessId}/appointments`, {
    method: "POST",
    body: JSON.stringify(appointment),
  });
