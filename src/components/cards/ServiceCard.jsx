import React from "react";
import PropTypes from "prop-types";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../common/Button";

const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
      <div>
        <div className="flex items-start justify-between">
          <h4 className="font-display font-semibold text-text-primary">{service.name}</h4>
          <p className="font-semibold text-primary">{service.price}</p>
        </div>
        <p className="mt-2 text-sm text-muted line-clamp-3">{service.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-end space-x-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
          <Pencil size={14} className="mr-2" />
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(service.id)}>
          <Trash2 size={14} className="mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ServiceCard;
