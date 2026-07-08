import React from "react";
import PropTypes from "prop-types";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";

const alertConfig = {
  success: { icon: CheckCircle, classes: "bg-green-50 border-green-400 text-green-800" },
  warning: { icon: AlertCircle, classes: "bg-yellow-50 border-yellow-400 text-yellow-800" },
  danger: { icon: XCircle, classes: "bg-red-50 border-red-400 text-red-800" },
  info: { icon: Info, classes: "bg-blue-50 border-blue-400 text-blue-800" },
};

const CommonAlert = ({ type = "info", title, message }) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-md border p-4 ${config.classes}`}>
      <div className="flex">
        <div className="flex-shrink-0"><Icon className="h-5 w-5" aria-hidden="true" /></div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && <div className="mt-2 text-sm">{message}</div>}
        </div>
      </div>
    </div>
  );
};

CommonAlert.propTypes = {
  type: PropTypes.oneOf(["success", "warning", "danger", "info"]),
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default CommonAlert;