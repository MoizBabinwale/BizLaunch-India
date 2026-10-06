import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import { RATING_FILTERS } from "../../config/directory";

/** Collapsible filter group, used for each facet in the sidebar. */
function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <ChevronDown
          size={18}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

const FilterOption = ({ checked, onChange, label, count }) => (
  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-secondary">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
    />
    <span className="flex-1">{label}</span>
    {count !== undefined && (
      <span className="text-xs text-muted">{count}</span>
    )}
  </label>
);

/**
 * Explore-page filters. Single-select per facet (category, city, rating) which
 * matches the search endpoint, and every change resets pagination.
 */
export default function FilterSidebar({
  filters,
  categories = [],
  cities = [],
  onToggleCategory,
  onSetCity,
  onSetRating,
  onReset,
  resultCount,
}) {
  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-text-primary">
          <SlidersHorizontal size={18} className="text-primary" />
          Filters
        </h2>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <X size={13} /> Clear ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title="Category">
        <FilterOption
          checked={!filters.category}
          onChange={() => onToggleCategory("")}
          label="All categories"
        />

        {categories.slice(0, 14).map((category) => (
          <FilterOption
            key={category.name}
            checked={filters.category === category.name}
            onChange={() =>
              onToggleCategory(
                filters.category === category.name ? "" : category.name
              )
            }
            label={category.name}
            count={category.count}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="City">
        <FilterOption
          checked={!filters.city}
          onChange={() => onSetCity("")}
          label="All cities"
        />

        {cities.map((city) => (
          <FilterOption
            key={city.name}
            checked={filters.city === city.name}
            onChange={() => onSetCity(filters.city === city.name ? "" : city.name)}
            label={city.name}
            count={city.count}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rating">
        {RATING_FILTERS.map((option) => (
          <FilterOption
            key={option.value}
            checked={Number(filters.minRating) === option.value}
            onChange={() =>
              onSetRating(
                Number(filters.minRating) === option.value ? 0 : option.value
              )
            }
            label={option.label}
          />
        ))}
      </FilterGroup>

      <p className="mt-4 border-t border-border pt-4 text-xs text-muted">
        Showing {resultCount} matching {resultCount === 1 ? "listing" : "listings"}
      </p>
    </div>
  );
}
