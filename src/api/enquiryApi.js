import { api } from "./index";

export const submitEnquiry = (slug, enquiry) =>
  api(`/businesses/slug/${slug}/enquiries`, {
    method: "POST",
    body: JSON.stringify(enquiry),
  });

export const getMyEnquiries = () => api("/businesses/me/enquiries");

export const updateEnquiryStatus = (id, status) =>
  api(`/businesses/me/enquiries/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
