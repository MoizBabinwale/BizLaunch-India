import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, Package, Pencil, Plus, Trash2, X } from "lucide-react";
import { createProduct, deleteProduct, listProducts, updateProduct } from "../api/catalogueApi";
import { getMyBusiness } from "../api/businessApi";
import PhotoField from "../components/common/PhotoField";

const blankProduct = {
  name: "",
  category: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  description: "",
  images: [],
  isActive: true,
};

const fieldClass =
  "mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";

export default function Products() {
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
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
      const result = await listProducts(shop._id);
      setProducts(result.products || []);
    } catch (reason) {
      setError(reason.message || "Unable to load your products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openForm = (product = null) => {
    setError("");
    setNotice("");
    const selected = product
      ? { ...blankProduct, ...product, price: String(product.price ?? ""), compareAtPrice: String(product.compareAtPrice ?? ""), stock: String(product.stock ?? "") }
      : { ...blankProduct };
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
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice || 0),
      stock: Number(form.stock || 0),
      images: form.images || [],
    };
    try {
      if (form._id) await updateProduct(business._id, form._id, payload);
      else await createProduct(business._id, payload);
      setForm(null);
      setNotice(form._id ? "Product updated." : "Product added to your shop.");
      await load();
    } catch (reason) {
      setError(reason.message || "Unable to save this product.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product) => {
    if (!business || !window.confirm(`Delete "${product.name}" from your catalogue?`)) return;
    setError("");
    setNotice("");
    try {
      await deleteProduct(business._id, product._id);
      setProducts((current) => current.filter((item) => item._id !== product._id));
      setNotice("Product deleted.");
    } catch (reason) {
      setError(reason.message || "Unable to delete this product.");
    }
  };

  if (loading) return <p className="p-8 text-muted">Loading your products...</p>;
  if (!business) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <Package className="mx-auto text-primary" size={36} />
        <h1 className="mt-4 text-2xl font-bold">Create your shop first</h1>
        <p className="mt-2 text-text-secondary">Add your business profile before creating its product catalogue.</p>
        <Link to="/dashboard/my-business" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white">Set up my shop</Link>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Shop catalogue</p>
          <h1 className="mt-1 text-3xl font-bold text-text-primary">Products</h1>
          <p className="mt-2 text-text-secondary">Add product photos, pricing, stock and details for {business.name}.</p>
        </div>
        <button onClick={() => openForm()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white">
          <Plus size={18} /> Add product
        </button>
      </header>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{notice}</p>}

      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product._id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center bg-primary-sky text-primary"><ImagePlus size={34} /></div>
              )}
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><h2 className="font-bold text-text-primary">{product.name}</h2><p className="text-sm text-muted">{product.category || "Uncategorized"}</p></div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>{product.isActive ? "Active" : "Hidden"}</span>
                </div>
                <p className="line-clamp-3 min-h-[3.75rem] text-sm text-text-secondary">{product.description || "No product description yet."}</p>
                <div className="flex items-baseline gap-2"><strong className="text-lg text-primary">₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>{product.compareAtPrice > product.price && <span className="text-sm text-muted line-through">₹{Number(product.compareAtPrice).toLocaleString("en-IN")}</span>}<span className="ml-auto text-xs text-muted">{product.stock} in stock</span></div>
                <div className="flex gap-2 border-t border-border pt-3">
                  <button onClick={() => openForm(product)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Pencil size={15} /> Edit</button>
                  <button onClick={() => remove(product)} aria-label={`Delete ${product.name}`} className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <Package className="mx-auto text-muted" size={36} />
          <h2 className="mt-4 text-xl font-bold">Your product catalogue is empty</h2>
          <p className="mt-2 text-sm text-text-secondary">Add your first product to show customers what your shop sells.</p>
          <button onClick={() => openForm()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white"><Plus size={17} /> Add your first product</button>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" role="presentation">
          <form onSubmit={save} className="my-auto w-full max-w-2xl space-y-5 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">{form._id ? "Edit listing" : "New listing"}</p><h2 className="text-2xl font-bold">{form._id ? "Update product" : "Add a product"}</h2></div><button type="button" onClick={() => setForm(null)} aria-label="Close form" className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">Product name *<input className={fieldClass} name="name" value={form.name} onChange={change} required maxLength={120} /></label>
              <label className="text-sm font-semibold">Category<input className={fieldClass} name="category" value={form.category} onChange={change} maxLength={80} placeholder="e.g. Clothing, groceries" /></label>
              <label className="text-sm font-semibold">Selling price (₹) *<input className={fieldClass} name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></label>
              <label className="text-sm font-semibold">Original price (₹)<input className={fieldClass} name="compareAtPrice" type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={change} /></label>
              <label className="text-sm font-semibold">Stock quantity<input className={fieldClass} name="stock" type="number" min="0" step="1" value={form.stock} onChange={change} /></label>
              <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold"><input type="checkbox" name="isActive" checked={Boolean(form.isActive)} onChange={change} className="rounded border-border text-primary focus:ring-primary" /> Show this product</label>
            </div>
            <label className="block text-sm font-semibold">Product details<textarea className={fieldClass} name="description" rows={4} value={form.description} onChange={change} maxLength={3000} placeholder="Describe features, materials, sizes, delivery, or anything customers should know." /></label>
            <PhotoField label="Product photos" value={form.images || []} onChange={(images) => setForm((current) => ({ ...current, images }))} />
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setForm(null)} className="rounded-xl border border-border px-4 py-2.5 font-semibold">Cancel</button><button disabled={saving} className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : form._id ? "Save changes" : "Add product"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
