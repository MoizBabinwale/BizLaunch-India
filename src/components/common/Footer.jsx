import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

import { COMPANY, hasContactDetails } from "../../config/directory";
import { getCategories, getCities } from "../../api/directoryApi";

function BizLaunchWordmark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-black text-white shadow-sm">
        B
      </div>
      <div className="leading-none">
        <div className="font-display text-xl font-extrabold tracking-tight text-slate-900">
          BizLaunch
        </div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          India
        </div>
      </div>
    </div>
  );
}

const staticGroups = [
  {
    title: "For businesses",
    links: [
      { label: "Free Listing", to: "/free-listing" },
      { label: "Advertise with us", to: "/advertise" },
      { label: "Business dashboard", to: "/dashboard" },
      { label: "Download the app", to: "/download-app" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact us", to: "/contact" },
      { label: "Explore businesses", to: "/explore" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getCategories()
      .then((result) =>
        setCategories((result.categories || []).filter((item) => item.count > 0))
      )
      .catch(() => setCategories([]));

    getCities()
      .then((result) => setCities(result.cities || []))
      .catch(() => setCities([]));
  }, []);

  // Categories and cities are live, and only rendered when they have listings.
  const groups = [
    categories.length > 0 && {
      title: "Popular categories",
      links: categories.slice(0, 6).map((item) => ({
        label: item.name,
        to: `/explore?category=${encodeURIComponent(item.name)}`,
      })),
    },
    cities.length > 0 && {
      title: "Browse by city",
      links: cities.slice(0, 6).map((city) => ({
        label: `Businesses in ${city.name}`,
        to: `/explore?city=${encodeURIComponent(city.name)}`,
      })),
    },
    ...staticGroups,
  ].filter(Boolean);

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2.9fr]">
          <div className="space-y-5">
            <Link to="/" className="inline-flex">
              <BizLaunchWordmark />
            </Link>

            <p className="max-w-sm text-sm leading-7 text-slate-600">
              One-stop destination for local businesses, services and stores across
              India. Discover trusted brands, compare offerings and connect faster.
            </p>

            {hasContactDetails() && (
              <div className="space-y-2.5 text-sm text-slate-600">
                {COMPANY.helpline && (
                  <p className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-sky text-primary">
                      <Phone size={15} />
                    </span>
                    <a href={`tel:${COMPANY.helpline.replace(/\D/g, "")}`} className="transition hover:text-primary">
                      {COMPANY.helpline}
                    </a>
                  </p>
                )}

                {COMPANY.supportEmail && (
                  <p className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-sky text-primary">
                      <Mail size={15} />
                    </span>
                    <a href={`mailto:${COMPANY.supportEmail}`} className="transition hover:text-primary">
                      {COMPANY.supportEmail}
                    </a>
                  </p>
                )}

                {COMPANY.address && (
                  <p className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-sky text-primary">
                      <MapPin size={15} />
                    </span>
                    <span className="whitespace-pre-line text-slate-600">{COMPANY.address}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-900">
                  {group.title}
                </h3>

                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-slate-600 transition hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} BizLaunch India. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <Link to="/about" className="transition hover:text-primary">About</Link>
            <Link to="/contact" className="transition hover:text-primary">Contact</Link>
            <Link to="/free-listing" className="transition hover:text-primary">List your business</Link>
            <Link to="/advertise" className="transition hover:text-primary">Advertise</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
