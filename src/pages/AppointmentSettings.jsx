import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Save } from "lucide-react";
import { getMyBusiness, updateBusiness } from "../api/businessApi";

const DAYS = [
  ["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"],
  ["thu", "Thursday"], ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"],
];
const DEFAULTS = {
  enabled: false,
  workingDays: ["mon", "tue", "wed", "thu", "fri", "sat"],
  openingTime: "09:00",
  closingTime: "18:00",
  slotDurationMinutes: 30,
  bufferMinutes: 0,
  maxBookingsPerSlot: 1,
  advanceBookingDays: 30,
  cancellationPolicy: "",
  homeServiceEnabled: false,
  shopAppointmentEnabled: true,
  homeServiceCharge: 0,
  serviceRadiusKm: 0,
};
const inputClass = "mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm";

export default function AppointmentSettings() {
  const [business, setBusiness] = useState(null);
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMyBusiness();
      setBusiness(result.business);
      setSettings({ ...DEFAULTS, ...(result.business.appointmentSettings || {}) });
    } catch (reason) {
      if (!/not found/i.test(reason.message || "")) setError(reason.message || "Unable to load appointment settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox"
        ? checked
        : type === "number" || name === "slotDurationMinutes"
          ? Number(value)
          : value,
    }));
    setNotice("");
    setError("");
  };

  const toggleDay = (day) => {
    setSettings((current) => ({
      ...current,
      workingDays: current.workingDays.includes(day)
        ? current.workingDays.filter((value) => value !== day)
        : [...current.workingDays, day],
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    if (!business) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await updateBusiness(business._id, {
        appointmentSettings: settings,
      });
      setBusiness(result.business);
      setSettings({ ...DEFAULTS, ...(result.business.appointmentSettings || {}) });
      setNotice("Appointment settings saved.");
    } catch (reason) {
      setError(reason.message || "Unable to save appointment settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-muted">Loading appointment settings...</p>;
  if (!business) {
    return <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-card p-10 text-center"><CalendarClock className="mx-auto text-primary" size={36} /><h1 className="mt-4 text-2xl font-bold">Set up your business first</h1><p className="mt-2 text-text-secondary">Create a shop profile before configuring bookings.</p><Link to="/dashboard/my-business" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white">Set up my shop</Link>{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}</div>;
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Bookings</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">Appointment settings</h1>
        <p className="mt-2 text-text-secondary">Set when customers can book a service at {business.name}.</p>
      </header>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
      <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <label className="flex items-center gap-3 rounded-xl bg-primary-sky p-4 font-semibold text-text-primary">
          <input type="checkbox" name="enabled" checked={Boolean(settings.enabled)} onChange={update} className="rounded border-border text-primary focus:ring-primary" />
          Enable online appointments
        </label>
        <fieldset>
          <legend className="text-sm font-semibold text-text-primary">Working days</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DAYS.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm">
                <input type="checkbox" checked={settings.workingDays.includes(key)} onChange={() => toggleDay(key)} className="rounded border-border text-primary focus:ring-primary" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Opening time<input className={inputClass} type="time" name="openingTime" value={settings.openingTime} onChange={update} required /></label>
          <label className="text-sm font-semibold">Closing time<input className={inputClass} type="time" name="closingTime" value={settings.closingTime} onChange={update} required /></label>
          <label className="text-sm font-semibold">Slot duration<select className={inputClass} name="slotDurationMinutes" value={[15, 30, 45, 60].includes(Number(settings.slotDurationMinutes)) ? settings.slotDurationMinutes : "custom"} onChange={(event) => setSettings((current) => ({ ...current, slotDurationMinutes: event.target.value === "custom" ? 20 : Number(event.target.value) }))}><option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>60 minutes</option><option value="custom">Custom</option></select></label>
          {!([15, 30, 45, 60].includes(Number(settings.slotDurationMinutes))) && <label className="text-sm font-semibold">Custom slot duration (minutes)<input className={inputClass} type="number" min="5" max="240" name="slotDurationMinutes" value={settings.slotDurationMinutes} onChange={update} required /></label>}
          <label className="text-sm font-semibold">Buffer between appointments (minutes)<input className={inputClass} type="number" min="0" max="180" name="bufferMinutes" value={settings.bufferMinutes} onChange={update} /></label>
          <label className="text-sm font-semibold">Maximum concurrent bookings per slot<input className={inputClass} type="number" min="1" max="20" name="maxBookingsPerSlot" value={settings.maxBookingsPerSlot} onChange={update} /></label>
          <label className="text-sm font-semibold">Advance booking window (days)<input className={inputClass} type="number" min="1" max="180" name="advanceBookingDays" value={settings.advanceBookingDays} onChange={update} /></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm font-semibold"><input type="checkbox" name="shopAppointmentEnabled" checked={Boolean(settings.shopAppointmentEnabled)} onChange={update} className="rounded border-border text-primary focus:ring-primary" /> Allow shop appointments</label>
          <label className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm font-semibold"><input type="checkbox" name="homeServiceEnabled" checked={Boolean(settings.homeServiceEnabled)} onChange={update} className="rounded border-border text-primary focus:ring-primary" /> Offer home services</label>
        </div>
        {settings.homeServiceEnabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Default home service charge (₹)<input className={inputClass} type="number" min="0" step="0.01" name="homeServiceCharge" value={settings.homeServiceCharge} onChange={update} /></label>
            <label className="text-sm font-semibold">Service radius (km, optional)<input className={inputClass} type="number" min="0" step="1" name="serviceRadiusKm" value={settings.serviceRadiusKm} onChange={update} /><span className="mt-1 block text-xs font-normal text-muted">Informational only; travel distance is not estimated without verified coordinates.</span></label>
          </div>
        )}
        <label className="block text-sm font-semibold">Cancellation policy<textarea className={inputClass} rows={3} maxLength={1000} name="cancellationPolicy" value={settings.cancellationPolicy} onChange={update} placeholder="Explain when customers may cancel or request a change." /></label>
      </section>
      <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:opacity-60"><Save size={17} />{saving ? "Saving..." : "Save appointment settings"}</button>
    </form>
  );
}
