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
  onSetFilter,
  onReset,
  resultCount,
  locationAvailable = false,
}) {
  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    ["openNow", "verified", "homeService", "shopAppointment", "availableNow"].filter((key) => filters[key]).length +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.maxDistance ? 1 : 0);

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

      <FilterGroup title="Area or PIN">
        <label className="block text-xs font-medium text-muted">Area / neighbourhood
          <input value={filters.area} onChange={(event) => onSetFilter("area", event.target.value)} className="mt-1 w-full rounded-lg border-border text-sm" placeholder="e.g. Vijay Nagar" />
        </label>
        <label className="block text-xs font-medium text-muted">PIN code
          <input inputMode="numeric" maxLength={6} value={filters.postalCode} onChange={(event) => onSetFilter("postalCode", event.target.value.replace(/\D/g, ""))} className="mt-1 w-full rounded-lg border-border text-sm" placeholder="6-digit PIN" />
        </label>
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

      <FilterGroup title="Price range">
        <label className="block text-xs font-medium text-muted">
          Minimum price (₹)
          <input type="number" min="0" value={filters.minPrice} onChange={(event) => onSetFilter("minPrice", event.target.value)} className="mt-1 w-full rounded-lg border-border text-sm" />
        </label>
        <label className="block text-xs font-medium text-muted">
          Maximum price (₹)
          <input type="number" min="0" value={filters.maxPrice} onChange={(event) => onSetFilter("maxPrice", event.target.value)} className="mt-1 w-full rounded-lg border-border text-sm" />
        </label>
      </FilterGroup>

      <FilterGroup title="Availability">
        {[
          ["openNow", "Open now"],
          ["verified", "Verified businesses"],
          ["homeService", "Home service"],
          ["shopAppointment", "Shop appointment"],
          ["availableNow", "Appointment available today"],
        ].map(([key, label]) => (
          <FilterOption key={key} checked={Boolean(filters[key])} onChange={() => onSetFilter(key, filters[key] ? "" : "true")} label={label} />
        ))}
      </FilterGroup>

      <FilterGroup title="Distance">
        <label className="block text-xs font-medium text-muted">
          Maximum distance
          <select value={filters.maxDistance} disabled={!locationAvailable} onChange={(event) => onSetFilter("maxDistance", event.target.value)} className="mt-1 w-full rounded-lg border-border text-sm disabled:bg-slate-100">
            <option value="">Any distance</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
            <option value="100">Within 100 km</option>
          </select>
        </label>
        {!locationAvailable && <p className="text-xs text-muted">Allow location access or enter a city/area. Exact distance appears only when shop coordinates are available.</p>}
      </FilterGroup>

      <p className="mt-4 border-t border-border pt-4 text-xs text-muted">
        Showing {resultCount} matching {resultCount === 1 ? "listing" : "listings"}
      </p>
    </div>
  );
}
