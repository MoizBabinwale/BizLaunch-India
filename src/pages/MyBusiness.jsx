import { useEffect, useState } from "react";
import { CheckCircle2, Globe2, Save } from "lucide-react";
import { createBusiness, getMyBusiness, updateBusiness } from "../api/businessApi";

const categories = ["Kirana / General Store", "Salon / Barber", "Hardware", "Automobile", "Restaurant / Cafe", "Fashion", "Medical", "Electronics", "Flowers / Gifts", "Other"];

export default function MyBusiness() {
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({ name: "", category: categories[0], tagline: "", description: "", phone: "", whatsapp: "", address: "", city: "", state: "", published: false });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBusiness()
      .then(({ business: data }) => {
        setBusiness(data);
        setForm((current) => ({ ...current, ...data }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const result = business ? await updateBusiness(business._id, form) : await createBusiness(form);
    setBusiness(result.business);
    setForm((current) => ({ ...current, ...result.business }));
    setMessage("Business profile saved successfully.");
  };

  if (loading) return <p className="p-8 text-muted">Loading your business profile...</p>;
  return <div className="mx-auto max-w-4xl space-y-6"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">My business</p><h1 className="mt-1 text-3xl font-bold">Create your shop page</h1><p className="mt-2 text-text-secondary">Choose your business type once and customise your public profile anytime.</p></div><form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="grid gap-5 md:grid-cols-2">{[["name", "Business name"], ["tagline", "Short tagline"], ["phone", "Phone number"], ["whatsapp", "WhatsApp number"], ["address", "Street address"], ["city", "City"], ["state", "State"]].map(([name, label]) => <label key={name} className="text-sm font-semibold">{label}<input name={name} value={form[name] || ""} onChange={update} required={name === "name"} className="mt-1 w-full rounded-xl border-border" /></label>)}<label className="text-sm font-semibold">Business type<select name="category" value={form.category} onChange={update} className="mt-1 w-full rounded-xl border-border">{categories.map((category) => <option key={category}>{category}</option>)}</select></label></div><label className="mt-5 block text-sm font-semibold">About your shop<textarea name="description" rows="4" value={form.description || ""} onChange={update} className="mt-1 w-full rounded-xl border-border" placeholder="What do you sell? What makes your shop useful to customers?" /></label><label className="mt-5 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={Boolean(form.published)} onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))} /> Publish this page so customers can discover it</label><div className="mt-6 flex flex-wrap items-center gap-3"><button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white"><Save size={17} /> Save profile</button>{business?.published && <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700"><CheckCircle2 size={17} /> Live on BizLaunch</span>}{message && <span className="text-sm text-green-700">{message}</span>}</div></form>{business?.slug && <a href={`/business/${business.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Globe2 size={17} /> View public page</a>}</div>;
}
