import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { api } from "../api";

export default function PublicBusiness() {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/businesses/slug/${slug}`)
      .then((result) => setBusiness(result.business))
      .catch((reason) => setError(reason.message));
  }, [slug]);

  if (error) return <main className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="text-2xl font-bold">Business page unavailable</h1><p className="mt-2 text-muted">{error}</p><Link to="/explore" className="mt-5 inline-block text-primary">Back to explore</Link></main>;
  if (!business) return <main className="px-6 py-24 text-center text-muted">Loading business page...</main>;

  const whatsapp = (business.whatsapp || business.phone || "").replace(/\D/g, "");
  return <main className="min-h-screen bg-background pb-16"><section className="bg-gradient-to-br from-primary to-blue-900 px-6 py-12 text-white"><div className="mx-auto max-w-5xl"><Link to="/explore" className="inline-flex items-center gap-2 text-sm text-blue-100"><ArrowLeft size={16} /> Explore businesses</Link><div className="mt-12"><p className="font-semibold uppercase tracking-widest text-blue-100">{business.category}</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">{business.name}</h1><p className="mt-3 max-w-2xl text-lg text-blue-100">{business.tagline || business.description || "Quality products and services for your neighbourhood."}</p><div className="mt-6 flex flex-wrap gap-3 text-sm text-blue-100"><span className="inline-flex items-center gap-1"><MapPin size={16} /> {business.city || "India"}</span>{business.phone && <span className="inline-flex items-center gap-1"><Phone size={16} /> {business.phone}</span>}</div><div className="mt-8 flex flex-wrap gap-3">{whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white"><MessageCircle size={18} /> WhatsApp shop</a>}{business.phone && <a href={`tel:${business.phone}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary"><Phone size={18} /> Call now</a>}</div></div></div></section><div className="mx-auto max-w-5xl px-6 py-10"><div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">Catalogue</p><h2 className="mt-1 text-2xl font-bold">Products and services</h2></div><ShoppingBag className="text-primary" /></div>{business.products?.length || business.services?.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[...(business.products || []), ...(business.services || [])].map((item) => <div key={item._id} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><h3 className="font-bold">{item.name}</h3><p className="mt-2 text-sm text-muted">{item.description || "Available at this business."}</p><p className="mt-4 text-xl font-bold text-primary">₹{Number(item.price || 0).toLocaleString("en-IN")}</p>{item.stock !== undefined && <p className={`mt-2 text-xs font-semibold ${item.stock < 10 ? "text-orange-600" : "text-green-700"}`}>{item.stock} in stock</p>}</div>)}</div> : <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted">This shop is updating its catalogue. Contact them directly for today&apos;s availability.</div>}</div></main>;
}
