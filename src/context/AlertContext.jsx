import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const showAlert = useCallback(
    ({
      type = "success",
      title = "",
      message = "",
      duration = 4000,
    }) => {
      setAlert({
        open: true,
        type,
        title,
        message,
      });

      if (duration > 0) {
        setTimeout(() => {
          setAlert((prev) => ({
            ...prev,
            open: false,
          }));
        }, duration);
      }
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alert,
        showAlert,
        hideAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }

  return context;
};

export default AlertContext;