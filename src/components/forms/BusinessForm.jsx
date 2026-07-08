import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import Input from "../common/Input";
import Spinner from "../common/Spinner";

const BusinessForm = ({ onSubmit, initialData = {}, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    phone: "",
    address: "",
    ...initialData,
  });

  useEffect(() => {
    setFormData({
      name: "",
      tagline: "",
      description: "",
      phone: "",
      address: "",
      ...initialData,
    });
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
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-card p-8 shadow">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary">
            Business Name
          </label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-text-primary">
            Tagline
          </label>
          <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} disabled={loading} />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-primary">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            className="block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text-primary">
            Phone Number
          </label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} disabled={loading} />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-text-primary">
            Address
          </label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} disabled={loading} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

BusinessForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    tagline: PropTypes.string,
    description: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

export default BusinessForm;
