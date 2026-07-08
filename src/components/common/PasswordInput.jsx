import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

const PasswordInput = React.forwardRef(({ className = "", ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input ref={ref} type={showPassword ? "text" : "password"} className={`pr-10 ${className}`} {...props} />
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-text-primary">
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
