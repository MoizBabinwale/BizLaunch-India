import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, ExternalLink, Globe2, LoaderCircle, MapPin, Save } from "lucide-react";
import { createBusiness, getMyBusiness, updateBusiness } from "../api/businessApi";
import PhotoField from "../components/common/PhotoField";
import LocationPicker from "../components/common/LocationPicker";

const categories = ["Restaurants", "Hotels", "Beauty Spa", "Home Decor", "Wedding Planning", "Education", "Rent & Hire", "Hospitals", "Contractors", "Pet Shops", "PG/Hostels", "Estate Agent", "Dentists", "Gym", "Loans", "Kirana / General Store", "Salon / Barber", "Hardware", "Automobile", "Fashion", "Medical", "Electronics", "Flowers / Gifts", "Other"];
const days = [
  ["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"],
  ["thu", "Thursday"], ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"],
];
const dayHours = { open: "09:00", close: "18:00", closed: false };
const defaultHours = Object.fromEntries(days.map(([key]) => [key, { ...dayHours }]));
const emptyForm = {
  name: "", category: categories[0], tagline: "", description: "", phone: "",
  whatsapp: "", address: "", area: "", city: "", state: "", postalCode: "",
  googleMapsUrl: "", latitude: "", longitude: "", hours: defaultHours, logo: "", gallery: [], published: false,
};
const phonePattern = /^[6-9]\d{9}$/;

