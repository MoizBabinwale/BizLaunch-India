import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, MapPin, PlusCircle, SlidersHorizontal, X } from "lucide-react";

import BusinessCard, {
  BusinessCardSkeleton,
  EmptyState,
} from "../components/directory/BusinessCard";
import FilterSidebar from "../components/directory/FilterSidebar";
import Pagination from "../components/directory/Pagination";
import DirectorySearchBar from "../components/directory/DirectorySearchBar";
import { SORT_OPTIONS } from "../config/directory";
import { getCategories, getCities, searchBusinesses } from "../api/directoryApi";

const PER_PAGE = 12;

const readFilters = (params) => ({
  q: params.get("q") || "",
  category: params.get("category") || "",
  city: params.get("city") || "",
  area: params.get("area") || "",
  postalCode: params.get("postalCode") || "",
  minRating: params.get("minRating") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  maxDistance: params.get("maxDistance") || "",
  latitude: params.get("latitude") || "",
  longitude: params.get("longitude") || "",
  openNow: params.get("openNow") || "",
  verified: params.get("verified") || "",
  homeService: params.get("homeService") || "",
  shopAppointment: params.get("shopAppointment") || "",
  availableNow: params.get("availableNow") || "",
  sort: params.get("sort") || "relevance",
  page: Math.max(1, Number(params.get("page") || 1)),
});

