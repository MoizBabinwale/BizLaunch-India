/**
 * Formats a number into the Indian Rupee currency format.
 * e.g., 1234567 -> ₹ 12,34,567.00
 * @param {number} amount - The amount to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    return "";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};
