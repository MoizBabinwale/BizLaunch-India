import React from "react";

const SectionTitle = ({ eyebrow, title, description, centered = true }) => {
  return (
    <div className={`section-heading ${centered ? "text-center" : ""}`}>
      {eyebrow && <span className="font-semibold uppercase tracking-wider text-primary">{eyebrow}</span>}
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">{description}</p>}
    </div>
  );
};

export default SectionTitle;
