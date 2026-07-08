import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  const classes = `
    block w-full appearance-none rounded-md border border-border 
    px-3 py-2 placeholder-muted shadow-sm 
    focus:border-primary focus:outline-none focus:ring-primary 
    sm:text-sm
    ${className}
  `;

  return <input ref={ref} className={classes} {...props} />;
});

Input.displayName = "Input";
export default Input;
