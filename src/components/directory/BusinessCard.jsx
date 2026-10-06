import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, Store } from "lucide-react";

import RatingStars from "./RatingStars";
import {
  categoryIcon,
  getOpenStatus,
  hoursSummary,
  locationLabel,
} from "../../utils/directory";

/**
 * Listing tile used on the explore page, the home page rails and the
 * similar-businesses strip on a business page.
 */
export default function BusinessCard({ business, compact = false }) {
  const Icon = categoryIcon(business.category);
  const status = getOpenStatus(business.hours);
  const phone = (business.phone || "").replace(/\D/g, "");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-panel">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-primary-sky via-white to-secondary-soft">
        {business.logo ? (
          <img
            src={business.logo}
            alt={business.name}
            className="h-20 w-20 rounded-2xl object-cover shadow-md ring-4 ring-white"
            loading="lazy"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-4 ring-white">
            <Icon className="h-10 w-10 text-primary" />
          </div>
        )}

        {business.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          {business.category}
        </p>

        <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-primary">
          <Link to={`/business/${business.slug}`}>{business.name}</Link>
        </h3>

        {!compact && business.tagline && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {business.tagline}
          </p>
        )}

        <p className="mt-3 flex items-start gap-1.5 text-sm text-slate-500">
          <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
          <span className="truncate">{locationLabel(business)}</span>
        </p>

        {Number(business.rating) > 0 && (
          <div className="mt-3">
            <RatingStars rating={business.rating} count={business.reviewCount} />
          </div>
        )}

        <p
          className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            status.open
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Clock size={13} />
          {status.open ? "Open now" : hoursSummary(business.hours)}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link
            to={`/business/${business.slug}`}
            className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary"
          >
            View details
          </Link>

          {phone && (
            <a
              href={`tel:${business.phone}`}
              aria-label={`Call ${business.name}`}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-primary transition hover:border-primary hover:bg-primary-sky"
            >
              <Phone size={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="h-36 animate-pulse bg-slate-200" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <Store className="mx-auto text-muted" size={40} />
      <h2 className="mt-4 text-xl font-bold text-text-primary">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{message}</p>
      {action}
    </div>
  );
}
