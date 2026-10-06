import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import { CONTACT_SUBJECTS, COMPANY, hasContactDetails } from "../config/directory";
import { submitContactMessage } from "../api/directoryApi";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: CONTACT_SUBJECTS[0],
  message: "",
};

/**
 * Only channels that have actually been configured are shown, so the page
 * never advertises a phone number or inbox that does not exist.
 */
const CHANNELS = [
  {
    icon: Phone,
    title: "Call our helpline",
    value: COMPANY.helpline,
    note: COMPANY.supportHours,
    href: COMPANY.helpline ? `tel:${COMPANY.helpline.replace(/\D/g, "")}` : "",
  },
  {
    icon: Mail,
    title: "General support",
    value: COMPANY.supportEmail,
    note: "We reply to messages as quickly as we can",
    href: COMPANY.supportEmail ? `mailto:${COMPANY.supportEmail}` : "",
  },
  {
    icon: MessageCircle,
    title: "Business listing help",
    value: COMPANY.businessEmail,
    note: "For listing and onboarding questions",
    href: COMPANY.businessEmail ? `mailto:${COMPANY.businessEmail}` : "",
  },
  {
    icon: Building2,
    title: "Advertise with us",
    value: COMPANY.adsEmail,
    note: "Request a media plan and pricing",
    href: COMPANY.adsEmail ? `mailto:${COMPANY.adsEmail}` : "",
  },
].filter((channel) => channel.value);

const FAQS = [
  {
    q: "How do I list my business for free?",
    a: "Go to the Free Listing page and submit your business details. Our onboarding team verifies the information and your page goes live once it is approved.",
  },
  {
    q: "I found a wrong or outdated listing. How do I report it?",
    a: "Use the contact form on this page with the subject 'Report a wrong listing' and include the business name. We review every report.",
  },
  {
    q: "How do I claim an existing business page?",
    a: "Create an account, then submit a Free Listing request with the exact business name. If the business already exists on BizLaunch we will help you merge the details into your account.",
  },
  {
    q: "Can I advertise my business on BizLaunch?",
    a: "Yes. See the Advertise page for the formats we offer, or use the contact form below to request a media plan.",
  },
  {
    q: "What information do you need to contact a business?",
    a: "A name plus either a phone number or an email address. That is enough for the business to reply to you directly.",
  },
  {
    q: "Are the reviews on business pages genuine?",
    a: "Reviews are written by visitors and published on the business page. We review reports of spam or abuse.",
  },
];

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

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
      const result = await submitContactMessage(form);

      setSuccess(result.message);
      setForm(emptyForm);
    } catch (reason) {
      setError(reason.message || "Unable to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | BizLaunch India</title>
        <meta
          name="description"
          content="Contact BizLaunch India for business listing support, advertising enquiries, feedback or to report a wrong listing."
        />
      </Helmet>

      <main className="bg-background">
        {/* HERO */}
        <section className="border-b border-border bg-gradient-to-br from-primary-sky via-white to-blue-100">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary">
              <Mail size={16} />
              Get in touch
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold text-text-primary sm:text-5xl">
              Contact BizLaunch India
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary">
              Questions about a listing, advertising, partnerships or something
              that is not right on the site? Send us a message and we will get
              back to you.
            </p>
          </div>
        </section>

        {/* CHANNELS */}
        {CHANNELS.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CHANNELS.map((channel) => (
                <a
                  key={channel.title}
                  href={channel.href}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-sky text-primary">
                    <channel.icon size={24} />
                  </span>
                  <h2 className="mt-4 font-bold text-text-primary">
                    {channel.title}
                  </h2>
                  <p className="mt-1 break-all text-sm font-medium text-primary group-hover:underline">
                    {channel.value}
                  </p>
                  {channel.note && (
                    <p className="mt-1 text-xs text-muted">{channel.note}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FORM + INFO */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-text-primary">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                All fields marked with an asterisk are required.
              </p>

              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={20} />
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      Full name *
                    </span>
                    <input
                      value={form.name}
                      onChange={update("name")}
                      required
                      minLength={2}
                      placeholder="Your name"
                      className="mt-1.5 w-full rounded-xl border-border"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      Email address *
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      required
                      placeholder="you@example.com"
                      className="mt-1.5 w-full rounded-xl border-border"
                    />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      Phone number
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      inputMode="numeric"
                      autoComplete="tel"
                      pattern="[6-9][0-9]{9}"
                      placeholder="10-digit mobile"
                      className="mt-1.5 w-full rounded-xl border-border"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      Subject *
                    </span>
                    <select
                      value={form.subject}
                      onChange={update("subject")}
                      className="mt-1.5 w-full rounded-xl border-border"
                    >
                      {CONTACT_SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-text-primary">
                    Message *
                  </span>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    required
                    minLength={10}
                    rows={5}
                    placeholder="Tell us how we can help"
                    className="mt-1.5 w-full rounded-xl border-border"
                  />
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={18} />
                  {sending ? "Sending..." : "Send message"}
                </button>
              </form>
            </div>

            <aside className="space-y-6">
              {COMPANY.address && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                    <MapPin className="text-primary" size={20} />
                    Office address
                  </h2>

                  <address className="mt-3 whitespace-pre-line text-sm not-italic leading-6 text-text-secondary">
                    {COMPANY.address}
                  </address>
                </div>
              )}

              {COMPANY.supportHours && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                    <Clock className="text-primary" size={20} />
                    Support hours
                  </h2>

                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-text-secondary">
                    {COMPANY.supportHours}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-primary/20 bg-primary-sky p-6">
                <h2 className="text-lg font-bold text-text-primary">
                  Own a business?
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Listing is free. Send us your details and we will get in touch
                  to verify your business.
                </p>
                <Link
                  to="/free-listing"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Start a free listing
                </Link>
              </div>

              {!hasContactDetails() && (
                <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
                  Direct phone and email details have not been published yet.
                  Use the form and we will get back to you.
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                FAQ
              </p>
              <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>

            <div className="mt-10 space-y-3">
              {FAQS.map((faq, index) => {
                const open = openFaq === index;

                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-border bg-background"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : index)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-semibold text-text-primary">
                        {faq.q}
                      </span>
                      <span
                        className={`text-primary transition-transform ${
                          open ? "rotate-45" : ""
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>

                    {open && (
                      <p className="px-6 pb-5 text-text-secondary">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
