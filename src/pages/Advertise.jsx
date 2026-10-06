import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Check,
  Mail,
  MapPinned,
  Megaphone,
  Phone,
  Target,
  TrendingUp,
} from "lucide-react";

import { COMPANY } from "../config/directory";
import { getCities, getStats } from "../api/directoryApi";
import { formatIndian } from "../utils/directory";

const FORMATS = [
  {
    icon: MapPinned,
    name: "Sponsored listing",
    description:
      "Your business appears at the top of search results for your category and city, marked as sponsored.",
    points: [
      "Priority position in search results",
      "Show up in category and city browse pages",
      "Unlimited profile views",
      "Enquiry and click tracking",
    ],
    best: "Best for local service businesses",
  },
  {
    icon: Megaphone,
    name: "Display banners",
    description:
      "High visibility placements across the home page, category pages and search results across our network.",
    points: [
      "Home page and category page placements",
      "City-targeted or nationwide reach",
      "Creative design support",
      "Weekly performance reports",
    ],
    best: "Best for brand awareness",
  },
  {
    icon: Target,
    name: "B2B quick quotes",
    description:
      "Get matched with genuine bulk requirements and respond with a quote directly to the buyer.",
    points: [
      "Verified business requirements",
      "Respond with custom quotes",
      "Category and city targeting",
      "Direct buyer contact",
    ],
    best: "Best for B2B and contractors",
  },
  {
    icon: BarChart3,
    name: "Custom campaigns",
    description:
      "Full campaign management with audience research, creative builds and end-to-end reporting.",
    points: [
      "Audience and city targeting",
      "Campaign strategy and creative",
      "Dedicated account manager",
      "Custom KPIs and reporting",
    ],
    best: "Best for large brands",
  },
];

const STEPS = [
  "Tell us about your business and what you want to achieve",
  "We share a media plan with the audience and pricing",
  "Campaign goes live and you start getting leads",
  "You receive a report on clicks and enquiries",
];

export default function Advertise() {
  const [sent, setSent] = useState(false);
  const [stats, setStats] = useState({});
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getStats()
      .then((result) => setStats(result.stats || {}))
      .catch(() => setStats({}));

    getCities()
      .then((result) => setCities(result.cities || []))
      .catch(() => setCities([]));
  }, []);

  return (
    <>
      <Helmet>
        <title>Advertise With Us | BizLaunch India</title>
        <meta
          name="description"
          content="Advertise your brand on BizLaunch India. Sponsored listings, display banners, B2B quick quotes and custom campaigns."
        />
      </Helmet>

      <main className="bg-background">
        {/* HERO */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-16 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              <Megaphone size={16} />
              Advertising with BizLaunch India
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold sm:text-5xl">
              Put your business in front of buyers who are ready to buy
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
              Reach millions of people searching for a business like yours.
              Choose from sponsored listings, display banners or B2B quick
              quotes, and pay only for placements that work.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#advertise-contact"
                className="rounded-xl bg-white px-6 py-3.5 font-semibold text-primary transition hover:bg-blue-50"
              >
                Request a media kit
              </a>
              <Link
                to="/free-listing"
                className="rounded-xl border border-white/40 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Start with a free listing
              </Link>
            </div>
          </div>
        </section>

        {/* REACH */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                value: formatIndian(stats.businesses),
                label: "Businesses listed",
              },
              {
                value: formatIndian(stats.cities),
                label: "Cities covered",
              },
              {
                value: formatIndian(stats.views),
                label: "Directory page views",
              },
              {
                value: formatIndian(stats.enquiries),
                label: "Enquiries sent",
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-display text-3xl font-bold text-primary">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-muted">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto max-w-7xl px-6 pb-8 text-center text-xs text-muted">
            Figures above are live totals from our database, updated as visitors
            and businesses use the platform.
          </p>
        </section>

        {/* FORMATS */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Ad formats
            </p>
            <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
              Pick the format that fits your goal
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FORMATS.map((format) => (
              <div
                key={format.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-sky text-primary">
                    <format.icon size={24} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      {format.name}
                    </h3>
                    <p className="text-xs font-medium text-primary">
                      {format.best}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-text-secondary">
                  {format.description}
                </p>

                <ul className="mt-5 space-y-2">
                  {format.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-success"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                How advertising works
              </p>
              <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
                From enquiry to live campaign
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-sm leading-6 text-text-secondary">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CITIES */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Available cities
            </p>
            <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
              Target the city that matters to you
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Campaigns can be city-specific or run across every market where we
              already have listings.
            </p>
          </div>

          {cities.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {cities.map((city) => (
                <span
                  key={city.name}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-text-secondary"
                >
                  {city.name} ({city.count})
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-text-secondary">
              No cities have listings yet.
            </p>
          )}
        </section>

        {/* CONTACT */}
        <section
          id="advertise-contact"
          className="scroll-mt-24 bg-gradient-to-r from-primary to-primary-dark py-16 text-white"
        >
          <div className="mx-auto max-w-3xl px-6 text-center">
            <TrendingUp className="mx-auto" size={36} />
            <h2 className="mt-5 font-display text-3xl font-bold">
              Request a media plan
            </h2>
            <p className="mt-4 text-blue-100">
              Tell us your business and goals. We will send pricing and a
              recommended plan based on the audience you want to reach.
            </p>

            {sent ? (
              <div className="mx-auto mt-8 max-w-md rounded-2xl bg-white/15 p-6">
                <p className="font-semibold">
                  Thanks for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {COMPANY.adsEmail && (
                  <a
                    href={`mailto:${COMPANY.adsEmail}?subject=Advertising%20media%20plan%20request`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-primary transition hover:bg-blue-50"
                  >
                    <Mail size={18} />
                    Email {COMPANY.adsEmail}
                  </a>
                )}

                {COMPANY.helpline && (
                  <a
                    href={`tel:${COMPANY.helpline.replace(/\D/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                    onClick={() => setSent(true)}
                  >
                    <Phone size={18} />
                    {COMPANY.helpline}
                  </a>
                )}

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  Send an enquiry
                </Link>
              </div>
            )}

            <p className="mt-8 text-sm text-blue-100">
              Prefer a general question?{" "}
              <Link to="/contact" className="font-semibold underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
