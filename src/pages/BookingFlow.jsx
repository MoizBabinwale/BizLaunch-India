import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft,  Check,  Home, MapPin, Store } from "lucide-react";
import {
  createBooking,
  getAvailability,
  getBookingBusiness,
  getBookingServices,
} from "../api/bookingApi";
import { formatPrice, locationLabel } from "../utils/directory";

const inputClass = "mt-1 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm";
const localDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const formatTimeLabel = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${period}`;
};

export default function BookingFlow() {
  const { businessId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(searchParams.get("service") || "");
  const [bookingType, setBookingType] = useState("SHOP");
  const [date, setDate] = useState(localDateKey(new Date()));
  const [timeSlot, setTimeSlot] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [availability, setAvailability] = useState({ slots: [], price: null });
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedService = services.find((service) => service._id === serviceId);
  const appointmentSettings = business?.appointmentSettings || {};
  const homeAvailable = Boolean(
    appointmentSettings.homeServiceEnabled && selectedService?.homeServiceAvailable
  );
  const shopAvailable = Boolean(
    appointmentSettings.shopAppointmentEnabled !== false && selectedService?.shopAvailable !== false
  );

  useEffect(() => {
    let mounted = true;
    Promise.all([getBookingBusiness(businessId), getBookingServices(businessId)])
      .then(([businessResult, servicesResult]) => {
        if (!mounted) return;
        setBusiness(businessResult.business);
        const availableServices = servicesResult.services || [];
        setServices(availableServices);
        const requested = searchParams.get("service");
        if (requested && availableServices.some((service) => service._id === requested)) {
          setServiceId(requested);
        }
      })
      .catch((reason) => {
        if (mounted) setError(reason.message || "Unable to load booking details.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [businessId, searchParams]);

  useEffect(() => {
    if (step < 3 || !business || !serviceId || !date) return undefined;
    let mounted = true;
    setLoadingSlots(true);
    setTimeSlot("");
    getAvailability(businessId, { serviceId, date, bookingType })
      .then((result) => {
        if (!mounted) return;
        setAvailability({ slots: result.slots || [], price: result.price || null });
        setAvailabilityMessage(result.message || "");
      })
      .catch((reason) => {
        if (!mounted) return;
        setAvailability({ slots: [], price: null });
        setAvailabilityMessage(reason.message || "Unable to load appointment times.");
      })
      .finally(() => {
        if (mounted) setLoadingSlots(false);
      });
    return () => { mounted = false; };
  }, [businessId, bookingType, date, serviceId, step, business]);

  useEffect(() => {
    if (selectedService && !shopAvailable && homeAvailable) setBookingType("HOME");
    else if (selectedService && !homeAvailable && !shopAvailable) setBookingType("");
    else if (selectedService && !shopAvailable && bookingType === "SHOP") setBookingType("HOME");
  }, [bookingType, homeAvailable, selectedService, shopAvailable]);

  const maxDate = useMemo(() => {
    const max = new Date();
    max.setDate(max.getDate() + Math.max(1, Number(appointmentSettings.advanceBookingDays) || 30));
    return localDateKey(max);
  }, [appointmentSettings.advanceBookingDays]);

  const price = availability.price;
  const canContinue = [
    Boolean(serviceId),
    Boolean(bookingType) && (bookingType !== "HOME" || customerAddress.trim().length >= 8),
    Boolean(date),
    Boolean(timeSlot),
    Boolean(price),
    Boolean(price),
  ][step];

  const continueStep = () => {
    setError("");
    if (!canContinue) {
      setError(step === 1 && bookingType === "HOME"
        ? "Enter a complete home-service address before continuing."
        : "Complete this step before continuing.");
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    setStep((current) => Math.min(5, current + 1));
  };

  const confirmBooking = async () => {
    setSaving(true);
    setError("");
    try {
      const result = await createBooking({
        businessId,
        serviceId,
        bookingType,
        date,
        timeSlot,
        customerAddress: bookingType === "HOME" ? customerAddress.trim() : "",
        notes: notes.trim(),
      });
      navigate(`/bookings/${result.booking._id}`);
    } catch (reason) {
      setError(reason.message || "Unable to confirm this booking.");
      if (reason.message?.toLowerCase().includes("booked")) setStep(3);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="mx-auto max-w-3xl px-5 py-16 text-center text-muted">Loading booking options…</main>;
  if (error && !business) {
    return <main className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="text-2xl font-bold">Booking unavailable</h1><p className="mt-2 text-muted">{error}</p><Link to="/explore" className="mt-5 inline-block text-primary hover:underline">Back to explore</Link></main>;
  }
  if (!business) return null;

  const steps = ["Service", "Visit type", "Date", "Time", "Summary", "Confirm"];
  const availableSlots = availability.slots.filter((slot) => slot.available);

  return (
    <main className="min-h-screen bg-background pb-28 sm:pb-12">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <Link to={`/business/${business.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to {business.name}</Link>
        <header className="mt-6 rounded-3xl bg-gradient-to-br from-primary to-blue-900 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">Book an appointment</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{business.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-blue-100"><MapPin size={15} />{locationLabel(business)}</p>
          {!appointmentSettings.enabled && <p className="mt-4 rounded-xl bg-white/10 p-3 text-sm">This business has not enabled online appointment booking yet.</p>}
        </header>

        <ol className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {steps.map((label, index) => (
            <li key={label} className={`rounded-xl px-2 py-2 text-center text-xs font-semibold ${step === index ? "bg-primary text-white" : step > index ? "bg-emerald-50 text-emerald-700" : "bg-white text-muted"}`}>
              {step > index && <Check size={13} className="mx-auto mb-1" />}{label}
            </li>
          ))}
        </ol>

        <section className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold text-text-primary">Choose a service</h2>
              <p className="mt-1 text-sm text-muted">Select what you would like {business.name} to do.</p>
              <div className="mt-5 space-y-3">
                {services.map((service) => (
                  <button key={service._id} type="button" onClick={() => { setServiceId(service._id); setTimeSlot(""); }} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${serviceId === service._id ? "border-primary bg-primary-sky ring-2 ring-primary/15" : "border-border hover:border-primary/50"}`}>
                    {service.images?.[0] && <img src={service.images[0]} alt="" className="h-16 w-16 rounded-xl object-cover" />}
                    <span className="min-w-0 flex-1"><span className="block font-bold text-text-primary">{service.name}</span><span className="mt-1 block text-sm text-muted">{service.durationMinutes ? `${service.durationMinutes} min` : "Duration varies"} · {service.description || service.category || "Service"}</span></span>
                    <strong className="shrink-0 text-primary">{formatPrice(service.price)}</strong>
                  </button>
                ))}
                {!services.length && <p className="rounded-xl bg-slate-50 p-5 text-sm text-muted">No bookable services have been published.</p>}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-text-primary">Where would you like the service?</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {shopAvailable && <button type="button" onClick={() => setBookingType("SHOP")} className={`rounded-2xl border p-5 text-left ${bookingType === "SHOP" ? "border-primary bg-primary-sky" : "border-border"}`}><Store className="text-primary" /><strong className="mt-3 block">Visit the shop</strong><span className="mt-1 block text-sm text-muted">{business.address || business.area || business.city}</span></button>}
                {homeAvailable && <button type="button" onClick={() => setBookingType("HOME")} className={`rounded-2xl border p-5 text-left ${bookingType === "HOME" ? "border-primary bg-primary-sky" : "border-border"}`}><Home className="text-primary" /><strong className="mt-3 block">Home service</strong><span className="mt-1 block text-sm text-muted">Available only for services enabled by this business.</span></button>}
              </div>
              {bookingType === "HOME" && <label className="mt-5 block text-sm font-semibold">Service address<textarea className={inputClass} rows={3} minLength={8} maxLength={500} value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} placeholder="House / flat, street, area, city and PIN code" required /></label>}
              <label className="mt-4 block text-sm font-semibold">Notes for the business (optional)<textarea className={inputClass} rows={2} maxLength={1000} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Anything the business should know?" /></label>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-text-primary">Choose a date</h2>
              <p className="mt-1 text-sm text-muted">Online appointments are shown in India Standard Time.</p>
              <label className="mt-5 block max-w-sm text-sm font-semibold">Appointment date<input className={inputClass} type="date" min={localDateKey(new Date())} max={maxDate} value={date} onChange={(event) => setDate(event.target.value)} /></label>
              <p className="mt-3 text-sm text-muted">Book up to {appointmentSettings.advanceBookingDays || 30} days ahead.</p>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-text-primary">Select an available time</h2>
              <p className="mt-1 text-sm text-muted">{new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
              {loadingSlots ? <p className="mt-6 text-sm text-muted">Checking the latest availability…</p> : availableSlots.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{availability.slots.map((slot) => <button key={slot.time} type="button" disabled={!slot.available} onClick={() => setTimeSlot(slot.time)} className={`min-h-12 rounded-xl border px-3 py-3 text-sm font-semibold ${!slot.available ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400 line-through" : timeSlot === slot.time ? "border-primary bg-primary text-white" : "border-border bg-white hover:border-primary hover:text-primary"}`}>{formatTimeLabel(slot.time)}</button>)}</div> : <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{availabilityMessage || "No available appointments on this date. Try another date."}</p>}
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-bold text-text-primary">Review your booking</h2>
              <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 sm:p-5">
                <SummaryRow label="Business" value={business.name} />
                <SummaryRow label="Service" value={`${selectedService?.name} · ${availability.durationMinutes || selectedService?.durationMinutes || 30} min`} />
                <SummaryRow label="Date and time" value={`${date} · ${formatTimeLabel(timeSlot)}`} />
                <SummaryRow label="Booking type" value={bookingType === "HOME" ? "Home service" : "Visit shop"} />
                {bookingType === "HOME" && <SummaryRow label="Address" value={customerAddress} />}
                <div className="border-t border-border pt-3"><SummaryRow label={selectedService?.name || "Service"} value={formatPrice(price?.servicePrice)} /><SummaryRow label="Home service charge" value={formatPrice(price?.homeServiceCharge)} /><SummaryRow label="Total" value={formatPrice(price?.totalAmount)} strong /></div>
              </div>
              {appointmentSettings.cancellationPolicy && <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-900"><strong>Cancellation policy:</strong> {appointmentSettings.cancellationPolicy}</p>}
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-xl font-bold text-text-primary">Confirm appointment</h2>
              <p className="mt-2 text-text-secondary">No payment is collected now. The business will confirm your booking.</p>
              <div className="mt-5 rounded-2xl border border-border p-4"><SummaryRow label="Service" value={selectedService?.name} /><SummaryRow label="Appointment" value={`${date} at ${formatTimeLabel(timeSlot)}`} /><SummaryRow label="Total" value={formatPrice(price?.totalAmount)} strong /></div>
            </>
          )}

          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mt-6 hidden justify-between gap-3 sm:flex">
            <button type="button" disabled={step === 0} onClick={() => { setError(""); setStep((current) => current - 1); }} className="rounded-xl border border-border px-5 py-3 font-semibold disabled:opacity-40">Back</button>
            {step < 5 ? <button type="button" disabled={loadingSlots || (step === 4 && !price)} onClick={continueStep} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">Continue</button> : <button type="button" disabled={saving} onClick={confirmBooking} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Confirming…" : "Confirm booking"}</button>}
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border bg-white/95 p-3 backdrop-blur sm:hidden">
          <div className="min-w-0"><p className="text-xs text-muted">{selectedService?.name || "Choose a service"}</p><strong className="text-primary">{formatPrice(price?.totalAmount || selectedService?.price)}</strong></div>
          {step > 0 && <button type="button" onClick={() => { setError(""); setStep((current) => current - 1); }} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold">Back</button>}
          {step < 5 ? <button type="button" disabled={loadingSlots || (step === 4 && !price)} onClick={continueStep} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Continue</button> : <button type="button" disabled={saving} onClick={confirmBooking} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Confirming…" : "Confirm"}</button>}
        </div>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return <div className="flex items-start justify-between gap-4 py-1"><span className={`text-sm ${strong ? "font-bold text-text-primary" : "text-muted"}`}>{label}</span><span className={`text-right text-sm ${strong ? "font-bold text-primary" : "font-semibold text-text-primary"}`}>{value}</span></div>;
}
