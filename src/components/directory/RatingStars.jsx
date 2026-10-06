import { Star } from "lucide-react";

/**
 * Read-only star display. Half stars are rendered by overlapping a filled
 * layer, which avoids needing a dedicated half-star icon.
 */
export default function RatingStars({ rating = 0, count, size = 16, showValue = true }) {
  const value = Number(rating || 0);
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="relative inline-flex"
        role="img"
        aria-label={`Rated ${value} out of 5`}
      >
        <span className="inline-flex text-border">
          {[0, 1, 2, 3, 4].map((index) => (
            <Star key={index} size={size} className="fill-current" />
          ))}
        </span>
        <span
          className="absolute inset-0 inline-flex overflow-hidden text-warning"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <Star key={index} size={size} className="shrink-0 fill-current" />
          ))}
        </span>
      </span>

      {showValue && value > 0 && (
        <span className="text-sm font-semibold text-text-primary">{value}</span>
      )}

      {count !== undefined && (
        <span className="text-xs text-muted">
          ({Number(count || 0).toLocaleString("en-IN")})
        </span>
      )}
    </span>
  );
}