export default function BusinessList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);

  const [result, setResult] = useState({
    businesses: [],
    total: 0,
    totalPages: 1,
  });
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  useEffect(() => {
    getCategories()
      .then((response) => setCategories(response.categories || []))
      .catch(() => setCategories([]));

    getCities()
      .then((response) => setCities(response.cities || []))
      .catch(() => setCities([]));
  }, []);

  const load = useCallback(() => {
    setLoading(true);

    searchBusinesses({
      q: filters.q,
      category: filters.category,
      city: filters.city,
      area: filters.area,
      postalCode: filters.postalCode,
      minRating: filters.minRating,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      maxDistance: filters.maxDistance,
      latitude: filters.latitude,
      longitude: filters.longitude,
      openNow: filters.openNow,
      verified: filters.verified,
      homeService: filters.homeService,
      shopAppointment: filters.shopAppointment,
      availableNow: filters.availableNow,
      sort: filters.sort,
      page: filters.page,
      limit: PER_PAGE,
    })
      .then((response) =>
        setResult({
          businesses: response.businesses || [],
          total: response.total || 0,
          totalPages: response.totalPages || 1,
        })
      )
      .catch(() => setResult({ businesses: [], total: 0, totalPages: 1 }))
      .finally(() => setLoading(false));
  }, [
    filters.q,
    filters.category,
    filters.city,
    filters.area,
    filters.postalCode,
    filters.minRating,
    filters.minPrice,
    filters.maxPrice,
    filters.maxDistance,
    filters.latitude,
    filters.longitude,
    filters.openNow,
    filters.verified,
    filters.homeService,
    filters.shopAppointment,
    filters.availableNow,
    filters.sort,
    filters.page,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  // Any filter change returns the user to page 1 of the results.
  const apply = (patch) => {
    const next = { ...filters, ...patch };

    setSearchParams(
      {
        ...(next.q ? { q: next.q } : {}),
        ...(next.category ? { category: next.category } : {}),
        ...(next.city ? { city: next.city } : {}),
        ...(next.area ? { area: next.area } : {}),
        ...(next.postalCode ? { postalCode: next.postalCode } : {}),
        ...(next.minRating ? { minRating: next.minRating } : {}),
        ...(next.minPrice ? { minPrice: next.minPrice } : {}),
        ...(next.maxPrice ? { maxPrice: next.maxPrice } : {}),
        ...(next.maxDistance ? { maxDistance: next.maxDistance } : {}),
        ...(next.latitude ? { latitude: next.latitude } : {}),
        ...(next.longitude ? { longitude: next.longitude } : {}),
        ...(next.openNow ? { openNow: next.openNow } : {}),
        ...(next.verified ? { verified: next.verified } : {}),
        ...(next.homeService ? { homeService: next.homeService } : {}),
        ...(next.shopAppointment ? { shopAppointment: next.shopAppointment } : {}),
        ...(next.availableNow ? { availableNow: next.availableNow } : {}),
        ...(next.sort && next.sort !== "relevance"
          ? { sort: next.sort }
          : {}),
        ...(next.page > 1 ? { page: next.page } : {}),
      },
      { replace: true }
    );
  };

  const reset = () => setSearchParams({}, { replace: true });

  const activeChips = [
    filters.q && { label: `Search: ${filters.q}`, key: "q" },
    filters.category && { label: filters.category, key: "category" },
    filters.city && { label: filters.city, key: "city" },
    filters.area && { label: `Area: ${filters.area}`, key: "area" },
    filters.postalCode && { label: `PIN: ${filters.postalCode}`, key: "postalCode" },
    filters.minRating && {
      label: `${filters.minRating}.0 & above`,
      key: "minRating",
    },
    filters.minPrice && { label: `From ₹${filters.minPrice}`, key: "minPrice" },
    filters.maxPrice && { label: `Up to ₹${filters.maxPrice}`, key: "maxPrice" },
    filters.openNow && { label: "Open now", key: "openNow" },
    filters.verified && { label: "Verified", key: "verified" },
    filters.homeService && { label: "Home service", key: "homeService" },
    filters.shopAppointment && { label: "Shop appointment", key: "shopAppointment" },
    filters.availableNow && { label: "Appointment available today", key: "availableNow" },
  ].filter(Boolean);

  const heading = filters.category
    ? `${filters.category} in ${filters.city || "India"}`
    : filters.q
    ? `Results for "${filters.q}"`
    : filters.city
    ? `Businesses in ${filters.city}`
    : filters.area
    ? `Businesses around ${filters.area}`
    : "All businesses";

  const sidebar = (
    <FilterSidebar
      filters={filters}
      categories={categories}
      cities={cities}
      onToggleCategory={(category) => apply({ category, page: 1 })}
      onSetCity={(city) => apply({ city, page: 1 })}
      onSetRating={(minRating) => apply({ minRating, page: 1 })}
      onSetFilter={(key, value) => apply({ [key]: value, page: 1 })}
      onReset={reset}
      resultCount={result.total}
      locationAvailable={Boolean(filters.latitude && filters.longitude)}
    />
  );

  return (
    <>
      <Helmet>
        <title>{heading} | BizLaunch India</title>
        <meta
          name="description"
          content={`Browse ${result.total} ${heading.toLowerCase()} listings on BizLaunch India. Compare ratings, timings and contact details.`}
        />
      </Helmet>

      <main className="bg-background">
        {/* SEARCH HEADER */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Explore the directory
            </p>
            <h1 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
              {heading}
            </h1>
            <p className="mt-2 text-text-secondary">
              {loading
                ? "Loading listings..."
                : `${result.total} ${
                    result.total === 1 ? "business" : "businesses"
                  } found`}
            </p>

            <div className="mt-6 max-w-3xl">
              <DirectorySearchBar
                initialQuery={filters.q}
                initialCity={filters.city}
                size="sm"
              />
            </div>
            {locationMessage && <p role="status" className="mt-3 text-sm text-amber-800">{locationMessage}</p>}
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* TOOLBAR */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => apply({ [chip.key]: "", page: 1 })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-primary hover:text-primary"
                >
                  {chip.label}
                  <X size={13} />
                </button>
              ))}

              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setLocationMessage("");
                  if (!navigator.geolocation) {
                    setLocationMessage("Location access is unavailable. Enter a city, area or PIN code instead.");
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    ({ coords }) => apply({
                      latitude: coords.latitude.toFixed(6),
                      longitude: coords.longitude.toFixed(6),
                      maxDistance: filters.maxDistance || "10",
                      sort: "nearest",
                      page: 1,
                    }),
                    () => setLocationMessage("Location permission was not granted. Enter a city, area or PIN code to search manually."),
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
                  );
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-primary"
              >
                <MapPin size={16} /> Use my location
              </button>
              <button
                type="button"
                onClick={() => setMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text-secondary lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={filters.sort}
                  disabled={filters.sort === "nearest" && !(filters.latitude && filters.longitude)}
                  onChange={(event) =>
                    apply({ sort: event.target.value, page: 1 })
                  }
                  className="rounded-xl border-border py-2.5 text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === "nearest" && !(filters.latitude && filters.longitude)}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <aside className="hidden lg:block">{sidebar}</aside>

            <div>
              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <BusinessCardSkeleton key={index} />
                  ))}
                </div>
              ) : result.businesses.length === 0 ? (
                <EmptyState
                  title="No businesses found"
                  message="Try removing a filter, searching a different keyword or picking another city."
                  action={
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={reset}
                        className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
                      >
                        <Filter size={16} className="mr-1.5 inline" />
                        Clear filters
                      </button>
                      <Link
                        to="/free-listing"
                        className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                      >
                        <PlusCircle size={16} className="mr-1.5 inline" />
                        List your business
                      </Link>
                    </div>
                  }
                />
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {result.businesses.map((business) => (
                      <BusinessCard key={business._id} business={business} />
                    ))}
                  </div>

                  <Pagination
                    page={filters.page}
                    totalPages={result.totalPages}
                    onChange={(page) => apply({ page })}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE FILTER DRAWER */}
        {mobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close filters"
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFilters(false)}
            />

            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFilters(false)}
                  className="rounded-lg p-1.5 text-muted hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {sidebar}

              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="mt-4 w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-white"
              >
                Show {result.total} results
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
