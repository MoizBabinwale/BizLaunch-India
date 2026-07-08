import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Input from "../ui/Input.jsx"; // Assuming you have a common Input component
import Button from "../ui/Button.jsx"; // Assuming you have a common Button component

const LoginForm = ({ onSubmit, loading, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && <div className="text-red-500 text-sm text-center">{errorMessage}</div>}
      <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" isLoading={loading} disabled={loading} className="w-full">
        Login
      </Button>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};
export default LoginForm;
