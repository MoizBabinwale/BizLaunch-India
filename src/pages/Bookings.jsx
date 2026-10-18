import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { cancelBooking, getMyBookings } from "../api/bookingApi";
import { formatPrice } from "../utils/directory";

const localDateKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};
const statusClass = {
  PENDING: "bg-amber-50 text-amber-800",
  CONFIRMED: "bg-emerald-50 text-emerald-800",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-600",
  COMPLETED: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-violet-50 text-violet-700",
  NO_SHOW: "bg-slate-100 text-slate-600",
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const today = localDateKey();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyBookings();
      setBookings(result.bookings || []);
    } catch (reason) {
      setError(reason.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cancel = async (booking) => {
    if (!window.confirm(`Cancel your booking at ${booking.business?.name}?`)) return;
    setError("");
    setNotice("");
    try {
      await cancelBooking(booking._id);
      setNotice("Booking cancelled. The appointment slot is available again.");
      await load();
    } catch (reason) {
      setError(reason.message || "Unable to cancel this booking.");
    }
  };

  const visible = bookings.filter((booking) => {
    if (tab === "cancelled") return ["CANCELLED", "REJECTED"].includes(booking.status);
    if (tab === "past") return booking.date < today || ["COMPLETED", "NO_SHOW"].includes(booking.status);
    return booking.date >= today && !["CANCELLED", "REJECTED", "COMPLETED", "NO_SHOW"].includes(booking.status);
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <header><p className="text-sm font-bold uppercase tracking-widest text-primary">Your account</p><h1 className="mt-1 text-3xl font-bold text-text-primary">My bookings</h1><p className="mt-2 text-text-secondary">View upcoming appointments and your booking history.</p></header>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-border">
          {[["upcoming", "Upcoming"], ["past", "Past"], ["cancelled", "Cancelled"]].map(([key, label]) => <button key={key} type="button" onClick={() => setTab(key)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold ${tab === key ? "border-primary text-primary" : "border-transparent text-muted"}`}>{label}</button>)}
        </div>
        {loading ? <p className="py-12 text-center text-muted">Loading your bookings…</p> : visible.length ? <div className="mt-5 space-y-4">{visible.map((booking) => <article key={booking._id} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{booking.business?.name || "Business"}</p><h2 className="mt-1 text-lg font-bold text-text-primary">{booking.serviceName}</h2><p className="mt-2 flex items-center gap-2 text-sm text-text-secondary"><CalendarDays size={15} />{new Date(`${booking.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}<Clock3 size={15} className="ml-2" />{booking.timeSlot}</p><p className="mt-1 flex items-center gap-2 text-sm text-text-secondary"><MapPin size={15} />{booking.bookingType === "HOME" ? "Home service" : "Visit shop"} · {[booking.business?.area, booking.business?.city].filter(Boolean).join(", ")}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusClass[booking.status] || statusClass.PENDING}`}>{booking.status.replace("_", " ")}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><span className="font-bold text-primary">{formatPrice(booking.totalAmount)}</span><div className="flex gap-2"><Link to={`/bookings/${booking._id}`} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">View booking</Link>{tab === "upcoming" && ["PENDING", "CONFIRMED"].includes(booking.status) && <button type="button" onClick={() => cancel(booking)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Cancel</button>}</div></div></article>)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-10 text-center"><CalendarDays className="mx-auto text-muted" size={36} /><h2 className="mt-3 text-lg font-bold">Nothing here yet</h2><p className="mt-2 text-sm text-muted">{tab === "upcoming" ? "Find a local service and book an appointment." : "Bookings in this section will appear here."}</p>{tab === "upcoming" && <Link to="/explore" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white">Explore businesses</Link>}</div>}
      </div>
    </main>
  );
}
