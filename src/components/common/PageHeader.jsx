import React from "react";

const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="mb-8 border-b border-border pb-5 sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-primary">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="mt-4 flex sm:mt-0 sm:ml-4">{actions}</div>}
    </div>
  );
};

export default PageHeader;
