import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, Store } from "lucide-react";
import { api } from "../api";

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/businesses/public")
      .then((result) => setBusinesses(result.businesses || []))
      .catch(() => setBusinesses([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = businesses.filter((business) =>
    `${business.name} ${business.category} ${business.city}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Explore local businesses</p>
          <h1 className="mt-3 text-4xl font-bold text-text-primary">Find trusted shops near you</h1>
          <p className="mt-3 text-text-secondary">Browse products, services, prices and contact details from Indian businesses.</p>
        </div>
        <div className="relative mt-8 max-w-xl"><Search className="absolute left-4 top-3.5 text-muted" size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by shop, category or city" className="w-full rounded-2xl border-border py-3 pl-11 shadow-sm" /></div>
        {loading ? <p className="py-16 text-center text-muted">Loading businesses...</p> : visible.length === 0 ? <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-12 text-center"><Store className="mx-auto text-muted" /><h2 className="mt-3 font-bold">No businesses found yet</h2><p className="mt-1 text-sm text-muted">Be the first shopkeeper to create a digital storefront.</p><Link to="/register" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white">Create your page</Link></div> : <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((business) => <Link key={business._id} to={`/business/${business.slug}`} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-primary-sky to-blue-100 text-primary"><Store size={42} /></div><h2 className="mt-4 text-xl font-bold group-hover:text-primary">{business.name}</h2><p className="mt-1 text-sm text-primary">{business.category}</p><p className="mt-3 flex items-center gap-1 text-sm text-muted"><MapPin size={15} />{business.city || business.state || "India"}</p></Link>)}</div>}
      </div>
    </main>
  );
}
