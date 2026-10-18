import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Check, X } from "lucide-react";
import { getBusinessBookings, updateBusinessBooking } from "../api/bookingApi";
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

export default function BusinessBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [rescheduling, setRescheduling] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const today = localDateKey();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getBusinessBookings();
      setBookings(result.bookings || []);
    } catch (reason) {
      setError(reason.message || "Unable to load business bookings.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const act = async (booking, action, extra = {}) => {
    setSavingId(booking._id);
    setError("");
    setNotice("");
    try {
      await updateBusinessBooking(booking._id, { action, ...extra });
      setRescheduling(null);
      setNotice(action === "RESCHEDULE" ? "Appointment rescheduled." : `Booking ${action.toLowerCase().replace("_", " ")}d.`);
      await load();
    } catch (reason) {
      setError(reason.message || "Unable to update this booking.");
    } finally {
      setSavingId("");
    }
  };

  const visible = bookings.filter((booking) => {
    if (tab === "cancelled") return ["CANCELLED", "REJECTED"].includes(booking.status);
    if (tab === "past") return booking.date < today || ["COMPLETED", "NO_SHOW"].includes(booking.status);
    if (tab === "today") return booking.date === today && !["CANCELLED", "REJECTED"].includes(booking.status);
    return booking.date >= today && !["CANCELLED", "REJECTED", "COMPLETED", "NO_SHOW"].includes(booking.status);
  });

  const openReschedule = (booking) => {
    setRescheduling(booking);
    setNewDate(booking.date);
    setNewTime(booking.timeSlot);
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <header><p className="text-sm font-bold uppercase tracking-widest text-primary">Business dashboard</p><h1 className="mt-1 text-3xl font-bold text-text-primary">Bookings</h1><p className="mt-2 text-text-secondary">Review customer appointments and keep their status up to date.</p></header>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
      <div className="flex gap-2 overflow-x-auto border-b border-border">{[["today", "Today"], ["upcoming", "Upcoming"], ["past", "Past"], ["cancelled", "Cancelled"]].map(([key, label]) => <button key={key} type="button" onClick={() => setTab(key)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold ${tab === key ? "border-primary text-primary" : "border-transparent text-muted"}`}>{label}</button>)}</div>
      {loading ? <p className="py-12 text-center text-muted">Loading appointments…</p> : visible.length ? <div className="space-y-4">{visible.map((booking) => <article key={booking._id} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">{booking.bookingId}</p><h2 className="mt-1 text-lg font-bold">{booking.customer?.name || "Customer"} · {booking.serviceName}</h2><p className="mt-2 text-sm text-text-secondary">{new Date(`${booking.date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {booking.timeSlot} · {booking.bookingType === "HOME" ? "Home service" : "Visit shop"}</p>{booking.bookingType === "HOME" && <p className="mt-1 text-sm text-text-secondary">{booking.customerAddress}</p>}<p className="mt-2 text-sm font-semibold text-primary">{formatPrice(booking.totalAmount)}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusClass[booking.status] || statusClass.PENDING}`}>{booking.status.replace("_", " ")}</span></div><div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4"><Link to={`/bookings/${booking._id}`} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">Details</Link>{booking.status === "PENDING" && <><button disabled={savingId === booking._id} onClick={() => act(booking, "CONFIRM")} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"><Check size={15} /> Confirm</button><button disabled={savingId === booking._id} onClick={() => act(booking, "REJECT")} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"><X size={15} /> Reject</button></>}{["PENDING", "CONFIRMED"].includes(booking.status) && <button disabled={savingId === booking._id} onClick={() => openReschedule(booking)} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold disabled:opacity-50">Reschedule</button>}{booking.status === "CONFIRMED" && <button disabled={savingId === booking._id} onClick={() => act(booking, "IN_PROGRESS")} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary disabled:opacity-50">Mark in progress</button>}{["CONFIRMED", "IN_PROGRESS"].includes(booking.status) && <button disabled={savingId === booking._id} onClick={() => act(booking, "COMPLETE")} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Mark completed</button>}{["PENDING", "CONFIRMED"].includes(booking.status) && <button disabled={savingId === booking._id} onClick={() => act(booking, "CANCEL")} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">Cancel</button>}</div></article>)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><CalendarClock className="mx-auto text-muted" size={36} /><h2 className="mt-3 text-lg font-bold">No bookings in this view</h2><p className="mt-2 text-sm text-muted">Customer appointments will appear here.</p></div>}
      {rescheduling && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4"><form onSubmit={(event) => { event.preventDefault(); act(rescheduling, "RESCHEDULE", { date: newDate, timeSlot: newTime }); }} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold">Reschedule appointment</h2><p className="text-sm text-muted">{rescheduling.bookingId} · {rescheduling.serviceName}</p><label className="block text-sm font-semibold">New date<input className="mt-1 w-full rounded-xl border border-border px-3 py-3" type="date" min={today} value={newDate} onChange={(event) => setNewDate(event.target.value)} required /></label><label className="block text-sm font-semibold">New time<input className="mt-1 w-full rounded-xl border border-border px-3 py-3" type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} required /></label><p className="text-xs text-muted">The new time is checked against the service schedule and concurrent booking limits.</p><div className="flex justify-end gap-2"><button type="button" onClick={() => setRescheduling(null)} className="rounded-xl border border-border px-4 py-2.5 font-semibold">Close</button><button disabled={savingId === rescheduling._id} className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-white disabled:opacity-60">{savingId === rescheduling._id ? "Saving…" : "Save new time"}</button></div></form></div>}
    </main>
  );
}
