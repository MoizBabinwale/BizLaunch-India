import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, ExternalLink, MapPin, Plus, Store, Trash2 } from "lucide-react";
import { createBusiness, getMyBusiness } from "../api/businessApi";
import { createProduct, createService } from "../api/catalogueApi";
import { CATEGORIES } from "../config/directory";
import PhotoField from "../components/common/PhotoField";
import LocationPicker from "../components/common/LocationPicker";

const DAYS = [
  ["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"],
  ["thu", "Thursday"], ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"],
];
const freshHours = () => Object.fromEntries(DAYS.map(([day]) => [
  day,
  { open: "09:00", close: "18:00", closed: false },
]));
const freshProduct = () => ({ name: "", category: "", price: "", stock: "", images: [] });
const freshForm = () => ({
  name: "",
  category: "",
  subcategory: "",
  description: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  area: "",
  city: "",
  state: "",
  postalCode: "",
  logo: "",
  gallery: [],
  googleMapsUrl: "",
  latitude: "",
  longitude: "",
  hours: freshHours(),
  openingTime: "09:00",
  closingTime: "18:00",
  workingDays: ["mon", "tue", "wed", "thu", "fri", "sat"],
  slotDurationMinutes: 30,
  atShop: true,
  homeVisit: false,
  serviceName: "",
  serviceDescription: "",
  servicePrice: "",
  serviceDurationMinutes: 30,
  serviceImages: [],
  homeServiceCharge: 0,
  serviceRadiusKm: "",
  vehicleType: "",
  fuelRates: [
    { fuelType: "PETROL", price: "", unit: "LITRE" },
    { fuelType: "DIESEL", price: "", unit: "LITRE" },
    { fuelType: "CNG", price: "", unit: "KG" },
  ],
  evChargers: [{ connectorType: "", powerKw: "", quantity: 1, available: true }],
  products: [freshProduct()],
});

const fieldClass = "mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";

