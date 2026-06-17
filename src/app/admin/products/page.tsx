"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Search, X } from "lucide-react";
import { PRODUCTS, CATEGORIES, type Product, type ProductCategory } from "@/lib/products";

interface ProductEntry {
  id: string;
  name: string;
  brand: string | null;
  category: ProductCategory;
  hsn: string;
  gstRate: number;
  unit: string;
  defaultPrice?: number;
  active: boolean;
  description: string;
}

function initProducts(): ProductEntry[] {
  return PRODUCTS.map(p => ({ ...p, active: true, description: "" }));
}

const UNITS = ["Pcs", "Nos", "Set", "Kg", "Meter", "Roll"];

interface FormState {
  name: string;
  brand: string;
  category: ProductCategory | "";
  unit: string;
  description: string;
  hsn: string;
  gstRate: number;
}

export default function ProductMasterPage() {
  const [products, setProducts] = useState<ProductEntry[]>(initProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<ProductCategory | "">("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductEntry | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "", brand: "", category: "", unit: "Pcs", description: "", hsn: "", gstRate: 18,
  });

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.brand || "").toLowerCase().includes(q) || p.hsn.includes(q);
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  function openAdd() {
    setEditing(null);
    setForm({ name: "", brand: "", category: "", unit: "Pcs", description: "", hsn: "", gstRate: 18 });
    setShowForm(true);
  }

  function openEdit(p: ProductEntry) {
    setEditing(p);
    setForm({ name: p.name, brand: p.brand || "", category: p.category, unit: p.unit, description: p.description, hsn: p.hsn, gstRate: p.gstRate });
    setShowForm(true);
  }

  function saveProduct() {
    if (!form.name || !form.category || !form.hsn) return alert("Name, Category and HSN are required");
    const cat = form.category as ProductCategory;
    if (editing) {
      setProducts(ps => ps.map(p => p.id === editing.id
        ? { ...p, name: form.name, brand: form.brand || null, category: cat, unit: form.unit, description: form.description, hsn: form.hsn, gstRate: form.gstRate }
        : p));
    } else {
      const newP: ProductEntry = {
        id: `custom-${Date.now()}`,
        name: form.name,
        brand: form.brand || null,
        category: cat,
        hsn: form.hsn,
        gstRate: form.gstRate,
        unit: form.unit,
        description: form.description,
        active: true,
      };
      setProducts(ps => [...ps, newP]);
    }
    setShowForm(false);
  }

  function toggleActive(id: string) {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    setProducts(ps => ps.filter(p => p.id !== id));
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Master</h1>
          <p className="text-gray-500 text-sm mt-1">Centralized product list used in Invoice, Estimate and Package Builder</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands, HSN..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value as ProductCategory | "")}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["#", "Product Name", "Brand", "Category", "HSN/SAC", "GST%", "Unit", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p, i) => (
                <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${!p.active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-xs">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.brand || <span className="text-gray-400 italic">—</span>}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2 py-0.5">{p.category}</span></td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">{p.hsn}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.gstRate}%</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.unit}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(p.id)}
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full transition-colors ${p.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>
                      {p.active ? <><CheckCircle size={12} /> Active</> : <><XCircle size={12} /> Inactive</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700 p-1 rounded"><Pencil size={15} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600 p-1 rounded"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No products found</div>}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">{editing ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="e.g. Adani 620wp Panel" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Brand (optional)</label>
                  <input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className={inputCls} placeholder="e.g. Adani" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as ProductCategory }))} className={inputCls}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">HSN / SAC Code *</label>
                  <input value={form.hsn} onChange={e => setForm(p => ({ ...p, hsn: e.target.value }))} className={inputCls} placeholder="e.g. 85414300" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">GST Rate (%)</label>
                  <select value={form.gstRate} onChange={e => setForm(p => ({ ...p, gstRate: Number(e.target.value) }))} className={inputCls}>
                    {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                  <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className={inputCls}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Optional description" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveProduct} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
