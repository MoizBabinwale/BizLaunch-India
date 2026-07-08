import { useContext } from "react";
import { AlertContext } from "../context/AlertContext.jsx"; // Assuming you will create this context

/**
 * Custom hook for showing alerts.
 * @returns The alert context value (e.g., a function to trigger an alert).
 */
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
