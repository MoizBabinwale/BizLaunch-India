import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import AlertPopup from "../common/AlertPopup";
import Spinner from "../common/Spinner";

const RegisterForm = ({ onSubmit, error, loading }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <AlertPopup type="danger" title="Registration Failed" message={error} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary">
          Full Name
        </label>
        <div className="mt-1">
          <Input id="name" name="name" type="text" autoComplete="name" required value={formData.name} onChange={handleChange} disabled={loading} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary">
          Email address
        </label>
        <div className="mt-1">
          <Input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} disabled={loading} />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary">
          Password
        </label>
        <div className="mt-1">
          <PasswordInput id="password" name="password" autoComplete="new-password" required value={formData.password} onChange={handleChange} disabled={loading} />
        </div>
      </div>

      <div>
        <Button type="submit" className="flex w-full justify-center" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Create Account"}
        </Button>
      </div>
    </form>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

export default RegisterForm;
