import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "../ui/Input.jsx"; // Assuming you have a common Input component
import Button from "../ui/Button.jsx"; // Assuming you have a common Button component

const RegisterForm = ({ onSubmit, loading, errorMessage }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(errorMessage || localError) && <div className="text-red-500 text-sm text-center">{errorMessage || localError}</div>}
      <Input id="name" label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Input id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <Button type="submit" isLoading={loading} disabled={loading} className="w-full">
        Register
      </Button>
    </form>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default RegisterForm;
