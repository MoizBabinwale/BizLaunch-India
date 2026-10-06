import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Handshake,
  Layers,
  MapPin,
  Phone,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import DirectorySearchBar from "../components/directory/DirectorySearchBar";
import BusinessCard from "../components/directory/BusinessCard";
import { categoryIcon, formatIndian } from "../utils/directory";
import {
  getCategories,
  getCities,
  getStats,
  searchBusinesses,
} from "../api/directoryApi";

const HIGHLIGHTS = [
  {
    icon: Search,
    title: "Search by need",
    description:
      "Type what you are looking for and get matched with listed local businesses in seconds.",
  },
  {
    icon: BadgeCheck,
    title: "Verified listings",
    description:
      "Every listing is checked by our onboarding team before it goes live.",
  },
  {
    icon: Phone,
    title: "Instant contact",
    description:
      "Call, WhatsApp or send an enquiry without filling long forms.",
  },
  {
    icon: TrendingUp,
    title: "Grows with you",
    description:
      "Track views, clicks and enquiries from a simple business dashboard.",
  },
];

const STEPS = [
  {
    title: "Search your neighbourhood",
    description:
      "Filter by category, city, rating and locality to shortlist the right businesses.",
  },
  {
    title: "Compare and review",
    description:
      "Read customer reviews, timings, prices and services before you call.",
  },
  {
    title: "Connect instantly",
    description:
      "Send an enquiry or call directly. No account needed to get in touch.",
  },
];

