import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";

import RatingStars from "../components/directory/RatingStars";
import Pagination from "../components/directory/Pagination";
import {
  getBusiness,
  getSimilarBusinesses,
  submitEnquiry,
  submitReview,
} from "../api/directoryApi";
import {
  DAYS_OF_WEEK,
  categoryIcon,
  formatPrice,
  formatTime,
  getOpenStatus,
  locationLabel,
} from "../utils/directory";

const emptyEnquiry = { name: "", email: "", phone: "", message: "" };
const emptyReview = { name: "", rating: 5, comment: "" };
const REVIEWS_PER_PAGE = 5;

export default function PublicBusinessPage() {
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState("");

  const [enquiry, setEnquiry] = useState(emptyEnquiry);
  const [enquiryError, setEnquiryError] = useState("");
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const [reviewPage, setReviewPage] = useState(1);
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [postingReview, setPostingReview] = useState(false);

  // Refetched after a review is posted so the average rating updates.
  const refreshBusiness = useCallback(() => {
    getBusiness(slug)
      .then((result) => setBusiness(result.business))
      .catch((reason) => setError(reason.message));
  }, [slug]);

  useEffect(() => {
    setBusiness(null);
    setError("");
    setReviewPage(1);
    refreshBusiness();

    getSimilarBusinesses(slug)
      .then((result) => setSimilar(result.similar || []))
      .catch(() => setSimilar([]));
  }, [slug, refreshBusiness]);

  const sendEnquiry = async (event) => {
    event.preventDefault();
    setEnquiryError("");
    setEnquirySuccess(false);
    setSending(true);

    try {
      await submitEnquiry(slug, enquiry);
      setEnquiry(emptyEnquiry);
      setEnquirySuccess(true);
    } catch (reason) {
      setEnquiryError(
        reason.message || "Unable to send your enquiry. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const sendReview = async (event) => {
    event.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    setPostingReview(true);

    try {
      await submitReview(slug, reviewForm);

      setReviewForm(emptyReview);
      setReviewSuccess("Thanks! Your review has been published.");
      setReviewPage(1);
      refreshBusiness();
    } catch (reason) {
      setReviewError(reason.message || "Unable to publish your review.");
    } finally {
      setPostingReview(false);
    }
  };

  if (error) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-text-primary">
          Business page unavailable
        </h1>
        <p className="mt-2 text-muted">{error}</p>
        <Link
          to="/explore"
          className="mt-5 inline-block font-semibold text-primary hover:underline"
        >
          Back to explore
        </Link>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="px-6 py-24 text-center text-muted">
        Loading business page...
      </main>
    );
  }

  const Icon = categoryIcon(business.category);
  const status = getOpenStatus(business.hours);
  const whatsapp = (business.whatsapp || business.phone || "").replace(/\D/g, "");
  const catalogue = [...(business.products || []), ...(business.services || [])];
  const reviews = business.reviews || [];
  const reviewPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));
  const visibleReviews = reviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );
  const mapsUrl =
    business.googleMapsUrl ||
    (business.city
      ? `https://maps.google.com/?q=${encodeURIComponent(
          `${business.name}, ${locationLabel(business)}`
        )}`
      : "");

  const shareOnClick = () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({ title: business.name, url: shareUrl }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {business.name} | {business.category} in {business.city} | BizLaunch
          India
        </title>
        <meta
          name="description"
          content={business.tagline || business.description}
        />
      </Helmet>

      <main className="bg-background pb-16">
        {/* HEADER */}
        <section className="bg-gradient-to-br from-primary to-blue-900 px-6 py-10 text-white">
          <div className="mx-auto max-w-6xl">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white"
            >
              <ArrowLeft size={16} /> Back to explore
            </Link>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon className="h-9 w-9 text-white" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                  {business.category}
                </p>

                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  {business.name}
                </h1>

                {business.tagline && (
                  <p className="mt-2 max-w-2xl text-blue-100">
                    {business.tagline}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-blue-100">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} /> {locationLabel(business)}
                  </span>

                  <span
                    className={`flex items-center gap-1.5 font-medium ${
                      status.open ? "text-green-300" : "text-blue-200"
                    }`}
                  >
                    <Clock size={15} /> {status.label}
                  </span>

                  {business.established && (
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck size={15} /> Since {business.established}
                    </span>
                  )}

                  {Number(business.rating) > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Star
                        size={15}
                        className="fill-warning text-warning"
                        aria-hidden="true"
                      />
                      {business.rating} ({business.reviewCount} reviews)
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
                    >
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                  )}

                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary transition hover:bg-blue-50"
                    >
                      <Phone size={18} /> Call now
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={shareOnClick}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BODY */}
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            {/* ABOUT */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text-primary">About</h2>

              {business.description ? (
                <p className="mt-3 whitespace-pre-line leading-7 text-text-secondary">
                  {business.description}
                </p>
              ) : (
                <p className="mt-3 text-text-secondary">
                  This business has not added a description yet. Call or send an
                  enquiry to learn more about what they offer.
                </p>
              )}

              <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
                {business.address && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        Address
                      </p>
                      <p className="mt-0.5 text-sm text-text-secondary">
                        {business.address}
                        {business.city && `, ${business.city}`}
                        {business.state && `, ${business.state}`}
                      </p>
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          Get directions <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div className="w-full">
                    <p className="text-sm font-semibold text-text-primary">
                      Business hours
                    </p>

                    {business.hours ? (
                      <ul className="mt-1 space-y-0.5 text-sm">
                        {DAYS_OF_WEEK.map((day) => {
                          const dayHours = business.hours[day.key];

                          if (!dayHours) return null;

                          return (
                            <li
                              key={day.key}
                              className="flex items-center justify-between gap-3"
                            >
                              <span className="text-text-secondary">
                                {day.label}
                              </span>
                              <span
                                className={
                                  dayHours.closed
                                    ? "text-danger"
                                    : "text-text-primary"
                                }
                              >
                                {dayHours.closed
                                  ? "Closed"
                                  : `${formatTime(
                                      dayHours.open
                                    )} - ${formatTime(dayHours.close)}`}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-0.5 text-sm text-text-secondary">
                        Hours not available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* CATALOGUE */}
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary">
                    Catalogue
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-text-primary">
                    Products and services
                  </h2>
                </div>
                <ShoppingBag className="text-primary" />
              </div>

              {catalogue.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {catalogue.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                      <h3 className="font-bold text-text-primary">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="mt-1.5 flex-1 text-sm text-text-secondary">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="font-semibold text-primary">
                          {formatPrice(item.price)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setEnquiry({
                              ...enquiry,
                              message: `I would like to know more about "${item.name}".`,
                            })
                          }
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted">
                  This business has not listed any products or services yet.
                </p>
              )}
            </section>

            {/* REVIEWS */}
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary">
                    Reviews
                  </p>
                  <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold text-text-primary">
                    <Users className="text-primary" size={22} />
                    Customer reviews
                  </h2>
                </div>

                {Number(business.rating) > 0 && (
                  <RatingStars
                    rating={business.rating}
                    count={business.reviewCount}
                  />
                )}
              </div>

              <form
                onSubmit={sendReview}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <h3 className="font-bold text-text-primary">
                  Share your experience
                </h3>

                {reviewSuccess && (
                  <p className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    <CheckCircle2 size={16} /> {reviewSuccess}
                  </p>
                )}

                {reviewError && (
                  <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {reviewError}
                  </p>
                )}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text-primary">
                      Your name *
                    </span>
                    <input
                      value={reviewForm.name}
                      onChange={(event) =>
                        setReviewForm({
                          ...reviewForm,
                          name: event.target.value,
                        })
                      }
                      required
                      minLength={2}
                      placeholder="How should we credit you?"
                      className="mt-1.5 w-full rounded-xl border-border"
                    />
                  </label>

                  <fieldset>
                    <legend className="text-sm font-semibold text-text-primary">
                      Your rating *
                    </legend>

                    <div className="mt-1.5 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setReviewForm({ ...reviewForm, rating: value })
                          }
                          aria-label={`${value} star${value > 1 ? "s" : ""}`}
                          aria-pressed={reviewForm.rating === value}
                        >
                          <Star
                            size={26}
                            className={
                              value <= reviewForm.rating
                                ? "fill-warning text-warning"
                                : "text-border"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-text-primary">
                    Your review *
                  </span>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(event) =>
                      setReviewForm({
                        ...reviewForm,
                        comment: event.target.value,
                      })
                    }
                    required
                    minLength={10}
                    rows={3}
                    placeholder="What did you like or dislike?"
                    className="mt-1.5 w-full rounded-xl border-border"
                  />
                </label>

                <button
                  type="submit"
                  disabled={postingReview}
                  className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {postingReview ? "Publishing..." : "Publish review"}
                </button>
              </form>

              {/* REVIEW LIST */}
              <div className="mt-5 space-y-4">
                {visibleReviews.length ? (
                  visibleReviews.map((review) => (
                    <article
                      key={review._id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-text-primary">
                          {review.name}
                        </span>
                        <RatingStars rating={review.rating} size={14} />
                      </div>

                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {review.comment}
                      </p>

                      <p className="mt-2 text-xs text-muted">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted">
                    No reviews yet. Be the first to review this business.
                  </p>
                )}
              </div>

              {reviews.length > REVIEWS_PER_PAGE && (
                <Pagination
                  page={reviewPage}
                  totalPages={reviewPages}
                  onChange={setReviewPage}
                />
              )}
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <form
              onSubmit={sendEnquiry}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-text-primary">
                Send an enquiry
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary">
                {business.name} will get your message directly.
              </p>

              {enquirySuccess && (
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  Enquiry sent. The business will contact you shortly.
                </p>
              )}

              {enquiryError && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {enquiryError}
                </p>
              )}

              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold text-text-primary">
                    Your name *
                  </span>
                  <input
                    value={enquiry.name}
                    onChange={(event) =>
                      setEnquiry({ ...enquiry, name: event.target.value })
                    }
                    required
                    minLength={2}
                    className="mt-1.5 w-full rounded-xl border-border"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-text-primary">
                    Email
                  </span>
                  <input
                    type="email"
                    value={enquiry.email}
                    onChange={(event) =>
                      setEnquiry({ ...enquiry, email: event.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border-border"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-text-primary">
                    Phone
                  </span>
                  <input
                    value={enquiry.phone}
                    onChange={(event) =>
                      setEnquiry({ ...enquiry, phone: event.target.value })
                    }
                    inputMode="numeric"
                    placeholder="10-digit mobile"
                    className="mt-1.5 w-full rounded-xl border-border"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-text-primary">
                    Message *
                  </span>
                  <textarea
                    value={enquiry.message}
                    onChange={(event) =>
                      setEnquiry({ ...enquiry, message: event.target.value })
                    }
                    required
                    minLength={5}
                    rows={4}
                    placeholder="What would you like to know?"
                    className="mt-1.5 w-full rounded-xl border-border"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                {sending ? "Sending..." : "Send enquiry"}
              </button>

              <p className="mt-3 text-center text-xs text-muted">
                Add an email or phone so the business can reply.
              </p>
            </form>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-bold text-text-primary">
                Contact details
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                {business.phone && (
                  <p className="flex items-center gap-3">
                    <Phone size={16} className="shrink-0 text-primary" />
                    <a
                      href={`tel:${business.phone}`}
                      className="text-text-secondary hover:text-primary"
                    >
                      {business.phone}
                    </a>
                  </p>
                )}

                {business.whatsapp && (
                  <p className="flex items-center gap-3">
                    <MessageCircle
                      size={16}
                      className="shrink-0 text-success"
                    />
                    <a
                      href={`https://wa.me/${business.whatsapp.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-secondary hover:text-primary"
                    >
                      {business.whatsapp}
                    </a>
                  </p>
                )}

                {business.email && (
                  <p className="flex items-center gap-3">
                    <Mail size={16} className="shrink-0 text-primary" />
                    <a
                      href={`mailto:${business.email}`}
                      className="truncate text-text-secondary hover:text-primary"
                    >
                      {business.email}
                    </a>
                  </p>
                )}

                <p className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-text-secondary">
                    {business.address}
                    {business.city && `, ${business.city}`}
                    {business.state && `, ${business.state}`}
                  </span>
                </p>
              </div>

              {business.established && (
                <p className="mt-4 border-t border-border pt-4 text-xs text-muted">
                  Established in {business.established}
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* SIMILAR BUSINESSES */}
        {similar.length > 0 && (
          <section className="border-t border-border bg-card">
            <div className="mx-auto max-w-6xl px-6 py-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary">
                    Also nearby
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-text-primary">
                    Similar businesses in {business.category}
                  </h2>
                </div>

                <Link
                  to={`/explore?category=${encodeURIComponent(
                    business.category
                  )}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  See all
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {similar.map((item) => (
                  <Link
                    key={item._id}
                    to={`/business/${item.slug}`}
                    className="group rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                  >
                    <h3 className="font-bold text-text-primary group-hover:text-primary">
                      {item.name}
                    </h3>

                    {item.tagline && (
                      <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary">
                        {item.tagline}
                      </p>
                    )}

                    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                      <MapPin size={13} />
                      {item.area ? `${item.area}, ` : ""}
                      {item.city}
                    </p>

                    {Number(item.rating) > 0 && (
                      <div className="mt-2">
                        <RatingStars
                          rating={item.rating}
                          count={item.reviewCount}
                          size={13}
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
