import React from "react";

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

const Spinner = ({ size = "md", className = "" }) => {
  const classes = `
    animate-spin rounded-full border-2 border-primary-light border-t-primary
    ${sizeClasses[size]}
    ${className}
  `;

  return <div className={classes} role="status" />;
};

export default Spinner;
