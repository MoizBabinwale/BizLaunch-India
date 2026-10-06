import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Bell, MapPin, MessageCircle, Search, Smartphone } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Instant search",
    description:
      "Find the right business in your area with one tap, even on a slow connection.",
  },
  {
    icon: MessageCircle,
    title: "Enquiries on the go",
    description:
      "Send and reply to enquiries from your phone without opening a laptop.",
  },
  {
    icon: MapPin,
    title: "Nearby listings",
    description:
      "See businesses around you, sorted by distance and open right now.",
  },
  {
    icon: Bell,
    title: "Instant alerts",
    description:
      "Get notified the moment a new enquiry lands in your business dashboard.",
  },
];

const PLATFORMS = [
  {
    name: "Android",
    detail: "Android 7.0 and above",
    action: "Download APK",
    icon: Smartphone,
    href: "#download",
  },
  {
    name: "iPhone",
    detail: "iOS 14 and above",
    action: "App Store",
    icon: Smartphone,
    href: "#download",
  },
  {
    name: "Web app",
    detail: "Any browser, no install needed",
    action: "Open BizLaunch",
    icon: Search,
    href: "/explore",
  },
];

export default function DownloadApp() {
  return (
    <>
      <Helmet>
        <title>Download the App | BizLaunch India</title>
        <meta
          name="description"
          content="Download the BizLaunch India app to search local businesses and manage enquiries from your phone."
        />
      </Helmet>

      <main className="bg-background">
        <section className="relative border-b border-primary/10 bg-gradient-to-br from-primary-sky via-white to-blue-100">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary">
                  <Smartphone size={16} />
                  BizLaunch on your phone
                </span>

                <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-text-primary sm:text-5xl">
                  Take your business directory with you
                </h1>

                <p className="mt-5 text-lg leading-8 text-text-secondary">
                  Search for businesses, call them, send WhatsApp messages and
                  manage your listings from anywhere. Built to work well on the
                  mobile connections most of India actually uses.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {PLATFORMS.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
                    >
                      <platform.icon size={18} />
                      {platform.action}
                    </a>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted">
                    Search, call and manage enquiries from one place
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-sky text-primary">
                      <feature.icon size={24} />
                    </span>
                    <h2 className="mt-4 font-bold text-text-primary">
                      {feature.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="download"
          className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16 text-center"
        >
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Get the app in seconds
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Free to download, no sign-up needed to browse. Create a free account
            only if you want to manage a business listing.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-sky text-primary">
                  <platform.icon size={24} />
                </span>
                <h3 className="mt-4 font-bold text-text-primary">
                  {platform.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{platform.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link
              to="/free-listing"
              className="rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark"
            >
              List your business free
            </Link>
            <Link
              to="/explore"
              className="rounded-xl border border-border bg-white px-6 py-3.5 font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
            >
              Explore businesses
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
