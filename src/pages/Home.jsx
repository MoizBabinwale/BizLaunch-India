import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Store,
  Globe,
  Phone,
  MessageCircle,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

const stats = [
  {
    number: "5,000+",
    label: "Businesses",
  },
  {
    number: "25+",
    label: "Categories",
  },
  {
    number: "100K+",
    label: "Visitors",
  },
  {
    number: "99%",
    label: "Satisfaction",
  },
];

const features = [
  {
    icon: Globe,
    title: "Professional Website",
    description:
      "Launch your business online with a modern responsive website.",
  },
  {
    icon: ShoppingBag,
    title: "Products",
    description:
      "Show unlimited products with pricing and images.",
  },
  {
    icon: Store,
    title: "Services",
    description:
      "List every service your business provides.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description:
      "Receive enquiries instantly on WhatsApp.",
  },
  {
    icon: Phone,
    title: "Call Button",
    description:
      "Customers can call you with one click.",
  },
  {
    icon: MapPin,
    title: "Google Maps",
    description:
      "Help customers find your business easily.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    popular: false,
    features: [
      "Business Website",
      "Products",
      "Services",
      "Gallery",
      "WhatsApp",
      "Basic SEO",
    ],
  },
  {
    name: "Starter",
    price: "₹199",
    popular: false,
    features: [
      "Everything in Free",
      "Premium Theme",
      "More Products",
      "Priority Listing",
    ],
  },
  {
    name: "Growth",
    price: "₹499",
    popular: true,
    features: [
      "Custom Domain",
      "Advanced SEO",
      "Analytics",
      "Priority Support",
    ],
  },
  {
    name: "Commerce",
    price: "₹999",
    popular: false,
    features: [
      "Online Store",
      "Payments",
      "Orders",
      "Inventory",
    ],
  },
];

const categories = [
  "Restaurant",
  "Medical",
  "Electronics",
  "Fashion",
  "Salon",
  "Education",
  "Agriculture",
  "Gym",
  "Travel",
  "Real Estate",
  "Lawyer",
  "Automobile",
];

