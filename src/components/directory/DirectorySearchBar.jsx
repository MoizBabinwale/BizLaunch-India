import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";

import { getCategories, getCities } from "../../api/directoryApi";

/**
 * The two field search used in the site header and on the home page hero.
 * Submitting pushes `?q=` and `?city=` into /explore, which is the single
 * place where listing filters are applied.
 *
 * Cities and category suggestions come from the API so the dropdown only ever
 * offers things that actually exist in the directory.
 */
export default function DirectorySearchBar({
  initialQuery = "",
  initialCity = "",
  size = "lg",
  className = "",
}) {
  const navigate = useNavigate();
  const [term, setTerm] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => setTerm(initialQuery), [initialQuery]);
  useEffect(() => setCity(initialCity), [initialCity]);

  useEffect(() => {
    getCities()
      .then((result) => setCities(result.cities || []))
      .catch(() => setCities([]));

    getCategories()
      .then((result) =>
        setActiveCategories(
          (result.categories || []).filter((item) => item.count > 0)
        )
      )
      .catch(() => setActiveCategories([]));
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const height = size === "lg" ? "h-14" : "h-12";
  const icon = size === "lg" ? 20 : 18;

  const go = (nextTerm, nextCity) => {
    const params = new URLSearchParams();

    if (nextTerm.trim()) params.set("q", nextTerm.trim());
    if (nextCity.trim()) params.set("city", nextCity.trim());

    setOpen(false);
    navigate(`/explore${params.toString() ? `?${params}` : ""}`);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    go(term, city);
  };

  // Suggestions mix categories and popular searches so a half typed word
  // always leads somewhere useful.
  const matches = (text) =>
    text.toLowerCase().includes(term.trim().toLowerCase());

  const suggestions = term.trim()
    ? [
        ...activeCategories
          .filter((item) => matches(item.name))
          .map((item) => ({
            label: item.name,
            kind: "Category",
            count: item.count,
          })),
        ...cities
          .filter((item) => matches(item.name))
          .map((item) => ({
            label: item.name,
            kind: "City",
            count: item.count,
            goCity: true,
          })),
      ].slice(0, 8)
    : activeCategories.slice(0, 8).map((item) => ({
        label: item.name,
        kind: "Category",
        count: item.count,
      }));

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2 rounded-[30px] border border-slate-200 bg-white/90 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:flex-row sm:items-center"
      >
        <label className="flex flex-1 items-center gap-2 rounded-full bg-slate-50 px-4 shadow-inner shadow-slate-200/50">
          <Search size={icon} className="shrink-0 text-primary" />
          <input
            value={term}
            onFocus={() => setOpen(true)}
            onChange={(event) => setTerm(event.target.value)}
            className={`w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0 ${height}`}
            placeholder="Search for a business, service or product"
            aria-label="Search businesses"
          />
        </label>

        <span className="hidden w-px self-stretch bg-slate-200 sm:block" />

        <label className="flex items-center gap-2 rounded-full bg-slate-50 px-4 shadow-inner shadow-slate-200/50 sm:w-48">
          <MapPin size={icon} className="shrink-0 text-primary" />
          <input
            list="directory-cities"
            value={city}
            onFocus={() => setOpen(true)}
            onChange={(event) => setCity(event.target.value)}
            className={`w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0 ${height}`}
            placeholder="City"
            aria-label="City"
          />
        </label>

        <button
          type="submit"
          className={`rounded-full bg-slate-900 px-6 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary ${height}`}
        >
          Search
        </button>
      </form>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close suggestions"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
            <p className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
              {term.trim()
                ? "Matching categories and cities"
                : "Browse categories"}
            </p>
            {suggestions.map((item) => (
              <button
                key={`${item.kind}-${item.label}`}
                type="button"
                onClick={() =>
                  item.goCity ? go("", item.label) : go(item.label, city)
                }
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-text-secondary transition hover:bg-primary-sky hover:text-primary"
              >
                <span className="truncate">{item.label}</span>
                <span className="shrink-0 text-xs text-muted">
                  {item.count} {item.kind === "City" ? "listed" : item.kind}
                </span>
              </button>
            ))}
            {!suggestions.length && (
              <p className="px-4 py-3 text-sm text-muted">
                {term.trim()
                  ? "No matching category or city"
                  : "No categories have listings yet"}
              </p>
            )}
          </div>
        </>
      )}

      <datalist id="directory-cities">
        {cities.map((item) => (
          <option key={item.name} value={item.name} />
        ))}
      </datalist>
    </div>
  );
}
