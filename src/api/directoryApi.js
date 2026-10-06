import { api } from "./index";

const query = (params = {}) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      search.set(key, String(value).trim());
    }
  });

  const string = search.toString();

  return string ? `?${string}` : "";
};

export const getStats = () => api("/businesses/public/stats");

export const getCategories = (params) =>
  api(`/businesses/public/categories${query(params)}`);

export const getCities = () => api("/businesses/public/cities");

export const searchBusinesses = (params) =>
  api(`/businesses/public${query(params)}`);

export const getBusiness = (slug) => api(`/businesses/slug/${slug}`);

export const getSimilarBusinesses = (slug) =>
  api(`/businesses/slug/${slug}/similar`);

export const getReviews = (slug, params) =>
  api(`/businesses/slug/${slug}/reviews${query(params)}`);

export const submitReview = (slug, review) =>
  api(`/businesses/slug/${slug}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });

export const submitEnquiry = (slug, enquiry) =>
  api(`/businesses/slug/${slug}/enquiries`, {
    method: "POST",
    body: JSON.stringify(enquiry),
  });

export const submitContactMessage = (payload) =>
  api("/leads/contact", { method: "POST", body: JSON.stringify(payload) });

export const submitFreeListingRequest = (payload) =>
  api("/businesses/free-listing-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