// const testimonials = [
//   {
//     name: "Rahul Sharma",
//     business: "RK Electronics",
//     review:
//       "Within two days my business website was live and I started receiving enquiries from Google.",
//   },
//   {
//     name: "Farhan Khan",
//     business: "Modern Furniture",
//     review:
//       "Beautiful design, easy dashboard and WhatsApp integration. Highly recommended.",
//   },
//   {
//     name: "Priya Patel",
//     business: "Patel Fashion",
//     review:
//       "Exactly what small businesses need. Professional and affordable.",
//   },
// ];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>BizLaunch India | Launch Your Business Online</title>

        <meta
          name="description"
          content="Create your professional business website in minutes with BizLaunch India."
        />
      </Helmet>

      <main className="overflow-hidden bg-background">
                {/* ================= HERO SECTION ================= */}

        <section className="relative overflow-hidden">
          {/* Background Gradient */}

          <div className="absolute inset-0 bg-gradient-to-br from-primary-sky via-white to-blue-100" />

          {/* Decorative Blobs */}

          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-20 lg:flex-row lg:py-28">
            {/* ================= LEFT ================= */}

            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles size={16} />

                India's Smart Business Website Platform
              </span>

              <h1 className="mt-8 font-display text-5xl font-extrabold leading-tight text-text-primary md:text-6xl">
                Launch Your Business
                <br />

                <span className="bg-gradient-to-r from-primary via-blue-500 to-sky-500 bg-clip-text text-transparent">
                  Online in Minutes
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-text-secondary">
                BizLaunch India helps local businesses create beautiful websites,
                showcase products & services, receive enquiries through WhatsApp,
                improve Google visibility, and grow faster — all without writing
                a single line of code.
              </p>

              {/* CTA */}

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-primary
                    px-8
                    py-4
                    font-semibold
                    text-white
                    shadow-xl
                    shadow-primary/30
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-primary-dark
                  "
                >
                  Launch Business

                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/explore"
                  className="
                    inline-flex
                    items-center
                    rounded-2xl
                    border
                    border-border
                    bg-white
                    px-8
                    py-4
                    font-semibold
                    text-text-primary
                    transition-all
                    duration-300
                    hover:border-primary
                    hover:text-primary
                    hover:shadow-lg
                  "
                >
                  Explore Businesses
                </Link>
              </div>

              {/* Features */}

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  "Free Business Website",
                  "SEO Optimized",
                  "WhatsApp Integration",
                  "Mobile Responsive",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-success"
                    />

                    <span className="font-medium text-text-secondary">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Statistics */}

              <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.label}>
                    <h2 className="text-3xl font-bold text-primary">
                      {item.number}
                    </h2>

                    <p className="mt-2 text-sm text-muted">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= RIGHT ================= */}

            <div className="relative flex-1">
              {/* Floating Badge */}

              <div
                className="
                  absolute
                  -left-10
                  top-10
                  hidden
                  rounded-2xl
                  bg-white
                  px-5
                  py-4
                  shadow-2xl
                  lg:block
                "
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-success/20 p-2">
                    <TrendingUp
                      size={20}
                      className="text-success"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary">
                      3.5x
                    </h4>

                    <p className="text-xs text-muted">
                      More Enquiries
                    </p>
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}

              <div
                className="
                  rounded-3xl
                  border
                  border-white/40
                  bg-white/80
                  p-6
                  shadow-2xl
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">
                      Harvest Basket
                    </h3>

                    <p className="text-sm text-muted">
                      Fresh Grocery Store
                    </p>
                  </div>

                  <span className="rounded-full bg-success/20 px-4 py-2 text-xs font-semibold text-success">
                    LIVE
                  </span>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
                  alt="Business"
                  className="mt-6 h-64 w-full rounded-2xl object-cover"
                />

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-primary-sky p-4 text-center">
                    <Users
                      className="mx-auto text-primary"
                      size={24}
                    />

                    <h3 className="mt-2 font-bold text-text-primary">
                      12K
                    </h3>

                    <p className="text-xs text-muted">
                      Visitors
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary-sky p-4 text-center">
                    <Phone
                      className="mx-auto text-primary"
                      size={24}
                    />

                    <h3 className="mt-2 font-bold text-text-primary">
                      590
                    </h3>

                    <p className="text-xs text-muted">
                      Calls
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary-sky p-4 text-center">
                    <MessageCircle
                      className="mx-auto text-primary"
                      size={24}
                    />

                    <h3 className="mt-2 font-bold text-text-primary">
                      920
                    </h3>

                    <p className="text-xs text-muted">
                      WhatsApp
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Card */}

              <div
                className="
                  absolute
                  -bottom-8
                  -right-8
                  hidden
                  rounded-2xl
                  bg-white
                  p-5
                  shadow-2xl
                  lg:block
                "
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="text-primary"
                    size={26}
                  />

                  <div>
                    <h4 className="font-bold text-text-primary">
                      Secure Platform
                    </h4>

                    <p className="text-xs text-muted">
                      SSL • SEO • Fast Hosting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
                {/* =======================================================
                           TRUSTED BY SECTION
        ======================================================== */}

        <section className="border-y border-border bg-white py-10">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.25em] text-muted">
              Trusted by growing businesses across India
            </p>

            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              <div>
                <h2 className="text-4xl font-display font-bold text-primary">
                  5,000+
                </h2>

                <p className="mt-2 text-text-secondary">
                  Business Websites
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-display font-bold text-primary">
                  25+
                </h2>

                <p className="mt-2 text-text-secondary">
                  Business Categories
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-display font-bold text-primary">
                  100K+
                </h2>

                <p className="mt-2 text-text-secondary">
                  Monthly Visitors
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-display font-bold text-primary">
                  99%
                </h2>

                <p className="mt-2 text-text-secondary">
                  Customer Satisfaction
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
                         BUSINESS CATEGORIES
        ======================================================== */}

        <section className="bg-background py-24">
          <div className="mx-auto max-w-7xl px-6">

            <div className="mb-16 text-center">

              <span className="rounded-full bg-primary-sky px-5 py-2 text-sm font-semibold text-primary">
                Explore Categories
              </span>

              <h2 className="mt-6 font-display text-5xl font-bold text-text-primary">
                Every Business Can Go Online
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
                Whether you're a shop owner, doctor, restaurant, freelancer,
                salon or manufacturer, BizLaunch India helps you build your
                professional online presence in minutes.
              </p>

            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {categories.map((category) => (

                <div
                  key={category}
                  className="
                    group
                    rounded-3xl
                    border
                    border-border
                    bg-card
                    p-8
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-primary
                    hover:shadow-2xl
                  "
                >

                  <div
                    className="
                      mb-6
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-primary-sky
                      transition-all
                      duration-300
                      group-hover:bg-primary
                    "
                  >
                    <Store
                      size={30}
                      className="text-primary group-hover:text-white"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-text-primary">
                    {category}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    Create a beautiful website, showcase your products,
                    receive enquiries and grow your business online.
                  </p>

                  <button
                    className="
                      mt-8
                      inline-flex
                      items-center
                      gap-2
                      font-semibold
                      text-primary
                      transition-all
                      duration-300
                      group-hover:gap-4
                    "
                  >
                    Learn More

                    <ArrowRight size={18} />
                  </button>

                </div>

              ))}

            </div>

          </div>
        </section>

        {/* =======================================================
                         WHY CHOOSE BIZLAUNCH
        ======================================================== */}

        <section className="bg-white py-24">

          <div className="mx-auto max-w-7xl px-6">

            <div className="mb-16 text-center">

              <span className="rounded-full bg-primary-sky px-5 py-2 text-sm font-semibold text-primary">
                Why BizLaunch?
              </span>

              <h2 className="mt-6 font-display text-5xl font-bold text-text-primary">
                Everything You Need To Grow
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
                Stop managing multiple tools. BizLaunch India gives you
                everything under one platform.
              </p>

            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {features.map((feature) => {

                const Icon = feature.icon;

                return (

                  <div
                    key={feature.title}
                    className="
                      rounded-3xl
                      border
                      border-border
                      bg-card
                      p-8
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      hover:border-primary
                      hover:shadow-xl
                    "
                  >

                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-sky">

                      <Icon
                        size={30}
                        className="text-primary"
                      />

                    </div>

                    <h3 className="text-2xl font-bold text-text-primary">
                      {feature.title}
                    </h3>

                    <p className="mt-4 leading-8 text-text-secondary">
                      {feature.description}
                    </p>

                  </div>

                );

              })}

            </div>

          </div>

        </section>
                {/* =======================================================
                          HOW IT WORKS
        ======================================================== */}

        <section className="bg-background py-24">
          <div className="mx-auto max-w-7xl px-6">

            <div className="mb-16 text-center">

              <span className="rounded-full bg-primary-sky px-5 py-2 text-sm font-semibold text-primary">
                Simple Process
              </span>

              <h2 className="mt-6 font-display text-5xl font-bold text-text-primary">
                Launch Your Website In 4 Easy Steps
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
                No coding. No technical knowledge. Everything is designed for
                business owners.
              </p>

            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  step: "01",
                  title: "Create Account",
                  description:
                    "Register your free BizLaunch account in less than a minute.",
                },
                {
                  step: "02",
                  title: "Create Business",
                  description:
                    "Add your business details, logo, contact information and location.",
                },
                {
                  step: "03",
                  title: "Add Products",
                  description:
                    "Upload products, services, gallery images and business information.",
                },
                {
                  step: "04",
                  title: "Publish Website",
                  description:
                    "Share your business page instantly with customers and Google.",
                },
              ].map((item) => (

                <div
                  key={item.step}
                  className="
                    relative
                    rounded-3xl
                    border
                    border-border
                    bg-white
                    p-8
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:shadow-xl
                  "
                >

                  <div
                    className="
                      mb-6
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-primary
                      text-2xl
                      font-bold
                      text-white
                    "
                  >
                    {item.step}
                  </div>

                  <h3 className="text-2xl font-bold text-text-primary">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-8 text-text-secondary">
                    {item.description}
                  </p>

                </div>

              ))}

            </div>

          </div>
        </section>

        {/* =======================================================
                          PRICING
        ======================================================== */}

        <section className="bg-white py-24">

          <div className="mx-auto max-w-7xl px-6">

            <div className="mb-16 text-center">

              <span className="rounded-full bg-primary-sky px-5 py-2 text-sm font-semibold text-primary">
                Pricing
              </span>

              <h2 className="mt-6 font-display text-5xl font-bold text-text-primary">
                Affordable Plans For Every Business
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
                Start completely free and upgrade whenever your business grows.
              </p>

            </div>

            <div className="grid gap-8 lg:grid-cols-4">

              {pricingPlans.map((plan) => (

                <div
                  key={plan.name}
                  className={`
                    relative
                    rounded-3xl
                    border
                    p-8
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:shadow-2xl

                    ${
                      plan.popular
                        ? "border-primary bg-primary text-white shadow-xl"
                        : "border-border bg-card"
                    }
                  `}
                >

                  {plan.popular && (

                    <div
                      className="
                        absolute
                        -top-4
                        left-1/2
                        -translate-x-1/2
                        rounded-full
                        bg-yellow-400
                        px-5
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-900
                      "
                    >
                      ⭐ Most Popular
                    </div>

                  )}

                  <h3
                    className={`text-2xl font-bold ${
                      plan.popular
                        ? "text-white"
                        : "text-text-primary"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <h2
                    className={`mt-6 text-5xl font-display font-extrabold ${
                      plan.popular
                        ? "text-white"
                        : "text-primary"
                    }`}
                  >
                    {plan.price}
                  </h2>

                  <p
                    className={`mt-2 ${
                      plan.popular
                        ? "text-blue-100"
                        : "text-muted"
                    }`}
                  >
                    Per Month
                  </p>

                  <div className="my-8 border-t border-white/20" />

                  <div className="space-y-4">

                    {plan.features.map((feature) => (

                      <div
                        key={feature}
                        className="flex items-center gap-3"
                      >

                        <CheckCircle2
                          size={20}
                          className={
                            plan.popular
                              ? "text-green-300"
                              : "text-success"
                          }
                        />

                        <span
                          className={
                            plan.popular
                              ? "text-blue-50"
                              : "text-text-secondary"
                          }
                        >
                          {feature}
                        </span>

                      </div>

                    ))}

                  </div>

                  <Link
                    to="/register"
                    className={`
                      mt-10
                      flex
                      justify-center
                      rounded-2xl
                      py-4
                      font-semibold
                      transition-all
                      duration-300

                      ${
                        plan.popular
                          ? "bg-white text-primary hover:bg-slate-100"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }
                    `}
                  >
                    Get Started
                  </Link>

                </div>

              ))}

            </div>

          </div>
        </section>
                {/* FAQ Section */}

        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                Frequently Asked Questions
              </span>

              <h2 className="mt-6 font-display text-4xl font-bold text-text-primary">
                Everything you need to know
              </h2>

              <p className="mt-4 text-lg text-text-secondary">
                We built BizLaunch India for local businesses, startups and
                entrepreneurs who want to get online without hiring expensive
                developers.
              </p>
            </div>

            <div className="mx-auto mt-14 max-w-4xl space-y-5">
              {[
                {
                  q: "Is BizLaunch India really free?",
                  a: "Yes. Every business gets a free website with products, services, gallery, contact form, WhatsApp integration and QR code.",
                },
                {
                  q: "Can I use my own domain?",
                  a: "Absolutely. Premium plans allow custom domains with SSL and SEO optimization.",
                },
                {
                  q: "Will my website work on mobile?",
                  a: "Yes. Every website is fully responsive and optimized for all screen sizes.",
                },
                {
                  q: "Can I sell products online?",
                  a: "Yes. Higher plans include an online store, inventory management and payment gateway integration.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-text-primary">
                    {faq.q}
                  </h3>

                  <p className="mt-2 text-text-secondary">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}

        <section className="bg-gradient-to-r from-primary to-primary-dark py-24 text-white">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Ready to Launch?
            </span>

            <h2 className="mt-6 font-display text-5xl font-bold leading-tight">
              Build Your Business Website
              <br />
              in Less Than 10 Minutes
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-blue-100">
              Join thousands of businesses already growing with BizLaunch India.
              Create your website today and start receiving customers through
              Google Search, WhatsApp and social media.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-5">
              <Link
                to="/register"
                className="
                  rounded-2xl
                  bg-white
                  px-8
                  py-4
                  text-lg
                  font-bold
                  text-primary
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                "
              >
                Create Free Website
              </Link>

              <Link
                to="/pricing"
                className="
                  rounded-2xl
                  border
                  border-white/40
                  px-8
                  py-4
                  text-lg
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-white/10
                "
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-10 text-sm text-blue-100">
              <span>✓ Free Forever Plan</span>
              <span>✓ No Coding Required</span>
              <span>✓ Mobile Friendly</span>
              <span>✓ SEO Optimized</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
