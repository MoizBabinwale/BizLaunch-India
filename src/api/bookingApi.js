import { api } from "./index";

const query = (params) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== "") {
      search.set(key, String(value));
    }
  });
  return search.toString();
};

export const getBookingBusiness = (businessId) =>
  api(`/businesses/public/${businessId}`);

export const getBookingServices = (businessId) =>
  api(`/businesses/public/${businessId}/services`);

export const getAvailability = (businessId, params) =>
  api(`/businesses/public/${businessId}/availability?${query(params)}`);

export const createBooking = (payload) =>
  api("/bookings", { method: "POST", body: JSON.stringify(payload) });

export const getMyBookings = () => api("/bookings/my");

export const getBooking = (id) => api(`/bookings/${id}`);

export const cancelBooking = (id) =>
  api(`/bookings/${id}/cancel`, { method: "PATCH", body: JSON.stringify({}) });

export const getBusinessBookings = () => api("/business/bookings");

export const updateBusinessBooking = (id, payload) =>
  api(`/business/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
