import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";
import { getBooking } from "../api/bookingApi";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooking(id)
      .then((result) => setBooking(result.booking))
      .catch((reason) => setError(reason.message || "Unable to load this booking."));
  }, [id]);

  if (error) return <main className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="text-2xl font-bold">Booking unavailable</h1><p className="mt-2 text-muted">{error}</p><Link to="/bookings" className="mt-5 inline-block text-primary">Back to bookings</Link></main>;
  if (!booking) return <main className="px-5 py-20 text-center text-muted">Loading booking…</main>;

  const business = booking.business || {};
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link to="/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> My bookings</Link>
        <section className="mt-5 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="bg-gradient-to-br from-primary to-blue-900 p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-blue-100">Booking ID</p><h1 className="mt-1 text-2xl font-bold">{booking.bookingId}</h1><span className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">{booking.status.replace("_", " ")}</span></div>
          <div className="space-y-5 p-6 sm:p-8">
            <div><p className="text-sm text-muted">Business</p><h2 className="mt-1 text-lg font-bold">{business.name}</h2><p className="text-sm text-text-secondary">{[business.area, business.city].filter(Boolean).join(", ")}</p>{business.slug && <Link to={`/business/${business.slug}`} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">View business</Link>}</div>
            <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2"><div><p className="text-xs text-muted">Service</p><p className="mt-1 font-semibold">{booking.serviceName}</p></div><div><p className="text-xs text-muted">Booking type</p><p className="mt-1 font-semibold">{booking.bookingType === "HOME" ? "Home service" : "Visit shop"}</p></div><div><p className="text-xs text-muted">Date and time</p><p className="mt-1 flex items-center gap-2 font-semibold"><CalendarDays size={15} />{new Date(`${booking.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}<Clock3 size={15} />{booking.timeSlot}</p></div><div><p className="text-xs text-muted">Customer</p><p className="mt-1 font-semibold">{booking.customer?.name || "You"}</p></div></div>
            {booking.bookingType === "HOME" && booking.customerAddress && <div><p className="text-sm text-muted">Service address</p><p className="mt-1 flex gap-2 text-sm font-medium"><MapPin size={16} className="shrink-0 text-primary" />{booking.customerAddress}</p></div>}
            {booking.notes && <div><p className="text-sm text-muted">Notes</p><p className="mt-1 text-sm">{booking.notes}</p></div>}
            <div className="border-t border-border pt-4"><p className="mb-2 font-semibold">Price summary</p><PriceRow label="Service price" amount={booking.servicePrice} /><PriceRow label="Home service charge" amount={booking.homeServiceCharge} /><PriceRow label="Total" amount={booking.totalAmount} strong /></div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PriceRow({ label, amount, strong = false }) {
  return <div className="flex justify-between py-1"><span className={`text-sm ${strong ? "font-bold" : "text-muted"}`}>{label}</span><span className={`text-sm ${strong ? "font-bold text-primary" : "font-medium"}`}>₹{Number(amount || 0).toLocaleString("en-IN")}</span></div>;
}
