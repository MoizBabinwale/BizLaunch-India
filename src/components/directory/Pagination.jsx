import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Page numbers with ellipsis. Always shows first/last page plus a window
 * around the current page so the control stays a fixed width.
 */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);

  const items = [];
  let previous = 0;

  sorted.forEach((value) => {
    if (previous && value - previous > 1) items.push("gap");
    items.push(value);
    previous = value;
  });

  const button =
    "flex h-10 min-w-10 items-center justify-center rounded-xl border border-border px-3 text-sm font-semibold transition";

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${button} text-primary disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-muted">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${button} ${
              item === page
                ? "border-primary bg-primary text-white"
                : "bg-card text-text-secondary hover:border-primary hover:text-primary"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={`${button} text-primary disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
