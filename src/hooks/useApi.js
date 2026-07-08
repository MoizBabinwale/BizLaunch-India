imamport { useState, useCallback } from "react";

/**
 * A custom hook for making API requests.
 * @param {function} apiFunc - The API function to call.
 * @returns An object with data, error, loading state, and a request function.
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return { success: true, data: result };
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, error, loading, request };
};