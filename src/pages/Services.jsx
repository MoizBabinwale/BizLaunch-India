import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, Pencil, Plus, Scissors, Trash2, X } from "lucide-react";
import { createService, deleteService, listServices, updateService } from "../api/catalogueApi";
import { getMyBusiness } from "../api/businessApi";
import PhotoField from "../components/common/PhotoField";

const blankService = { name: "", category: "", price: "", durationMinutes: "", description: "", images: [], homeServiceAvailable: false, shopAvailable: true, homeServiceCharge: "", isActive: true };
const fieldClass = "mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";

export default function Services() {
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { business: shop } = await getMyBusiness();
      setBusiness(shop);
      const result = await listServices(shop._id);
      setServices(result.services || []);
    } catch (reason) {
      setError(reason.message || "Unable to load your services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openForm = (service = null) => {
    setError("");
    setNotice("");
    const selected = service
      ? { ...blankService, ...service, price: String(service.price ?? ""), durationMinutes: String(service.durationMinutes ?? "") }
      : { ...blankService };
    setForm(selected);
  };

  const change = ({ target: { name, value, type, checked } }) => {
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async (event) => {
    event.preventDefault();
    if (!business || !form) return;
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      ...form,
      price: Number(form.price || 0),
      durationMinutes: Number(form.durationMinutes || 0),
      homeServiceAvailable: Boolean(form.homeServiceAvailable),
      shopAvailable: Boolean(form.shopAvailable),
      homeServiceCharge: Number(form.homeServiceCharge || 0),
      images: form.images || [],
    };
    try {
      if (form._id) await updateService(business._id, form._id, payload);
      else await createService(business._id, payload);
      setForm(null);
      setNotice(form._id ? "Service updated." : "Service added to your shop.");
      await load();
    } catch (reason) {
      setError(reason.message || "Unable to save this service.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (service) => {
    if (!business || !window.confirm(`Delete "${service.name}" from your services?`)) return;
    setError("");
    setNotice("");
    try {
      await deleteService(business._id, service._id);
      setServices((current) => current.filter((item) => item._id !== service._id));
      setNotice("Service deleted.");
    } catch (reason) {
      setError(reason.message || "Unable to delete this service.");
    }
  };

  if (loading) return <p className="p-8 text-muted">Loading your services...</p>;
  if (!business) {
    return <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Scissors className="mx-auto text-primary" size={36} /><h1 className="mt-4 text-2xl font-bold">Create your shop first</h1><p className="mt-2 text-text-secondary">Add your business profile before listing its services.</p><Link to="/dashboard/my-business" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white">Set up my shop</Link>{error && <p className="mt-4 text-sm text-red-700">{error}</p>}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">Shop catalogue</p><h1 className="mt-1 text-3xl font-bold text-text-primary">Services</h1><p className="mt-2 text-text-secondary">Describe your services, pricing, duration and photos for {business.name}.</p></div><button onClick={() => openForm()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white"><Plus size={18} /> Add service</button></header>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}
      {services.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{services.map((service) => <article key={service._id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">{service.images?.[0] ? <img src={service.images[0]} alt={service.name} className="h-48 w-full object-cover" /> : <div className="flex h-48 items-center justify-center bg-primary-sky text-primary"><ImagePlus size={34} /></div>}<div className="space-y-3 p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-text-primary">{service.name}</h2><p className="text-sm text-muted">{service.category || "Service"}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${service.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>{service.isActive ? "Active" : "Hidden"}</span></div><p className="line-clamp-3 min-h-[3.75rem] text-sm text-text-secondary">{service.description || "No service description yet."}</p><div className="flex items-baseline gap-2"><strong className="text-lg text-primary">{Number(service.price) ? `₹${Number(service.price).toLocaleString("en-IN")}` : "Price on request"}</strong><span className="ml-auto text-xs text-muted">{service.durationMinutes ? `${service.durationMinutes} min` : "Duration varies"}</span></div><div className="flex gap-2 border-t border-border pt-3"><button onClick={() => openForm(service)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Pencil size={15} /> Edit</button><button onClick={() => remove(service)} aria-label={`Delete ${service.name}`} className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></div></article>)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center"><Scissors className="mx-auto text-muted" size={36} /><h2 className="mt-4 text-xl font-bold">No services listed yet</h2><p className="mt-2 text-sm text-text-secondary">Add a service to let customers know what your shop can do for them.</p><button onClick={() => openForm()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white"><Plus size={17} /> Add your first service</button></div>}
      {form && <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" role="presentation"><form onSubmit={save} className="my-auto w-full max-w-2xl space-y-5 rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">{form._id ? "Edit listing" : "New listing"}</p><h2 className="text-2xl font-bold">{form._id ? "Update service" : "Add a service"}</h2></div><button type="button" onClick={() => setForm(null)} aria-label="Close form" className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Service name *<input className={fieldClass} name="name" value={form.name} onChange={change} required maxLength={120} /></label><label className="text-sm font-semibold">Category<input className={fieldClass} name="category" value={form.category} onChange={change} maxLength={80} placeholder="e.g. Hair, repairs, lessons" /></label><label className="text-sm font-semibold">Price (₹)<input className={fieldClass} name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} /></label><label className="text-sm font-semibold">Duration (minutes)<input className={fieldClass} name="durationMinutes" type="number" min="0" step="5" value={form.durationMinutes} onChange={change} placeholder="0 if flexible" /></label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="shopAvailable" checked={Boolean(form.shopAvailable)} onChange={change} className="rounded border-border text-primary focus:ring-primary" /> Available at the shop</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="homeServiceAvailable" checked={Boolean(form.homeServiceAvailable)} onChange={change} className="rounded border-border text-primary focus:ring-primary" /> Available as a home service</label>{form.homeServiceAvailable && <label className="text-sm font-semibold">Home service charge (₹)<input className={fieldClass} name="homeServiceCharge" type="number" min="0" step="0.01" value={form.homeServiceCharge} onChange={change} /></label>}<label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="isActive" checked={Boolean(form.isActive)} onChange={change} className="rounded border-border text-primary focus:ring-primary" /> Show this service</label></div><label className="block text-sm font-semibold">Service details<textarea className={fieldClass} name="description" rows={4} value={form.description} onChange={change} maxLength={3000} placeholder="Describe what's included, how to book, and any requirements." /></label><PhotoField label="Service photos" value={form.images || []} onChange={(images) => setForm((current) => ({ ...current, images }))} /><div className="flex justify-end gap-3"><button type="button" onClick={() => setForm(null)} className="rounded-xl border border-border px-4 py-2.5 font-semibold">Cancel</button><button disabled={saving} className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : form._id ? "Save changes" : "Add service"}</button></div></form></div>}
    </div>
  );
}
