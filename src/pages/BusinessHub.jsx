import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  IndianRupee,
  MessageCircle,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  createAppointment,
  createInventory,
  createSale,
  getMyBusiness,
  listAppointments,
  listCustomers,
  listInventory,
  listSales,
} from "../api/operationsApi";

const categories = [
  "Kirana / General Store",
  "Salon / Barber",
  "Hardware",
  "Automobile",
  "Restaurant / Cafe",
  "Fashion",
  "Medical",
  "Electronics",
  "Flowers / Gifts",
  "Other",
];

const starterProducts = [
  { id: "p1", name: "Everyday essentials", category: "General", stock: 24, price: 180, cost: 120 },
  { id: "p2", name: "Premium service / item", category: "Services", stock: 8, price: 650, cost: 300 },
];

const starterSales = [
  { id: "s1", customer: "Walk-in customer", item: "Everyday essentials", amount: 720, cost: 480, date: "Today" },
  { id: "s2", customer: "Aarav Mehta", item: "Premium service / item", amount: 650, cost: 300, date: "Yesterday" },
];

const createInitialState = () => ({
  businessId: null,
  profile: { name: "My business", category: categories[0], city: "", phone: "" },
  products: starterProducts,
  sales: starterSales,
  customers: [{ id: "c1", name: "Aarav Mehta", phone: "+91 98765 43210", visits: 3 }],
  appointments: [
    { id: "a1", customer: "Neha Sharma", service: "Haircut", time: "Today, 5:30 PM", status: "Confirmed" },
  ],
});

const loadState = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || createInitialState();
  } catch {
    return createInitialState();
  }
};

