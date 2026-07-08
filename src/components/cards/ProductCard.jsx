nowimport React from "react";
import PropTypes from "prop-types";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatter.js";
import Button from "../common/Button";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
      <div>
        <div className="flex items-start justify-between">
          <h4 className="font-display font-semibold text-text-primary">{product.name}</h4>
          <p className="font-semibold text-primary">{formatCurrency(parseFloat(product.price))}</p>
        </div>
        <p className="mt-2 text-sm text-muted line-clamp-3">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-end space-x-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Pencil size={14} className="mr-2" />
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(product.id)}>
          <Trash2 size={14} className="mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductCard;