export default function RegisterShop() {
  const navigate = useNavigate();
  const [form, setForm] = useState(freshForm);
  const [checkingBusiness, setCheckingBusiness] = useState(true);
  const [existingBusiness, setExistingBusiness] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [created, setCreated] = useState(false);

  useEffect(() => {
    getMyBusiness()
      .then(({ business }) => setExistingBusiness(business))
      .catch((reason) => {
        if (!/not found/i.test(reason.message || "")) setError(reason.message || "Unable to check your business profile.");
      })
      .finally(() => setCheckingBusiness(false));
  }, []);

  const sector = useMemo(
    () => CATEGORIES.find((category) => category.name === form.category),
    [form.category]
  );
  const subcategory = sector?.subcategories.find((item) => item.name === form.subcategory);
  const serviceType = subcategory?.serviceType || "";
  const isStation = serviceType === "station";
  const isService = serviceType === "service";
  const isDispatch = serviceType === "dispatch";
  const isRetail = serviceType === "retail";
  const mapQuery = [form.name, form.address, form.area, form.city, form.state, form.postalCode].filter(Boolean).join(", ");
  const mapLocation = form.latitude && form.longitude
    ? `${form.latitude},${form.longitude}`
    : mapQuery || "shops near me";
  const mapsUrl = form.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation)}`;
  const requiredFuelTypes = form.subcategory === "Petrol pump"
    ? ["PETROL", "DIESEL"]
    : form.subcategory === "CNG"
      ? ["CNG"]
      : [];

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setNotice("");
  };

  const updateHours = (day, field, value) => {
    setForm((current) => ({
      ...current,
      hours: { ...current.hours, [day]: { ...current.hours[day], [field]: value } },
    }));
  };

  const toggleWorkingDay = (day) => {
    setForm((current) => ({
      ...current,
      workingDays: current.workingDays.includes(day)
        ? current.workingDays.filter((item) => item !== day)
        : [...current.workingDays, day],
    }));
  };

  const updateProduct = (index, field, value) => {
    setForm((current) => ({
      ...current,
      products: current.products.map((product, itemIndex) =>
        itemIndex === index ? { ...product, [field]: value } : product
      ),
    }));
  };

  const updateFuelRate = (fuelType, price) => {
    setForm((current) => ({
      ...current,
      fuelRates: current.fuelRates.map((rate) =>
        rate.fuelType === fuelType ? { ...rate, price } : rate
      ),
    }));
  };

  const updateCharger = (index, field, value) => {
    setForm((current) => ({
      ...current,
      evChargers: current.evChargers.map((charger, itemIndex) =>
        itemIndex === index ? { ...charger, [field]: value } : charger
      ),
    }));
  };

  const useCurrentLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Location access is unavailable in this browser. You can enter the coordinates manually.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setForm((current) => ({
        ...current,
        latitude: coords.latitude.toFixed(6),
        longitude: coords.longitude.toFixed(6),
      })),
      () => setError("Location permission was not granted. Enter your address and coordinates manually if available."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const validate = () => {
    if (!form.name.trim() || !form.category || !form.subcategory) {
      return "Enter the business name and select a sector and subcategory.";
    }
    if (form.description.trim().length < 20) {
      return "Add a business description of at least 20 characters to publish your listing.";
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) {
      return "Enter a valid 10-digit Indian business phone number.";
    }
    if (!form.city.trim() || !form.state.trim()) return "City and state are required.";
    if (form.postalCode && !/^\d{6}$/.test(form.postalCode.trim())) return "Enter a valid 6-digit PIN code.";
    if ((form.latitude === "") !== (form.longitude === "")) return "Enter both latitude and longitude, or leave both blank.";
    if (form.latitude !== "" && (!Number.isFinite(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)) return "Latitude must be between -90 and 90.";
    if (form.longitude !== "" && (!Number.isFinite(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)) return "Longitude must be between -180 and 180.";
    if (isStation && (!form.latitude || !form.longitude)) return "Add the station's map coordinates using current location or enter them manually.";
    if (isService) {
      if (!form.atShop && !form.homeVisit) return "Select at least one service mode: At Shop or Home Visit.";
      if (!form.serviceName.trim()) return "Enter the first service you offer.";
      if (Number(form.servicePrice) < 0 || !Number.isFinite(Number(form.servicePrice))) return "Enter a valid service price.";
      if (Number(form.serviceDurationMinutes) < 1) return "Enter a service duration of at least one minute.";
      if (!form.workingDays.length) return "Choose at least one appointment working day.";
    }
    if (isDispatch && Number(form.serviceRadiusKm) <= 0) return "Enter a service radius greater than zero.";
    if (requiredFuelTypes.some((fuelType) => {
      const rate = form.fuelRates.find((item) => item.fuelType === fuelType);
      return !rate || !Number.isFinite(Number(rate.price)) || Number(rate.price) <= 0;
    })) return "Enter the current positive rate for each fuel type offered.";
    if (form.subcategory === "EV charging" && form.evChargers.some((charger) => !charger.connectorType.trim() || Number(charger.powerKw) <= 0)) {
      return "Enter a connector type and positive power rating for every EV charger.";
    }
    if (isRetail && form.products.some((product) => product.name.trim() && (!Number.isFinite(Number(product.price)) || Number(product.price) < 0))) {
      return "Enter a valid price for each listed product.";
    }
    if (isRetail && form.products.some((product) => product.name.trim() && product.stock !== "" && (!Number.isInteger(Number(product.stock)) || Number(product.stock) < 0))) {
      return "Product stock must be a non-negative whole number.";
    }
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const productRows = isRetail
        ? form.products.filter((product) => product.name.trim())
        : [];
      const createdResult = await createBusiness({
        name: form.name.trim(),
        category: form.category,
        subcategory: form.subcategory,
        description: form.description.trim(),
        phone: form.phone.replace(/\D/g, ""),
        whatsapp: form.whatsapp.replace(/\D/g, ""),
        email: form.email.trim(),
        address: form.address.trim(),
        area: form.area.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        logo: form.logo,
        gallery: form.gallery,
        googleMapsUrl: form.googleMapsUrl.trim(),
        location: {
          latitude: form.latitude === "" ? null : Number(form.latitude),
          longitude: form.longitude === "" ? null : Number(form.longitude),
        },
        hours: form.hours,
        appointmentSettings: isService
          ? {
              enabled: true,
              workingDays: form.workingDays,
              openingTime: form.openingTime,
              closingTime: form.closingTime,
              slotDurationMinutes: Number(form.slotDurationMinutes),
              shopAppointmentEnabled: form.atShop,
              homeServiceEnabled: form.homeVisit,
              homeServiceCharge: Number(form.homeServiceCharge || 0),
            }
          : {},
        marketplaceDetails: {
          fuelRates: requiredFuelTypes.map((fuelType) => ({
            ...form.fuelRates.find((rate) => rate.fuelType === fuelType),
            price: Number(form.fuelRates.find((rate) => rate.fuelType === fuelType).price),
          })),
          evChargers: form.subcategory === "EV charging"
            ? form.evChargers.map((charger) => ({
                ...charger,
                powerKw: Number(charger.powerKw),
                quantity: Number(charger.quantity || 1),
              }))
            : [],
          serviceModes: { atShop: form.atShop, homeVisit: form.homeVisit },
          serviceRadiusKm: isDispatch ? Number(form.serviceRadiusKm) : 0,
          vehicleType: isDispatch ? form.vehicleType.trim() : "",
          instantPickupRequest: isDispatch,
        },
        published: true,
      });
      const business = createdResult.business;
      setExistingBusiness(business);
      setCreated(true);

      try {
        if (isService) {
          await createService(business._id, {
            name: form.serviceName.trim(),
            description: form.serviceDescription.trim(),
            category: form.subcategory,
            price: Number(form.servicePrice),
            durationMinutes: Number(form.serviceDurationMinutes),
            homeServiceAvailable: form.homeVisit,
            shopAvailable: form.atShop,
            homeServiceCharge: Number(form.homeServiceCharge || 0),
            images: form.serviceImages,
          });
        }
        for (const product of productRows) {
          await createProduct(business._id, {
            name: product.name.trim(),
            category: product.category.trim() || form.subcategory,
            price: Number(product.price || 0),
            stock: Number(product.stock || 0),
            images: product.images,
          });
        }
      } catch (catalogueError) {
        setNotice("Your shop is live, but one or more catalogue items could not be saved. Add or review them from your dashboard.");
        setError(catalogueError.message || "A catalogue item could not be saved.");
        return;
      }

      setNotice("Your shop has been registered and published.");
      navigate("/dashboard/my-business", { replace: true, state: { notice: "Your shop is live on BizLaunch India." } });
    } catch (reason) {
      setError(reason.message || "Unable to register your shop.");
    } finally {
      setSaving(false);
    }
  };

  if (checkingBusiness) return <main className="px-5 py-16 text-center text-muted">Checking your vendor profile…</main>;
  if (existingBusiness && !created) {
    return (
      <main className="mx-auto max-w-xl px-5 py-20 text-center">
        <Store className="mx-auto text-primary" size={40} />
        <h1 className="mt-4 text-2xl font-bold">You already have a shop</h1>
        <p className="mt-2 text-text-secondary">Manage {existingBusiness.name} from your vendor dashboard.</p>
        <Link to="/dashboard/my-business" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white">Open my business</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to home</Link>
        <header className="mt-5">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">India Local Services</p>
          <h1 className="mt-1 text-3xl font-bold text-text-primary sm:text-4xl">Register your shop</h1>
          <p className="mt-2 max-w-2xl text-text-secondary">Choose what you provide. We’ll tailor the setup to your business and publish a customer-ready local listing.</p>
        </header>

        {error && <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</p>}
        {notice && <p role="status" className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{notice}</p>}
        {created && <Link to="/dashboard/my-business" className="mt-3 inline-block text-sm font-semibold text-primary underline">Continue to your dashboard</Link>}

        {!created && (
          <form onSubmit={submit} className="mt-7 space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold">Business type</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">Sector *
                  <select className={fieldClass} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value, subcategory: "" }))} required>
                    <option value="">Choose a sector</option>
                    {CATEGORIES.map((category) => <option key={category.slug} value={category.name}>{category.name}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold">Category / service *
                  <select className={fieldClass} name="subcategory" value={form.subcategory} onChange={update} required disabled={!sector}>
                    <option value="">Choose a category</option>
                    {sector?.subcategories.map((item) => <option key={item.slug} value={item.name}>{item.name}</option>)}
                  </select>
                </label>
              </div>
              {subcategory && <p className="mt-3 rounded-xl bg-primary-sky p-3 text-sm text-primary">Setup type: <strong>{subcategory.serviceType === "station" ? "Station and vendor-updated rates" : subcategory.serviceType === "service" ? "Service appointments" : subcategory.serviceType === "dispatch" ? "On-demand pickup / dispatch" : "Retail catalogue"}</strong></p>}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold">Business profile</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Business name" value={form.name} onChange={update} required maxLength={120} placeholder="e.g. Sharma Auto Care" />
                <Field name="phone" label="Business phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))} required inputMode="numeric" placeholder="10-digit mobile number" />
                <Field name="whatsapp" label="WhatsApp (optional)" value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value.replace(/\D/g, "").slice(0, 10) }))} inputMode="numeric" placeholder="10-digit WhatsApp number" />
                <Field name="email" label="Business email (optional)" type="email" value={form.email} onChange={update} placeholder="shop@example.in" />
                <Field name="address" label="Street address" value={form.address} onChange={update} placeholder="Shop number, street" />
                <Field name="area" label="Area / neighbourhood" value={form.area} onChange={update} placeholder="Locality" />
                <Field name="city" label="City" value={form.city} onChange={update} required placeholder="City" />
                <Field name="state" label="State" value={form.state} onChange={update} required placeholder="State" />
                <Field name="postalCode" label="PIN code" value={form.postalCode} onChange={(event) => setForm((current) => ({ ...current, postalCode: event.target.value.replace(/\D/g, "").slice(0, 6) }))} inputMode="numeric" placeholder="6-digit PIN" />
                <Field name="googleMapsUrl" label="Google Maps link (optional)" type="url" value={form.googleMapsUrl} onChange={update} placeholder="https://maps.app.goo.gl/..." />
              </div>
              <label className="mt-4 block text-sm font-semibold">Description *
                <textarea className={fieldClass} name="description" value={form.description} onChange={update} minLength={20} maxLength={3000} rows={4} required placeholder="Describe your business, products or services. Add at least 20 characters." />
              </label>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" onClick={useCurrentLocation} className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary"><MapPin size={16} /> Use current location</button>
                <LocationPicker
                  latitude={form.latitude}
                  longitude={form.longitude}
                  onSelect={(location) => {
                    setForm((current) => ({ ...current, ...location }));
                    setError("");
                    setNotice("");
                  }}
                />
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary"><ExternalLink size={16} /> Open Google Maps</a>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field name="latitude" label="Latitude (optional)" type="number" value={form.latitude} onChange={update} min="-90" max="90" step="any" placeholder="22.7196" />
                <Field name="longitude" label="Longitude (optional)" type="number" value={form.longitude} onChange={update} min="-180" max="180" step="any" placeholder="75.8577" />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <PhotoField
                label="Shop photos"
                value={form.gallery}
                onChange={(gallery) => setForm((current) => ({
                  ...current,
                  gallery,
                  logo: gallery.includes(current.logo) ? current.logo : "",
                }))}
                profilePhoto={form.logo}
                onSelectProfilePhoto={(logo) => setForm((current) => ({ ...current, logo }))}
              />
            </section>

            {isStation && (
              <section className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <div><h2 className="text-lg font-bold">Station details</h2><p className="mt-1 text-sm text-muted">Rates shown here are vendor-entered. Customers can see when each rate was last updated.</p></div>
                {requiredFuelTypes.length > 0 && <div className="grid gap-4 sm:grid-cols-2">{requiredFuelTypes.map((fuelType) => {
                  const rate = form.fuelRates.find((item) => item.fuelType === fuelType);
                  return <label key={fuelType} className="text-sm font-semibold">{fuelType} price ({rate.unit === "KG" ? "₹ / kg" : "₹ / litre"})<input className={fieldClass} type="number" min="0.01" step="0.01" value={rate.price} onChange={(event) => updateFuelRate(fuelType, event.target.value)} required /></label>;
                })}</div>}
                {form.subcategory === "EV charging" && <div className="space-y-3"><h3 className="font-semibold">EV chargers</h3>{form.evChargers.map((charger, index) => <div key={index} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[1fr_1fr_120px_auto]"><label className="text-xs font-semibold">Connector type<input className={fieldClass} value={charger.connectorType} onChange={(event) => updateCharger(index, "connectorType", event.target.value)} placeholder="CCS2, Type 2" required /></label><label className="text-xs font-semibold">Power (kW)<input className={fieldClass} type="number" min="0.1" step="0.1" value={charger.powerKw} onChange={(event) => updateCharger(index, "powerKw", event.target.value)} required /></label><label className="text-xs font-semibold">Units<input className={fieldClass} type="number" min="1" value={charger.quantity} onChange={(event) => updateCharger(index, "quantity", event.target.value)} /></label><label className="flex items-center gap-2 self-end pb-3 text-xs font-semibold"><input type="checkbox" checked={charger.available} onChange={(event) => updateCharger(index, "available", event.target.checked)} /> Available</label></div>)}<button type="button" onClick={() => setForm((current) => ({ ...current, evChargers: [...current.evChargers, { connectorType: "", powerKw: "", quantity: 1, available: true }] }))} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Plus size={16} /> Add charger</button></div>}
                <WeeklyHours hours={form.hours} onUpdate={updateHours} />
              </section>
            )}

            {isService && (
              <section className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <div><h2 className="text-lg font-bold">Service and appointment setup</h2><p className="mt-1 text-sm text-muted">Only the selected service's availability is shown to customers.</p></div>
                <div className="grid gap-3 sm:grid-cols-2"><label className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm font-semibold"><input type="checkbox" name="atShop" checked={form.atShop} onChange={update} /> At Shop</label><label className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm font-semibold"><input type="checkbox" name="homeVisit" checked={form.homeVisit} onChange={update} /> Home Visit</label></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="serviceName" label="First service offered" value={form.serviceName} onChange={update} required placeholder={form.subcategory || "Service name"} />
                  <Field name="servicePrice" label="Starting price (₹)" type="number" min="0" step="0.01" value={form.servicePrice} onChange={update} required />
                  <Field name="serviceDurationMinutes" label="Duration (minutes)" type="number" min="1" value={form.serviceDurationMinutes} onChange={update} required />
                  {form.homeVisit && <Field name="homeServiceCharge" label="Home visit charge (₹)" type="number" min="0" step="0.01" value={form.homeServiceCharge} onChange={update} />}
                </div>
                <label className="block text-sm font-semibold">Service details<textarea className={fieldClass} name="serviceDescription" value={form.serviceDescription} onChange={update} maxLength={3000} rows={3} placeholder="What is included in this service?" /></label>
                <PhotoField
                  label="First service photos"
                  value={form.serviceImages}
                  onChange={(serviceImages) => setForm((current) => ({ ...current, serviceImages }))}
                />
                <fieldset><legend className="text-sm font-semibold">Appointment working days</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{DAYS.map(([day, label]) => <label key={day} className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-sm"><input type="checkbox" checked={form.workingDays.includes(day)} onChange={() => toggleWorkingDay(day)} />{label}</label>)}</div></fieldset>
                <div className="grid gap-4 sm:grid-cols-3"><Field name="openingTime" label="Appointment opens" type="time" value={form.openingTime} onChange={update} required /><Field name="closingTime" label="Appointment closes" type="time" value={form.closingTime} onChange={update} required /><label className="text-sm font-semibold">Slot duration<select className={fieldClass} name="slotDurationMinutes" value={form.slotDurationMinutes} onChange={(event) => setForm((current) => ({ ...current, slotDurationMinutes: Number(event.target.value) }))}><option value={15}>15 min</option><option value={30}>30 min</option><option value={45}>45 min</option><option value={60}>60 min</option></select></label></div>
                <WeeklyHours hours={form.hours} onUpdate={updateHours} />
              </section>
            )}

            {isDispatch && (
              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <h2 className="text-lg font-bold">On-demand / dispatch details</h2>
                <p className="mt-1 text-sm text-muted">Customers can request pickup using your phone or WhatsApp contact details.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field name="serviceRadiusKm" label="Service radius (km)" type="number" min="1" step="1" value={form.serviceRadiusKm} onChange={update} required placeholder="e.g. 15" /><Field name="vehicleType" label="Vehicle / pickup type" value={form.vehicleType} onChange={update} placeholder={form.subcategory || "Vehicle type"} /></div>
                <p className="mt-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">Instant pickup request will use your listed phone/WhatsApp number. No third-party API is needed.</p>
              </section>
            )}

            {isRetail && (
              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Starter inventory</h2><p className="mt-1 text-sm text-muted">Add optional products to your shop catalogue. You can add more later.</p></div><button type="button" onClick={() => setForm((current) => ({ ...current, products: [...current.products, freshProduct()] }))} className="inline-flex items-center gap-2 rounded-xl border border-primary px-3 py-2 text-sm font-semibold text-primary"><Plus size={16} /> Add product</button></div>
                <div className="mt-4 space-y-3">{form.products.map((product, index) => <div key={index} className="space-y-3 rounded-xl border border-border p-4"><div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_1fr_120px_auto]"><label className="text-xs font-semibold">Product name<input className={fieldClass} value={product.name} onChange={(event) => updateProduct(index, "name", event.target.value)} placeholder="Item name" /></label><label className="text-xs font-semibold">Category<input className={fieldClass} value={product.category} onChange={(event) => updateProduct(index, "category", event.target.value)} placeholder={form.subcategory} /></label><label className="text-xs font-semibold">Price (₹)<input className={fieldClass} type="number" min="0" step="0.01" value={product.price} onChange={(event) => updateProduct(index, "price", event.target.value)} /></label><label className="text-xs font-semibold">Stock<input className={fieldClass} type="number" min="0" value={product.stock} onChange={(event) => updateProduct(index, "stock", event.target.value)} /></label><button type="button" disabled={form.products.length === 1} onClick={() => setForm((current) => ({ ...current, products: current.products.filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Remove product" className="self-end rounded-lg border border-red-200 p-2 text-red-600 disabled:opacity-40"><Trash2 size={16} /></button></div><PhotoField label={`Photos for product ${index + 1}`} value={product.images} onChange={(images) => updateProduct(index, "images", images)} /></div>)}</div>
              </section>
            )}

            <button disabled={saving} className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{saving ? "Registering your shop…" : "Register and publish shop"}</button>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({ name, label, value, onChange, type = "text", required = false, placeholder = "", ...props }) {
  return <label className="block text-sm font-semibold">{label}{required && <span className="text-red-600"> *</span>}<input className={fieldClass} name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} {...props} /></label>;
}

function WeeklyHours({ hours, onUpdate }) {
  return (
    <div>
      <div><h3 className="font-semibold">Business operating hours</h3><p className="mt-1 text-xs text-muted">Opening hours are shown on your public business page.</p></div>
      <div className="mt-3 space-y-2">
        {DAYS.map(([day, label]) => (
          <div key={day} className="grid items-center gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1fr_1fr_1fr]">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!hours[day].closed} onChange={(event) => onUpdate(day, "closed", !event.target.checked)} />{label}</label>
            {hours[day].closed ? <span className="text-sm text-muted sm:col-span-2">Closed</span> : <>
              <label className="text-xs font-semibold text-muted">Opens<input className={fieldClass} type="time" value={hours[day].open} onChange={(event) => onUpdate(day, "open", event.target.value)} /></label>
              <label className="text-xs font-semibold text-muted">Closes<input className={fieldClass} type="time" value={hours[day].close} onChange={(event) => onUpdate(day, "close", event.target.value)} /></label>
            </>}
          </div>
        ))}
      </div>
    </div>
  );
}
