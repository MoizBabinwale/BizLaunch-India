import React from "react";
import PropTypes from "prop-types";

const StatsCard = ({ icon: Icon, value, label, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary bg-primary-sky",
    success: "text-success bg-green-100",
    warning: "text-warning bg-yellow-100",
    danger: "text-danger bg-red-100",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center">
        {Icon && (
          <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <p className="font-display text-2xl font-bold text-text-primary">{value}</p>
          <p className="text-sm font-medium text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["primary", "success", "warning", "danger"]),
};

export default StatsCard;
