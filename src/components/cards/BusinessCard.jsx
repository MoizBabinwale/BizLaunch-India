import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BusinessCard = ({ business }) => {
  if (!business) return null;

  return (
    <div className="overflow-hidden rounded-lg bg-card shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-text-primary">{business.name}</h3>
        <p className="mt-1 text-sm text-text-secondary">{business.tagline}</p>
        <p className="mt-4 text-sm text-muted line-clamp-2">{business.description}</p>
      </div>
      <div className="border-t border-border bg-background/50 px-6 py-3">
        <Link to={`/business/${business.slug}`} className="flex items-center justify-between text-sm font-semibold text-primary hover:text-primary-dark">
          <span>View Public Page</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

BusinessCard.propTypes = {
  business: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tagline: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default BusinessCard;