export default function HomeDiscovery() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getStats()
      .then((result) => setStats(result.stats || {}))
      .catch(() => setStats({}));

    getCategories()
      .then((result) => setCategories(result.categories || []))
      .catch(() => setCategories([]));

    getCities()
      .then((result) => setCities(result.cities || []))
      .catch(() => setCities([]));

    searchBusinesses({ sort: "rating", limit: 8 })
      .then((result) => setFeatured(result.businesses || []))
      .catch(() => setFeatured([]));
  }, []);

  const searchIn = (term) => {
    const params = new URLSearchParams();

    if (term) params.set("q", term);

    navigate(`/explore${params.toString() ? `?${params}` : ""}`);
  };

  // Only categories and cities that actually have listings are surfaced.
  const openCategories = categories.filter((item) => item.count > 0).slice(0, 12);
  const topCities = cities.slice(0, 20);
  const popularSearches = openCategories.slice(0, 6).map((item) => item.name);
  const hasListings = Number(stats.businesses) > 0;

  return (
    <>
      <Helmet>
        <title>
          BizLaunch India | Search Local Businesses, Services &amp; Stores Near You
        </title>
        <meta
          name="description"
          content="Search listed local businesses, services and stores across India. Browse by category and city, check timings and reviews, then call or send an enquiry."
        />
      </Helmet>

      <main className="overflow-hidden bg-background">
        {/* ---------------- HERO ---------------- */}
        <section className="relative border-b border-primary/10 bg-gradient-to-br from-primary-sky via-white to-blue-100">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles size={16} />
                One-Stop for All Local Businesses, Services &amp; Stores Nearby
                Across India
              </span>

              <h1 className="mt-7 font-display text-4xl font-extrabold leading-tight text-text-primary sm:text-6xl">
                Search across
                <span className="mx-2 text-primary">
                  {hasListings ? formatIndian(stats.businesses) : "listed"}
                </span>
                Businesses
              </h1>

              {hasListings ? (
                <p className="mt-3 text-2xl font-semibold text-text-secondary sm:text-3xl">
                  {formatIndian(stats.catalogue)} Products &amp; Services
                </p>
              ) : (
                <p className="mt-3 text-2xl font-semibold text-text-secondary sm:text-3xl">
                  Products &amp; Services
                </p>
              )}

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
                Find shops, restaurants, hospitals, service professionals and
                more in your city. Browse verified listings, check timings and
                reviews, then call or send an enquiry in a single click.
              </p>

              <div className="mx-auto mt-9 max-w-3xl">
                <DirectorySearchBar size="lg" />
              </div>

              {popularSearches.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-sm text-muted">Popular:</span>

                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => searchIn(term)}
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-primary hover:text-primary"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- QUICK ACTIONS ---------------- */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-3">
            {[
              {
                to: "/free-listing",
                icon: PlusCircle,
                title: "List my business for free",
                text: "Get discovered by customers searching in your area",
              },
              {
                to: "/advertise",
                icon: Zap,
                title: "Advertise with us",
                text: "Promote your brand at the top of search results",
              },
              // {
              //   to: "/download-app",
              //   icon: Download,
              //   title: "Download the app",
              //   text: "Search and manage enquiries on the go",
              // },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group flex items-start gap-4 rounded-2xl border border-border p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-sky text-primary">
                  <action.icon size={22} />
                </span>

                <span>
                  <span className="flex items-center gap-1.5 font-bold text-text-primary group-hover:text-primary">
                    {action.title}
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {action.text}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------------- CATEGORIES ---------------- */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Browse by category
              </p>
              <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
                Find exactly what you need
              </h2>
              <p className="mt-3 max-w-2xl text-text-secondary">
                Explore {stats.categories || categories.length} categories
                covering everyday services and specialist businesses.
              </p>
            </div>

            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-sky"
            >
              View all listings
              <ArrowRight size={16} />
            </Link>
          </div>

          {openCategories.length > 0 ? (
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {openCategories.map((category) => {
                const Icon = categoryIcon(category.name);

                return (
                  <Link
                    key={category.name}
                    to={`/explore?category=${encodeURIComponent(category.name)}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-sky text-primary transition group-hover:bg-primary group-hover:text-white">
                      <Icon size={22} />
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate font-bold text-text-primary group-hover:text-primary">
                        {category.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {category.count} {category.count === 1 ? "listing" : "listings"}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Restaurants", "Beauty & Salons", "Doctors", "Car & Auto Services"].map(
                (name) => {
                  const Icon = categoryIcon(name);

                  return (
                    <div
                      key={name}
                      className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-card p-4"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-sky text-primary">
                        <Icon size={22} />
                      </span>
                      <span className="font-bold text-text-primary">{name}</span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* ---------------- CITIES ---------------- */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Browse by location
            </p>
            <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
              Businesses in your city
            </h2>

            {topCities.length > 0 ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {topCities.map((city) => (
                  <Link
                    key={city.name}
                    to={`/explore?city=${encodeURIComponent(city.name)}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-text-secondary transition hover:border-primary hover:bg-primary-sky hover:text-primary"
                  >
                    <span className="truncate">{city.name}</span>
                    <span className="shrink-0 text-xs text-muted">
                      {city.count}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-text-secondary">
                No cities have listings yet. Once businesses start publishing,
                they will appear here.
              </p>
            )}
          </div>
        </section>

        {/* ---------------- FEATURED LISTINGS ---------------- */}
        {featured.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary">
                  Top rated
                </p>
                <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
                  Businesses people trust
                </h2>
              </div>

              <Link
                to="/explore?sort=rating"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-sky"
              >
                See all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((business) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          </section>
        )}

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
                Three steps to the right business
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- HIGHLIGHTS ---------------- */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-sky text-primary">
                  <item.icon size={24} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- NUMBERS ---------------- */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Layers,
                value: formatIndian(stats.businesses),
                label: "Businesses listed",
              },
              {
                icon: Handshake,
                value: formatIndian(stats.catalogue),
                label: "Products & services",
              },
              {
                icon: MapPin,
                value: formatIndian(stats.cities),
                label: "Cities covered",
              },
              {
                icon: Users,
                value: formatIndian(stats.views),
                label: "Total page views",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <stat.icon
                  className="mx-auto mb-3 text-blue-200 lg:mx-0"
                  size={28}
                />
                <p className="font-display text-4xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary-sky to-white p-10 text-center sm:p-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              <Star size={16} />
              Free listing for every business
            </span>

            <h2 className="mt-6 font-display text-3xl font-bold text-text-primary sm:text-4xl">
              Own a business? List it on BizLaunch India today
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Create a verified listing, add your products and services, and
              start receiving enquiries from customers searching in your city.
              No cost, no coding.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/free-listing"
                className="rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark"
              >
                List my business for free
              </Link>
              <Link
                to="/explore"
                className="rounded-xl border border-border bg-white px-6 py-3.5 font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
              >
                Explore businesses
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-success" /> Verified
                listings
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck size={16} className="text-success" /> No cost to
                list
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp size={16} className="text-success" /> Real
                enquiries
              </span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
