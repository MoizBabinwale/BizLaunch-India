import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = "Are you sure?", message = "This action cannot be undone.", confirmText = "Confirm" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <AlertTriangle className="h-6 w-6 text-danger" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <p className="text-sm text-text-secondary">{message}</p>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button variant="danger" onClick={onConfirm} className="sm:ml-3">
          {confirmText}
        </Button>
        <Button variant="outline" onClick={onClose} className="mt-3 sm:mt-0">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
