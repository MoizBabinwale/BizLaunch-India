import { useCallback, useEffect, useState } from "react";
import { CalendarDays, IndianRupee, Package, Plus, RefreshCw, Users } from "lucide-react";
import { createAppointment, createInventory, createSale, getMyBusiness, listAppointments, listCustomers, listInventory, listSales } from "../api/operationsApi";
import { Link } from "react-router-dom";

const emptyData = { business: null, inventory: [], sales: [], customers: [], appointments: [] };

export default function BusinessHubReal() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { business } = await getMyBusiness();
      const [inventory, sales, customers, appointments] = await Promise.all([listInventory(business._id), listSales(business._id), listCustomers(business._id), listAppointments(business._id)]);
      setData({ business, inventory: inventory.items || [], sales: sales.sales || [], customers: customers.customers || [], appointments: appointments.appointments || [] });
    } catch (reason) { setData(emptyData); setError(reason.message || "Unable to load your business data."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, [load]);

  const save = async (event) => {
    event.preventDefault(); if (!data.business) return;
    setSaving(true); setError("");
    try {
      if (form.type === "inventory") await createInventory(data.business._id, { name: form.name, category: form.category, price: Number(form.price), cost: Number(form.cost || 0), stock: Number(form.stock) });
      if (form.type === "sale") await createSale(data.business._id, { item: form.item, amount: Number(form.amount), cost: Number(form.cost || 0), quantity: 1 });
      if (form.type === "appointment") await createAppointment(data.business._id, { customerName: form.customer, service: form.service, time: form.time });
      setForm(null); await load();
    } catch (reason) { setError(reason.message || "Unable to save this record."); }
    finally { setSaving(false); }
  };

  const revenue = data.sales.reduce((total, sale) => total + Number(sale.amount || 0), 0);
  const profit = data.sales.reduce((total, sale) => total + Number(sale.amount || 0) - Number(sale.cost || 0), 0);
  const Card = ({ icon: Icon, label, value, detail }) => <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-muted">{label}</p><p className="mt-2 text-2xl font-bold text-text-primary">{value}</p><p className="mt-2 text-xs text-muted">{detail}</p></div><Icon className="rounded-xl bg-primary-sky p-2 text-primary" size={38} /></div></div>;

  if (loading) return <p className="p-8 text-muted">Loading live business data...</p>;
  if (!data.business) return <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border bg-card p-10 text-center"><h1 className="text-2xl font-bold text-text-primary">Create your business first</h1><p className="mt-3 text-text-secondary">Operations use your real business profile and saved records. No sample data is shown.</p><Link to="/dashboard/my-business" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white">Create your shop page</Link>{error && <p className="mt-5 text-sm text-red-600">{error}</p>}</div>;
  const field = (key, label, type = "text", required = true) => <label className="block text-sm font-semibold">{label}<input type={type} required={required} value={form[key] || ""} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} className="mt-1 w-full rounded-xl border-border" /></label>;
  return <div className="mx-auto max-w-6xl space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">Live business data</p><h1 className="mt-1 text-3xl font-bold text-text-primary">Shop operations</h1><p className="mt-2 text-text-secondary">Only records saved to your {data.business.name} account are shown here.</p></div><div className="flex gap-2"><button onClick={() => setForm({ type: "sale", item: "", amount: "", cost: "" })} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">Record sale</button><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold"><RefreshCw size={16} /> Refresh</button></div></div>{error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card icon={IndianRupee} label="Revenue recorded" value={`₹${revenue.toLocaleString("en-IN")}`} detail="From saved sales" /><Card icon={IndianRupee} label="Profit recorded" value={`₹${profit.toLocaleString("en-IN")}`} detail="Revenue minus saved costs" /><Card icon={Package} label="Inventory items" value={data.inventory.length} detail="Saved stock records" /><Card icon={Users} label="Customers" value={data.customers.length} detail="Saved customer records" /></div><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Inventory</h2><p className="text-sm text-muted">Your saved stock only.</p></div><button onClick={() => setForm({ type: "inventory", name: "", category: "General", price: "", cost: "", stock: "" })} className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary"><Plus size={16} /> Add stock</button></div>{data.inventory.length ? <div className="mt-4 space-y-3">{data.inventory.slice(0, 6).map((item) => <div key={item._id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><div><p className="font-semibold">{item.name}</p><p className="text-xs text-muted">{item.stock} in stock · {item.category || "General"}</p></div><p className="font-bold text-primary">₹{Number(item.price || 0).toLocaleString("en-IN")}</p></div>)}</div> : <p className="mt-5 text-sm text-muted">No inventory has been added.</p>}</section><section className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Appointments</h2><p className="text-sm text-muted">Upcoming customer bookings.</p></div><button onClick={() => setForm({ type: "appointment", customer: "", service: "", time: "" })} className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary"><CalendarDays size={16} /> Add booking</button></div>{data.appointments.length ? <div className="mt-4 space-y-3">{data.appointments.slice(0, 6).map((item) => <div key={item._id} className="rounded-xl bg-slate-50 p-3"><p className="font-semibold">{item.customerName || item.customer?.name}</p><p className="text-xs text-muted">{item.service} · {new Date(item.time).toLocaleString("en-IN")}</p></div>)}</div> : <p className="mt-5 text-sm text-muted">No appointments have been added.</p>}</section></div>{form && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={save} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold">{form.type === "inventory" ? "Add stock" : form.type === "sale" ? "Record a sale" : "Add appointment"}</h2><div className="mt-5 space-y-4">{form.type === "inventory" && <>{field("name", "Item name")}{field("category", "Category")}{field("price", "Selling price", "number")}{field("cost", "Cost price", "number", false)}{field("stock", "Stock quantity", "number")}</>}{form.type === "sale" && <>{field("item", "Item or service")}{field("amount", "Amount received", "number")}{field("cost", "Cost price", "number", false)}</>}{form.type === "appointment" && <>{field("customer", "Customer name")}{field("service", "Service")}{field("time", "Date and time", "datetime-local")}</>}</div><div className="mt-6 flex gap-3"><button type="button" onClick={() => setForm(null)} className="flex-1 rounded-xl border border-border py-3 font-semibold">Cancel</button><button disabled={saving} className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Save"}</button></div></form></div>}</div>;
}
