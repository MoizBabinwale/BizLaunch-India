import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  MapPin,
  Phone,
  Search,
  Store,
  TrendingUp,
} from "lucide-react";

import { CATEGORY_NAMES } from "../config/directory";
import { getCities, submitFreeListingRequest } from "../api/directoryApi";

const emptyForm = {
  businessName: "",
  category: "",
  city: "",
  ownerName: "",
  phone: "",
  email: "",
};

const PERKS = [
  {
    icon: Store,
    title: "Free listing page",
    description:
      "A dedicated page with your description, address, timings, photos, products and services.",
  },
  {
    icon: Search,
    title: "Appear in local search",
    description:
      "Be found when someone searches your category, area or city on BizLaunch.",
  },
  {
    icon: Phone,
    title: "Direct call and WhatsApp",
    description:
      "Customers can call or message you instantly, with no middleman in between.",
  },
  {
    icon: TrendingUp,
    title: "Track your enquiries",
    description:
      "A simple dashboard shows page views, clicks and every enquiry you receive.",
  },
];

const PROCESS = [
  "Submit the form on this page with your business details",
  "Our team reviews and verifies the listing",
  "Your business page is published once approved",
  "Start receiving calls, WhatsApp messages and enquiries",
];

export default function FreeListing() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getCities()
      .then((result) => setCities(result.cities || []))
      .catch(() => setCities([]));
  }, []);

  const update = (field) => (event) => {
    const value =
      field === "phone"
        ? event.target.value.replace(/\D/g, "").slice(0, 10)
        : event.target.value;

    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    try {
      const result = await submitFreeListingRequest(form);

      setSuccess(result.message);
      setForm(emptyForm);
    } catch (reason) {
      setError(
        reason.message || "Unable to submit your request. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>List My Business for Free | BizLaunch India</title>
        <meta
          name="description"
          content="Add your business to BizLaunch India for free. Reach customers searching for your service in your city."
        />
      </Helmet>

      <main className="bg-background">
        {/* HERO */}
        <section className="border-b border-border bg-gradient-to-br from-primary-sky via-white to-blue-100">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary">
                  <BadgeCheck size={16} />
                  100% free listing
                </span>

                <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-text-primary sm:text-5xl">
                  List your business for free and get found locally
                </h1>

                <p className="mt-5 text-lg leading-8 text-text-secondary">
                  Reach thousands of customers searching for your service in
                  your area. Create a verified business page, showcase your
                  products and services, and receive enquiries directly. No cost
                  and no commission on the leads you generate.
                </p>

                <div className="mt-7 flex flex-wrap gap-4">
                  <a
                    href="#listing-form"
                    className="rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Start your free listing
                  </a>
                  <Link
                    to="/explore"
                    className="rounded-xl border border-border bg-white px-6 py-3.5 font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
                  >
                    See example listings
                  </Link>
                </div>

                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "No monthly fee on the free plan",
                    "Manage everything from one dashboard",
                    "Unlimited products and services",
                    "Cancel or upgrade any time",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <CheckCircle2 size={16} className="shrink-0 text-success" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {PERKS.map((perk) => (
                  <div
                    key={perk.title}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-sky text-primary">
                      <perk.icon size={24} />
                    </span>
                    <h2 className="mt-4 font-bold text-text-primary">
                      {perk.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {perk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section
          id="listing-form"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16"
        >
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-text-primary">
                Tell us about your business
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Fields marked with an asterisk are required. Our team will call
                you to confirm before publishing.
              </p>

              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-success"
                    size={20}
                  />
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-text-primary">
                    Business name *
                  </span>
                  <input
                    value={form.businessName}
                    onChange={update("businessName")}
                    required
                    minLength={2}
                    placeholder="e.g. Sharma Electronics"
                    className="mt-1.5 w-full rounded-xl border-border"
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      Category *
                    </span>
                    <select
                      value={form.category}
                      onChange={update("category")}
                      required
                      className="mt-1.5 w-full rounded-xl border-border"
                    >
                      <option value="">Select a category</option>
                      {CATEGORY_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      City *
                    </span>
                    <input
                      list="free-listing-cities"
                      value={form.city}
                      onChange={update("city")}
                      required
                      placeholder="Where are you located?"
                      className="mt-1.5 w-full rounded-xl border-border"
                    />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      Your name *
                    </span>
                    <input
                      value={form.ownerName}
                      onChange={update("ownerName")}
                      required
                      minLength={2}
                      placeholder="Full name"
                      className="mt-1.5 w-full rounded-xl border-border"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      Mobile number *
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      required
                      inputMode="numeric"
                      autoComplete="tel"
                      pattern="[6-9][0-9]{9}"
                      placeholder="10-digit mobile"
                      className="mt-1.5 w-full rounded-xl border-border"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-text-primary">
                    Email address
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com (optional)"
                    className="mt-1.5 w-full rounded-xl border-border"
                  />
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Building2 size={18} />
                  {sending ? "Submitting..." : "Request free listing"}
                </button>

                <datalist id="free-listing-cities">
                  {cities.map((city) => (
                    <option key={city.name} value={city.name} />
                  ))}
                </datalist>
              </form>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-text-primary">
                  How it works
                </h2>

                <ol className="mt-4 space-y-4">
                  {PROCESS.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-sky text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm text-text-secondary">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary-sky p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                  <MapPin size={18} className="text-primary" />
                  Prefer to talk?
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Send us the details through the form and our onboarding team
                  will get in touch to verify your listing.
                </p>
                <Link
                  to="/contact"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Contact us
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-text-primary">
                  Want more visibility?
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Featured placement, priority leads and banner campaigns are
                  available on paid plans.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/advertise"
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Advertise
                  </Link>
                  <Link
                    to="/contact"
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
                  >
                    Talk to us
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
