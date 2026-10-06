import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Globe2, LoaderCircle, Save } from "lucide-react";
import { createBusiness, getMyBusiness, updateBusiness } from "../api/businessApi";

const categories = ["Restaurants", "Hotels", "Beauty Spa", "Home Decor", "Wedding Planning", "Education", "Rent & Hire", "Hospitals", "Contractors", "Pet Shops", "PG/Hostels", "Estate Agent", "Dentists", "Gym", "Loans", "Kirana / General Store", "Salon / Barber", "Hardware", "Automobile", "Fashion", "Medical", "Electronics", "Flowers / Gifts", "Other"];
const emptyForm = { name: "", category: categories[0], tagline: "", description: "", phone: "", whatsapp: "", address: "", city: "", state: "", published: false };
const phonePattern = /^[6-9]\d{9}$/;

export default function MyBusinessPage() {
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyBusiness().then(({ business: data }) => {
      setBusiness(data);
      setForm({ ...emptyForm, ...data, published: Boolean(data.published) });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = ({ target: { name, value, type, checked } }) => {
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setError(""); setNotice("");
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
    if (form.published) {
      if (form.description.trim().length < 20) next.description = "Add at least 20 characters before publishing.";
      if (!phone && !whatsapp) next.phone = "Add a phone or WhatsApp number before publishing.";
      if (!form.city.trim()) next.city = "City is required before publishing.";
      if (!form.state.trim()) next.state = "State is required before publishing.";
    }
    setErrors(next); return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault(); if (!validate()) return;
    setSaving(true); setError("");
    try {
      const payload = { ...form, phone: form.phone.replace(/\D/g, ""), whatsapp: form.whatsapp.replace(/\D/g, "") };
      const result = business ? await updateBusiness(business._id, payload) : await createBusiness(payload);
      setBusiness(result.business); setForm({ ...emptyForm, ...result.business, published: Boolean(result.business.published) });
      setNotice(result.business.published ? "Your business page is live and ready to receive enquiries." : "Business profile saved as a draft.");
    } catch (reason) { setError(reason.message || "We could not save your business profile."); } finally { setSaving(false); }
  };

  if (loading) return <p className="p-8 text-muted">Loading your business profile...</p>;
  const fieldClass = (name) => `mt-1 w-full rounded-xl border ${errors[name] ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-border focus:border-primary focus:ring-primary/10"}`;
  const Field = ({ name, label, required, placeholder, type = "text" }) => <label className="text-sm font-semibold text-text-primary">{label}{required && <span className="text-red-600"> *</span>}<input name={name} type={type} value={form[name] || ""} onChange={update} placeholder={placeholder} className={fieldClass(name)} aria-invalid={Boolean(errors[name])} />{errors[name] && <span className="mt-1 block text-xs font-medium text-red-600">{errors[name]}</span>}</label>;

  return <div className="mx-auto max-w-4xl space-y-6"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">My business</p><h1 className="mt-1 text-3xl font-bold">Create your shop page</h1><p className="mt-2 text-text-secondary">Complete the details below. Publishing makes your page searchable and lets customers send you enquiries.</p></div><form noValidate onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="grid gap-5 md:grid-cols-2"><Field name="name" label="Business name" required placeholder="e.g. Sharma Electronics" /><Field name="tagline" label="Short tagline" placeholder="e.g. Trusted electronics in Indore" /><Field name="phone" label="Business phone" placeholder="10-digit mobile number" type="tel" /><Field name="whatsapp" label="WhatsApp number" placeholder="10-digit mobile number" type="tel" /><Field name="address" label="Street address" placeholder="Shop no., street and locality" /><Field name="city" label="City" required={form.published} placeholder="e.g. Indore" /><Field name="state" label="State" required={form.published} placeholder="e.g. Madhya Pradesh" /><label className="text-sm font-semibold text-text-primary">Business type<select name="category" value={form.category} onChange={update} className={fieldClass("category")}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label></div><label className="mt-5 block text-sm font-semibold text-text-primary">About your shop<textarea name="description" rows="5" value={form.description || ""} onChange={update} maxLength="3000" placeholder="Describe your products, services, experience and what customers can expect." className={fieldClass("description")} aria-invalid={Boolean(errors.description)} />{errors.description ? <span className="mt-1 block text-xs font-medium text-red-600">{errors.description}</span> : <span className="mt-1 block text-xs text-muted">{form.description.length}/3,000 characters</span>}</label><label className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-slate-50 p-4 text-sm font-semibold text-text-primary"><input name="published" type="checkbox" checked={Boolean(form.published)} onChange={update} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary" /><span>Publish this page so customers can discover it and send enquiries.<span className="mt-1 block text-xs font-normal text-muted">Requires an about section, city, state and a phone or WhatsApp number.</span></span></label>{error && <p className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700"><AlertCircle size={18} /> {error}</p>}{notice && <p className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700"><CheckCircle2 size={18} /> {notice}</p>}<div className="mt-6 flex flex-wrap items-center gap-3"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">{saving ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}{saving ? "Saving..." : "Save profile"}</button>{business?.published && <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700"><CheckCircle2 size={17} /> Live on BizLaunch</span>}</div></form>{business?.slug && <a href={`/business/${business.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Globe2 size={17} /> View public page</a>}</div>;
}
