import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  Handshake,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { categoryIcon, formatIndian } from "../utils/directory";
import { getCategories, getCities, getStats } from "../api/directoryApi";

const VALUES = [
  {
    icon: Search,
    title: "Discovery made simple",
    description:
      "We obsessed over the search experience so a customer can go from need to contact in under a minute.",
  },
  {
    icon: ShieldCheck,
    title: "Trust is the product",
    description:
      "Listings are verified, reviews are moderated and contact details are checked before a page goes live.",
  },
  {
    icon: HeartHandshake,
    title: "Built for small business",
    description:
      "Most Indian businesses have no marketing team. Our free tools give them the same reach as a large chain.",
  },
  {
    icon: TrendingUp,
    title: "Real measurable growth",
    description:
      "Owners see views, clicks and enquiries so they know exactly what is working.",
  },
];

/**
 * Describes what the platform actually does, with no invented dates,
 * headcount or company history.
 */
const SCOPE = [
  {
    title: "Who can list",
    description:
      "Any business owner in India. Create an account, add your business details, and our onboarding team verifies the listing before it goes live.",
  },
  {
    title: "What a listing shows",
    description:
      "Name, category, description, address and locality, opening hours, contact numbers, products and services, and the reviews customers leave.",
  },
  {
    title: "How customers find you",
    description:
      "Visitors search by keyword, then filter by category, city and rating. Featured listings appear first in results.",
  },
  {
    title: "What we measure",
    description:
      "Page views, outbound clicks and enquiries are recorded per business and shown in the owner dashboard.",
  },
];

export default function About() {
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getStats()
      .then((result) => setStats(result.stats || {}))
      .catch(() => setStats({}));

    getCategories()
      .then((result) =>
        setCategories((result.categories || []).filter((item) => item.count > 0))
      )
      .catch(() => setCategories([]));

    getCities()
      .then((result) => setCities(result.cities || []))
      .catch(() => setCities([]));
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us | BizLaunch India</title>
        <meta
          name="description"
          content="Learn how BizLaunch India helps people find and contact local businesses, services and stores across India."
        />
      </Helmet>

      <main className="bg-background">
        {/* HERO */}
        <section className="border-b border-border bg-gradient-to-br from-primary-sky via-white to-blue-100">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary">
                <Building2 size={16} />
                About BizLaunch India
              </span>

              <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-text-primary sm:text-5xl">
                We help India find the right local business
              </h1>

              <p className="mt-5 text-lg leading-8 text-text-secondary">
                BizLaunch India is a one-stop directory for local businesses,
                services and stores. We connect millions of customers with
                verified businesses, and give small businesses the tools to grow
                online without a marketing budget.
              </p>
            </div>
          </div>
        </section>

        {/* NUMBERS */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Building2,
                value: formatIndian(stats.businesses),
                label: "Businesses listed",
              },
              {
                icon: MapPin,
                value: formatIndian(stats.cities),
                label: "Cities covered",
              },
              {
                icon: Handshake,
                value: formatIndian(stats.catalogue),
                label: "Products & services",
              },
              {
                icon: TrendingUp,
                value: formatIndian(stats.views),
                label: "Total page views",
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <item.icon className="mx-auto mb-3 text-primary" size={26} />
                <p className="font-display text-3xl font-bold text-text-primary">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Our mission
              </p>
              <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
                Every neighbourhood has great businesses. Finding them should be
                effortless.
              </h2>

              <div className="mt-6 space-y-4 text-text-secondary">
                <p>
                  India is home to more than 60 million registered small
                  businesses. Most of them are brilliant at what they do, but
                  almost invisible online. A customer who needs a plumber today
                  has no idea which of the twenty plumbers in the area is
                  reliable, open now, or will answer the phone.
                </p>
                <p>
                  We built BizLaunch India to close that gap. Business owners
                  create a listing in minutes, we verify it, and customers get
                  accurate information with a single tap to call or WhatsApp.
                </p>
                <p>
                  Our job is simple: make local discovery reliable, fast and
                  free for everyone.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-sky text-primary">
                    <value.icon size={24} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-text-primary">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SCOPE */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
                What BizLaunch India actually does
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {SCOPE.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <h3 className="text-lg font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIVE DIRECTORY */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Live directory
            </p>
            <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
              What is listed right now
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              These numbers come straight from our database, as do the
              categories and cities below.
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((category) => {
                const Icon = categoryIcon(category.name);

                return (
                  <Link
                    key={category.name}
                    to={`/explore?category=${encodeURIComponent(category.name)}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary hover:shadow-md"
                  >
                    <Icon size={20} className="shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
                      {category.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {category.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="mt-10 text-center text-text-secondary">
              No categories have listings yet.
            </p>
          )}

          {cities.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {cities.map((city) => (
                <Link
                  key={city.name}
                  to={`/explore?city=${encodeURIComponent(city.name)}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-primary hover:text-primary"
                >
                  {city.name} ({city.count})
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <BadgeCheck className="mx-auto" size={40} />
            <h2 className="mt-5 font-display text-3xl font-bold">
              Run a business? Join BizLaunch India today
            </h2>
            <p className="mt-4 text-blue-100">
              Listing is free. Add your products, services and timings, and let
              customers in your city find you.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/free-listing"
                className="rounded-xl bg-white px-6 py-3.5 font-semibold text-primary transition hover:bg-blue-50"
              >
                List my business for free
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-white/40 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
