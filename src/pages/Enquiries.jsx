import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, CircleDot, Clock3, Mail, MessageSquare, Phone, RefreshCw } from "lucide-react";
import { getMyEnquiries, updateEnquiryStatus } from "../api/enquiryApi";

const statusStyle = { new: "bg-blue-50 text-blue-700", in_progress: "bg-amber-50 text-amber-700", closed: "bg-green-50 text-green-700" };

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const result = await getMyEnquiries(); setEnquiries(result.enquiries || []); }
    catch (reason) { setError(reason.message || "Unable to load enquiries."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, [load]);

  const changeStatus = async (id, status) => {
    setUpdating(id);
    try { const { enquiry } = await updateEnquiryStatus(id, status); setEnquiries((items) => items.map((item) => item._id === id ? enquiry : item)); }
    catch (reason) { setError(reason.message || "Unable to update the enquiry."); }
    finally { setUpdating(""); }
  };

  return <div className="mx-auto max-w-5xl space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">Customer messages</p><h1 className="mt-1 text-3xl font-bold text-text-primary">Enquiries</h1><p className="mt-2 text-text-secondary">Messages sent from your live business page appear here in real time after refresh.</p></div><button onClick={load} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-50 disabled:opacity-60"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Refresh</button></div>{error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}{loading ? <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted">Loading enquiries...</div> : enquiries.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"><MessageSquare className="mx-auto text-primary" size={34} /><h2 className="mt-4 text-xl font-bold text-text-primary">No enquiries yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">When visitors use the enquiry form on your published business page, their messages and contact details will appear here.</p></div> : <div className="space-y-4">{enquiries.map((enquiry) => <article key={enquiry._id} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex flex-wrap items-center gap-3"><h2 className="font-bold text-text-primary">{enquiry.name}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusStyle[enquiry.status]}`}>{enquiry.status.replace("_", " ")}</span></div><p className="mt-1 inline-flex items-center gap-1 text-xs text-muted"><Clock3 size={14} /> {new Date(enquiry.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div><select value={enquiry.status} disabled={updating === enquiry._id} onChange={(event) => changeStatus(enquiry._id, event.target.value)} className="rounded-xl border-border text-sm font-semibold capitalize disabled:opacity-60"><option value="new">New</option><option value="in_progress">In progress</option><option value="closed">Closed</option></select></div><p className="mt-4 whitespace-pre-wrap leading-7 text-text-secondary">{enquiry.message}</p><div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">{enquiry.phone && <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Phone size={16} /> {enquiry.phone}</a>}{enquiry.email && <a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Mail size={16} /> {enquiry.email}</a>}{enquiry.status === "closed" && <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700"><CheckCircle2 size={16} /> Closed</span>}{enquiry.status === "new" && <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700"><CircleDot size={16} /> Needs a response</span>}</div></article>)}</div>}</div>;
}