function BusinessField({
  name,
  label,
  required = false,
  placeholder,
  type = "text",
  maxLength,
  value,
  onChange,
  className,
  error,
}) {
  return (
    <label className="block text-sm font-semibold text-text-primary">
      {label}{required && <span className="text-red-600"> *</span>}
      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={className}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

export default function MyBusinessPage() {
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyBusiness()
      .then(({ business: data }) => {
        setBusiness(data);
        setForm({
          ...emptyForm,
          ...data,
          latitude: data.location?.latitude ?? "",
          longitude: data.location?.longitude ?? "",
          hours: Object.fromEntries(days.map(([key]) => [key, { ...dayHours, ...(data.hours?.[key] || {}) }])),
          published: Boolean(data.published),
        });
      })
      .catch((reason) => {
        if (!/not found/i.test(reason.message || "")) setError(reason.message || "Unable to load your business profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const update = ({ target: { name, value, type, checked } }) => {
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setError("");
    setNotice("");
  };

  const updateHours = (key, field, value) => {
    setForm((current) => ({
      ...current,
      hours: { ...current.hours, [key]: { ...current.hours[key], [field]: value } },
    }));
    setNotice("");
  };

  const applyMondayHours = () => {
    const monday = form.hours.mon;
    setForm((current) => ({
      ...current,
      hours: Object.fromEntries(days.map(([key]) => [key, { ...monday }])),
    }));
  };

  const validate = () => {
    const next = {};
    const phone = form.phone.replace(/\D/g, "");
    const whatsapp = form.whatsapp.replace(/\D/g, "");
    if (form.name.trim().length < 2 || form.name.trim().length > 120) next.name = "Use 2–120 characters.";
    if (form.tagline.trim().length > 140) next.tagline = "Keep the tagline under 140 characters.";
    if (form.description.trim().length > 3000) next.description = "Keep the description under 3,000 characters.";
    if (form.phone && !phonePattern.test(phone)) next.phone = "Enter a valid 10-digit Indian number.";
    if (form.whatsapp && !phonePattern.test(whatsapp)) next.whatsapp = "Enter a valid 10-digit Indian number.";
    if (form.postalCode && !/^\d{6}$/.test(form.postalCode.trim())) next.postalCode = "Enter a valid 6-digit Indian PIN code.";
    const hasLatitude = String(form.latitude).trim() !== "";
    const hasLongitude = String(form.longitude).trim() !== "";
    if (hasLatitude !== hasLongitude) next.latitude = "Enter both latitude and longitude to enable distance-based results.";
    if (hasLatitude && (!Number.isFinite(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)) next.latitude = "Enter a latitude between -90 and 90.";
    if (hasLongitude && (!Number.isFinite(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)) next.longitude = "Enter a longitude between -180 and 180.";
    if (form.googleMapsUrl) {
      try {
        const url = new URL(form.googleMapsUrl);
        const host = url.hostname.toLowerCase();
        const isGoogleMapsHost =
          host === "maps.app.goo.gl" ||
          (host === "goo.gl" && url.pathname.startsWith("/maps")) ||
          ((host === "google.com" || host.endsWith(".google.com") || host === "google.co.in") &&
            url.pathname.startsWith("/maps"));
        if (url.protocol !== "https:" || !isGoogleMapsHost) {
          next.googleMapsUrl = "Use a secure Google Maps link.";
        }
      } catch (_error) {
        next.googleMapsUrl = "Enter a valid Google Maps link.";
      }
    }
    if (form.published) {
      if (form.description.trim().length < 20) next.description = "Add at least 20 characters before publishing.";
      if (!phone && !whatsapp) next.phone = "Add a phone or WhatsApp number before publishing.";
      if (!form.city.trim()) next.city = "City is required before publishing.";
      if (!form.state.trim()) next.state = "State is required before publishing.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        ...form,
        phone: form.phone.replace(/\D/g, ""),
        whatsapp: form.whatsapp.replace(/\D/g, ""),
        postalCode: form.postalCode.trim(),
        location: {
          latitude: form.latitude === "" ? null : Number(form.latitude),
          longitude: form.longitude === "" ? null : Number(form.longitude),
        },
      };
      const result = business
        ? await updateBusiness(business._id, payload)
        : await createBusiness(payload);
      setBusiness(result.business);
      setForm({
        ...emptyForm,
        ...result.business,
        latitude: result.business.location?.latitude ?? "",
        longitude: result.business.location?.longitude ?? "",
        hours: Object.fromEntries(days.map(([key]) => [key, { ...dayHours, ...(result.business.hours?.[key] || {}) }])),
        published: Boolean(result.business.published),
      });
      setNotice(result.business.published ? "Your business page is live and ready to receive enquiries." : "Business profile saved as a draft.");
    } catch (reason) {
      setError(reason.message || "We could not save your business profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-muted">Loading your business profile...</p>;

  const fieldClass = (name) =>
    `mt-1 block box-border min-w-0 w-full rounded-xl border px-3 py-2.5 text-sm leading-5 ${errors[name] ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-border focus:border-primary focus:ring-primary/10"}`;
  const mapQuery = [form.name, form.address, form.area, form.city, form.state, form.postalCode].filter(Boolean).join(", ");
  const mapsUrl = form.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery || "shops near me")}`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-primary">My business</p>
        <h1 className="mt-1 text-3xl font-bold">Create your shop page</h1>
        <p className="mt-2 text-text-secondary">Complete your shop details, location and weekly opening hours. Publishing makes your page searchable and lets customers send enquiries.</p>
      </header>

      <form noValidate onSubmit={submit} className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <section>
          <h2 className="text-lg font-bold text-text-primary">Business details</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <BusinessField name="name" label="Business name" value={form.name} onChange={update} className={fieldClass("name")} error={errors.name} required placeholder="e.g. Sharma Electronics" maxLength={120} />
            <BusinessField name="tagline" label="Short tagline" value={form.tagline} onChange={update} className={fieldClass("tagline")} error={errors.tagline} placeholder="e.g. Trusted electronics in Indore" maxLength={140} />
            <BusinessField name="phone" label="Business phone" value={form.phone} onChange={update} className={fieldClass("phone")} error={errors.phone} placeholder="10-digit mobile number" type="tel" />
            <BusinessField name="whatsapp" label="WhatsApp number" value={form.whatsapp} onChange={update} className={fieldClass("whatsapp")} error={errors.whatsapp} placeholder="10-digit mobile number" type="tel" />
            <label className="text-sm font-semibold text-text-primary">Business type<select name="category" value={form.category} onChange={update} className={fieldClass("category")}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          </div>
          <label className="mt-5 block text-sm font-semibold text-text-primary">About your shop<textarea name="description" rows="5" value={form.description || ""} onChange={update} maxLength="3000" placeholder="Describe your products, services, experience and what customers can expect." className={fieldClass("description")} aria-invalid={Boolean(errors.description)} />{errors.description ? <span className="mt-1 block text-xs font-medium text-red-600">{errors.description}</span> : <span className="mt-1 block text-xs text-muted">{(form.description || "").length}/3,000 characters</span>}</label>
        </section>

        <section className="border-t border-border pt-6">
          <PhotoField
            label="Shop photos"
            value={form.gallery || []}
            onChange={(gallery) => setForm((current) => ({
              ...current,
              gallery,
              logo: gallery.includes(current.logo) ? current.logo : "",
            }))}
            profilePhoto={form.logo}
            onSelectProfilePhoto={(logo) => setForm((current) => ({ ...current, logo }))}
          />
        </section>

        <section className="border-t border-border pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="flex items-center gap-2 text-lg font-bold text-text-primary"><MapPin size={19} className="text-primary" /> Shop location</h2><p className="mt-1 text-sm text-text-secondary">Set the address customers can visit. Google Maps opens in a new tab; paste your shop’s share link below if you have one.</p></div>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-sky"><ExternalLink size={16} /> Open Google Maps</a>
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <LocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onSelect={(location) => {
                  setForm((current) => ({ ...current, ...location }));
                  setError("");
                  setNotice("");
                }}
              />
              <p className="mt-2 text-xs text-muted">Selecting a point fills the address, locality, city, state, PIN code, coordinates, and Maps link when Google provides them.</p>
            </div>
            <BusinessField name="address" label="Street address" value={form.address} onChange={update} className={fieldClass("address")} error={errors.address} placeholder="Shop no., street and locality" maxLength={240} />
            <BusinessField name="area" label="Area / neighbourhood" value={form.area} onChange={update} className={fieldClass("area")} error={errors.area} placeholder="e.g. Vijay Nagar" maxLength={120} />
            <BusinessField name="city" label="City" value={form.city} onChange={update} className={fieldClass("city")} error={errors.city} required={form.published} placeholder="e.g. Indore" maxLength={100} />
            <BusinessField name="state" label="State" value={form.state} onChange={update} className={fieldClass("state")} error={errors.state} required={form.published} placeholder="e.g. Madhya Pradesh" maxLength={100} />
            <BusinessField name="postalCode" label="PIN code" value={form.postalCode} onChange={update} className={fieldClass("postalCode")} error={errors.postalCode} placeholder="6-digit PIN code" maxLength={6} />
            <BusinessField name="googleMapsUrl" label="Google Maps share link" value={form.googleMapsUrl} onChange={update} className={fieldClass("googleMapsUrl")} error={errors.googleMapsUrl} placeholder="https://maps.app.goo.gl/..." type="url" maxLength={500} />
            <BusinessField name="latitude" label="Map latitude (optional)" value={form.latitude} onChange={update} className={fieldClass("latitude")} error={errors.latitude} placeholder="e.g. 22.7196" type="number" />
            <BusinessField name="longitude" label="Map longitude (optional)" value={form.longitude} onChange={update} className={fieldClass("longitude")} error={errors.longitude} placeholder="e.g. 75.8577" type="number" />
          </div>
          <p className="mt-2 text-xs text-muted">Coordinates are optional and used only for real distance-based search. Find them by opening your shop in Google Maps and copying the map pin coordinates; Google Places API is not required.</p>
        </section>

        <section className="border-t border-border pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="flex items-center gap-2 text-lg font-bold text-text-primary"><Clock3 size={19} className="text-primary" /> Weekly opening hours</h2><p className="mt-1 text-sm text-text-secondary">Choose open days and set times for each day. Times use your device’s local time.</p></div>
            <button type="button" onClick={applyMondayHours} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-slate-50">Copy Monday to every day</button>
          </div>
          <div className="mt-4 space-y-3">
            {days.map(([key, label]) => {
              const schedule = form.hours[key] || dayHours;
              return (
                <div key={key} className="grid items-center gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1fr_1fr_1fr_1fr]">
                  <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={!schedule.closed} onChange={(event) => updateHours(key, "closed", !event.target.checked)} className="rounded border-border text-primary focus:ring-primary" />{label}</label>
                  {schedule.closed ? <p className="text-sm text-muted sm:col-span-3">Closed</p> : <>
                    <label className="text-xs font-semibold text-muted">Opens<input type="time" value={schedule.open} onChange={(event) => updateHours(key, "open", event.target.value)} className={fieldClass(`hours-${key}-open`)} /></label>
                    <label className="text-xs font-semibold text-muted">Closes<input type="time" value={schedule.close} onChange={(event) => updateHours(key, "close", event.target.value)} className={fieldClass(`hours-${key}-close`)} /></label>
                  </>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border pt-6">
          <label className="flex items-start gap-3 rounded-xl border border-border bg-slate-50 p-4 text-sm font-semibold text-text-primary"><input name="published" type="checkbox" checked={Boolean(form.published)} onChange={update} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary" /><span>Publish this page so customers can discover it and send enquiries.<span className="mt-1 block text-xs font-normal text-muted">Requires an about section, city, state and a phone or WhatsApp number.</span></span></label>
          {error && <p role="alert" className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700"><AlertCircle size={18} /> {error}</p>}
          {notice && <p role="status" className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700"><CheckCircle2 size={18} /> {notice}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-3"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">{saving ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}{saving ? "Saving..." : "Save profile"}</button>{business?.published && <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700"><CheckCircle2 size={17} /> Live on BizLaunch</span>}</div>
        </section>
      </form>
      {business?.slug && <a href={`/business/${business.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Globe2 size={17} /> View public page</a>}
    </div>
  );
}