function Stat({ label, value, detail, icon: Icon, tone = "blue" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
          <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${tone === "red" ? "text-red-600" : "text-green-600"}`}>
            {tone === "red" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {detail}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tone === "green" ? "bg-green-50 text-green-600" : tone === "orange" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-primary"}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full overflow-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-muted hover:bg-slate-100" aria-label="Close"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function BusinessHub() {
  const { user } = useAuth();
  const storageKey = `bizlaunch-operations-${user?.id || user?.email || "guest"}`;
  const [state, setState] = useState(() => loadState(storageKey));
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [syncing, setSyncing] = useState(false);

  const save = (next) => {
    setState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  useEffect(() => {
    let active = true;
    const loadRemoteData = async () => {
      if (!user) return;
      try {
        setSyncing(true);
        const businessResponse = await getMyBusiness();
        const business = businessResponse.business;
        const [inventory, sales, customers, appointments] = await Promise.all([
          listInventory(business._id),
          listSales(business._id),
          listCustomers(business._id),
          listAppointments(business._id),
        ]);
        if (!active) return;
        const remote = {
          businessId: business._id,
          profile: {
            name: business.name,
            category: business.category || categories[0],
            city: business.city || "",
            phone: business.whatsapp || business.phone || "",
          },
          products: (inventory.items || []).map((item) => ({
            id: item._id,
            name: item.name,
            category: item.category || "General",
            stock: item.stock || 0,
            price: item.price || 0,
            cost: item.cost || 0,
          })),
          sales: (sales.sales || []).map((sale) => ({
            id: sale._id,
            customer: sale.customer?.name || sale.customerName || "",
            item: sale.item,
            amount: sale.amount,
            cost: sale.cost,
            date: new Date(sale.date || sale.createdAt).toLocaleDateString("en-IN"),
          })),
          customers: (customers.customers || []).map((customer) => ({
            id: customer._id,
            name: customer.name,
            phone: customer.phone || "",
            visits: customer.visits || 0,
          })),
          appointments: (appointments.appointments || []).map((appointment) => ({
            id: appointment._id,
            customer: appointment.customerName || appointment.customer?.name || "",
            service: appointment.service || "",
            time: appointment.time
              ? new Date(appointment.time).toLocaleString("en-IN")
              : appointment.time || "",
            status: appointment.status || "Pending",
          })),
        };
        save(remote);
      } catch {
        // A shop profile is created separately; local mode remains usable until then.
      } finally {
        if (active) setSyncing(false);
      }
    };
    loadRemoteData();
    return () => {
      active = false;
    };
  }, [user]);

  const revenue = state.sales.reduce((sum, sale) => sum + Number(sale.amount), 0);
  const profit = state.sales.reduce((sum, sale) => sum + Number(sale.amount) - Number(sale.cost), 0);
  const filteredProducts = state.products.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  const filteredCustomers = state.customers.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = state.products.filter((item) => item.stock < 10).length;
  const publicLink = `${window.location.origin}/business/${state.profile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const openModal = (type) => {
    setForm(type === "product" ? { name: "", category: "General", price: "", cost: "", stock: "" } : type === "sale" ? { customer: "", item: state.products[0]?.name || "", amount: "", cost: "" } : { customer: "", service: "", time: "" });
    setModal(type);
  };

  const submit = async (event) => {
    event.preventDefault();
    const businessId = state.businessId;
    if (modal === "product") {
      const item = { ...form, price: Number(form.price), cost: Number(form.cost), stock: Number(form.stock) };
      if (businessId) {
        const result = await createInventory(businessId, item);
        save({ ...state, products: [{ ...item, id: result.item._id }, ...state.products] });
      } else {
        save({ ...state, products: [{ ...item, id: `p${Date.now()}` }, ...state.products] });
      }
    } else if (modal === "sale") {
      const sale = { ...form, amount: Number(form.amount), cost: Number(form.cost), quantity: 1 };
      if (businessId) {
        const result = await createSale(businessId, sale);
        save({ ...state, sales: [{ ...sale, id: result.sale._id, date: "Just now" }, ...state.sales] });
      } else {
        save({ ...state, sales: [{ ...sale, id: `s${Date.now()}`, date: "Just now" }, ...state.sales] });
      }
    } else {
      const appointment = { customerName: form.customer, service: form.service, time: form.time };
      if (businessId) {
        const result = await createAppointment(businessId, appointment);
        save({ ...state, appointments: [{ ...form, id: result.appointment._id, status: "Pending" }, ...state.appointments] });
      } else {
        save({ ...state, appointments: [{ ...form, id: `a${Date.now()}`, status: "Pending" }, ...state.appointments] });
      }
    }
    setModal(null);
  };

  const removeProduct = (id) => save({ ...state, products: state.products.filter((item) => item.id !== id) });
  const tabs = ["Overview", "Inventory", "Sales & profit", "Customers", "Appointments", "Business page"];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Business OS</p>
          <h1 className="mt-1 text-3xl font-bold text-text-primary">Run your shop in one place</h1>
          <p className="mt-2 text-text-secondary">Track money, stock, customers and appointments without spreadsheets.</p>
          {syncing && <p className="mt-2 text-xs font-semibold text-primary">Syncing your shop data...</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => openModal("sale")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"><Plus size={17} /> Record sale</button>
          <button onClick={() => openModal("product")} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-50"><Package size={17} /> Add stock</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-border pb-1">
        {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted hover:text-text-primary"}`}>{tab}</button>)}
      </div>

      {activeTab === "Overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Revenue this month" value={`₹${revenue.toLocaleString("en-IN")}`} detail="Updated from sales" icon={IndianRupee} />
            <Stat label="Net profit" value={`₹${profit.toLocaleString("en-IN")}`} detail={`${revenue ? Math.round((profit / revenue) * 100) : 0}% margin`} icon={TrendingUpIcon} tone="green" />
            <Stat label="Products in catalogue" value={state.products.length} detail={`${lowStock} low-stock alert${lowStock === 1 ? "" : "s"}`} icon={Package} tone={lowStock ? "orange" : "blue"} />
            <Stat label="Customer contacts" value={state.customers.length} detail="Build repeat business" icon={Users} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-text-primary">Recent sales</h2><p className="text-sm text-muted">Your latest recorded transactions</p></div><button onClick={() => setActiveTab("Sales & profit")} className="text-sm font-semibold text-primary">View all</button></div>
              <div className="mt-5 space-y-3">{state.sales.slice(0, 4).map((sale) => <div key={sale.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><div><p className="font-semibold text-text-primary">{sale.item}</p><p className="text-xs text-muted">{sale.customer || "Walk-in customer"} · {sale.date}</p></div><p className="font-bold text-green-700">+₹{Number(sale.amount).toLocaleString("en-IN")}</p></div>)}</div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-text-primary">Next appointments</h2><p className="text-sm text-muted">Keep customers coming back</p></div><CalendarDays className="text-primary" size={22} /></div><div className="mt-5 space-y-3">{state.appointments.slice(0, 3).map((item) => <div key={item.id} className="rounded-xl border border-border p-3"><div className="flex justify-between gap-2"><p className="font-semibold">{item.customer}</p><span className="text-xs font-semibold text-primary">{item.status}</span></div><p className="mt-1 text-sm text-muted">{item.service} · {item.time}</p></div>)}</div><button onClick={() => openModal("appointment")} className="mt-4 w-full rounded-xl border border-primary py-2 text-sm font-semibold text-primary">Book appointment</button></div>
          </div>
        </>
      )}

      {activeTab === "Inventory" && <section className="rounded-2xl border border-border bg-card p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-lg font-bold">Inventory & catalogue</h2><p className="text-sm text-muted">These items can also appear on your public business page.</p></div><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-2.5 text-muted" size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items" className="w-full rounded-xl border-border pl-9 text-sm sm:w-52" /></div><button onClick={() => openModal("product")} className="rounded-xl bg-primary px-3 text-white"><Plus size={19} /></button></div></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-border text-xs uppercase text-muted"><tr><th className="pb-3">Item</th><th className="pb-3">Category</th><th className="pb-3">Selling price</th><th className="pb-3">Stock</th><th /></tr></thead><tbody>{filteredProducts.map((item) => <tr key={item.id} className="border-b border-border last:border-0"><td className="py-4 font-semibold">{item.name}</td><td className="py-4 text-muted">{item.category}</td><td className="py-4">₹{Number(item.price).toLocaleString("en-IN")}</td><td className={`py-4 font-semibold ${item.stock < 10 ? "text-orange-600" : "text-green-700"}`}>{item.stock} units</td><td className="py-4 text-right"><button onClick={() => removeProduct(item.id)} className="text-muted hover:text-red-600" aria-label={`Remove ${item.name}`}><Trash2 size={17} /></button></td></tr>)}</tbody></table></div></section>}

      {activeTab === "Sales & profit" && <section className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Sales ledger</h2><p className="text-sm text-muted">Profit is calculated from selling price minus cost price.</p></div><button onClick={() => openModal("sale")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">Add sale</button></div><div className="mt-5 space-y-3">{state.sales.map((sale) => <div key={sale.id} className="flex flex-col justify-between gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center"><div><p className="font-semibold">{sale.item}</p><p className="text-sm text-muted">{sale.customer || "Walk-in customer"} · {sale.date}</p></div><div className="text-left sm:text-right"><p className="font-bold text-green-700">₹{Number(sale.amount).toLocaleString("en-IN")}</p><p className="text-xs text-muted">Profit ₹{(Number(sale.amount) - Number(sale.cost)).toLocaleString("en-IN")}</p></div></div>)}</div></section>}

      {activeTab === "Customers" && <section className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Customer book</h2><p className="text-sm text-muted">Keep useful contacts in one place for follow-ups.</p></div><div className="relative"><Search className="absolute left-3 top-2.5 text-muted" size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers" className="w-44 rounded-xl border-border pl-9 text-sm" /></div></div><div className="mt-5 grid gap-3 md:grid-cols-2">{filteredCustomers.map((customer) => <div key={customer.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div><p className="font-semibold">{customer.name}</p><p className="text-sm text-muted">{customer.phone} · {customer.visits} visits</p></div><a href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="rounded-full bg-green-100 p-2 text-green-700" aria-label={`WhatsApp ${customer.name}`}><MessageCircle size={18} /></a></div>)}</div></section>}

      {activeTab === "Appointments" && <section className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Appointments</h2><p className="text-sm text-muted">Ideal for salons, barbers, clinics, repair and service businesses.</p></div><button onClick={() => openModal("appointment")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">New booking</button></div><div className="mt-5 grid gap-3 md:grid-cols-2">{state.appointments.map((item) => <div key={item.id} className="flex items-start justify-between rounded-xl border border-border p-4"><div><p className="font-semibold">{item.customer}</p><p className="mt-1 text-sm text-muted">{item.service} · {item.time}</p></div><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-primary">{item.status}</span></div>)}</div></section>}

      {activeTab === "Business page" && <section className="grid gap-6 lg:grid-cols-5"><div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2"><h2 className="text-lg font-bold">Your public page</h2><p className="mt-1 text-sm text-muted">Tell customers what you sell and how to reach you.</p><form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); save({ ...state, profile: form }); setModal(null); }}><label className="block text-sm font-semibold">Business name<input value={state.profile.name} onChange={(e) => save({ ...state, profile: { ...state.profile, name: e.target.value } })} className="mt-1 w-full rounded-xl border-border" /></label><label className="block text-sm font-semibold">Shop category<select value={state.profile.category} onChange={(e) => save({ ...state, profile: { ...state.profile, category: e.target.value } })} className="mt-1 w-full rounded-xl border-border">{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="block text-sm font-semibold">WhatsApp number<input value={state.profile.phone} onChange={(e) => save({ ...state, profile: { ...state.profile, phone: e.target.value } })} placeholder="+91 98765 43210" className="mt-1 w-full rounded-xl border-border" /></label><button type="button" onClick={() => navigator.clipboard?.writeText(publicLink)} className="w-full rounded-xl border border-primary py-2.5 text-sm font-semibold text-primary">Copy public page link</button></form></div><div className="rounded-2xl bg-gradient-to-br from-primary to-blue-800 p-7 text-white lg:col-span-3"><p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Customer preview</p><h2 className="mt-8 text-3xl font-bold">{state.profile.name || "Your business"}</h2><p className="mt-2 text-blue-100">{state.profile.category} · {state.profile.city || "India"}</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white/10 p-4"><Package size={20} /><p className="mt-2 text-2xl font-bold">{state.products.length}</p><p className="text-sm text-blue-100">Products listed</p></div><div className="rounded-xl bg-white/10 p-4"><MessageCircle size={20} /><p className="mt-2 text-2xl font-bold">WhatsApp</p><p className="text-sm text-blue-100">Direct enquiries</p></div></div><a href={publicLink} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary">Open public page <ArrowUpRight size={17} /></a></div></section>}

      {modal && <Modal title={modal === "product" ? "Add inventory item" : modal === "sale" ? "Record a sale" : "Book an appointment"} onClose={() => setModal(null)}><form onSubmit={submit} className="space-y-4">{modal === "product" && <><Field label="Item or service name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required /><div className="grid grid-cols-2 gap-3"><Field label="Selling price" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} required /><Field label="Cost price" type="number" value={form.cost} onChange={(value) => setForm({ ...form, cost: value })} required /></div><Field label="Stock quantity" type="number" value={form.stock} onChange={(value) => setForm({ ...form, stock: value })} required /></>}{modal === "sale" && <><Field label="Customer name (optional)" value={form.customer} onChange={(value) => setForm({ ...form, customer: value })} /><Field label="Item or service" value={form.item} onChange={(value) => setForm({ ...form, item: value })} required /><div className="grid grid-cols-2 gap-3"><Field label="Amount received" type="number" value={form.amount} onChange={(value) => setForm({ ...form, amount: value })} required /><Field label="Your cost" type="number" value={form.cost} onChange={(value) => setForm({ ...form, cost: value })} required /></div></>}{modal === "appointment" && <><Field label="Customer name" value={form.customer} onChange={(value) => setForm({ ...form, customer: value })} required /><Field label="Service" value={form.service} onChange={(value) => setForm({ ...form, service: value })} required /><Field label="Date and time" type="datetime-local" value={form.time} onChange={(value) => setForm({ ...form, time: value })} required /></>}<button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white"><Check size={18} /> Save</button></form></Modal>}
    </div>
  );
}

function TrendingUpIcon(props) { return <ArrowUpRight {...props} />; }
function Field({ label, value, onChange, type = "text", required = false }) {
  return <label className="block text-sm font-semibold text-text-primary">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="mt-1 w-full rounded-xl border-border" /></label>;
}
