import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import Input from "../common/Input";
import Spinner from "../common/Spinner";

const ServiceForm = ({ onSubmit, initialData = {}, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    ...initialData,
  });

  useEffect(() => {
    setFormData({ name: "", price: "", description: "", ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary">
          Service Name
        </label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-text-primary">
          Pricing (e.g., "₹500/hr" or "Starts at ₹10,000")
        </label>
        <Input id="price" name="price" value={formData.price} onChange={handleChange} required disabled={loading} />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          className="block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : initialData.id ? "Update Service" : "Add Service"}
        </Button>
      </div>
    </form>
  );
};

ServiceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    price: PropTypes.string,
    description: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

export default ServiceForm;
