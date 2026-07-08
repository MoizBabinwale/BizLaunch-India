import React from "react";
import PropTypes from "prop-types";

const baseClasses = "inline-flex items-center justify-center rounded-lg font-display font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";

const variantClasses = {
  solid: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
  outline: "border-2 border-primary text-primary hover:bg-primary-sky focus:ring-primary",
  danger: "bg-danger text-white hover:bg-red-700 focus:ring-danger",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const Button = ({ children, variant = "solid", size = "md", className = "", ...props }) => {
  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], props.disabled ? "opacity-50 cursor-not-allowed" : "", className].join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["solid", "outline", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export default Button;
