"use client";
import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, Copy, Eye, EyeOff,
  CheckCircle, XCircle, Printer, Package, IndianRupee, X
} from "lucide-react";
import { PRODUCTS, CATEGORIES, type ProductCategory } from "@/lib/products";
import { COMPANY } from "@/lib/company";
import { formatNumber, amountInWords } from "@/lib/utils";
import { DEFAULT_ADMIN_PACKAGES, loadStoredAdminPackages, saveAdminPackages, loadAdminPackagesFromDB, saveAdminPackagesToDB } from "@/lib/packages";

// ── Types ────────────────────────────────────────────────────
interface PkgProduct {
  rowId: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseCost: number; // ADMIN ONLY — never shown to customer
}

interface SolarPackage {
  id: string;
  name: string;
  capacity: string;
  type: "1kW" | "3kW" | "5kW" | "10kW" | "Custom";
  description: string;
  warranty: string;
  products: PkgProduct[];
  // Costing (admin only)
  installationCost: number;
  transportationCost: number;
  otherCharges: number;
  profitMarginPct: number;
  // Public
  active: boolean;
  popular: boolean;
}

// ── Default packages ─────────────────────────────────────────
// Admin package defaults are loaded from DEFAULT_ADMIN_PACKAGES in /src/lib/packages.ts

// ── Costing calculation ───────────────────────────────────────
function calcPackageCosting(pkg: SolarPackage) {
  const materialCost = pkg.products.reduce((s, p) => s + p.purchaseCost * p.quantity, 0);
  const totalCost = materialCost + pkg.installationCost + pkg.transportationCost + pkg.otherCharges;
  const profitAmount = (totalCost * pkg.profitMarginPct) / 100;
  const sellingPrice = totalCost + profitAmount;
  return { materialCost, totalCost, profitAmount, sellingPrice };
}

let rowCounter = 100;
function newRowId() { return `row-${++rowCounter}`; }

// ── Component ────────────────────────────────────────────────
export default function PackagesPage() {
  const [packages, setPackages] = useState<SolarPackage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPdf, setShowPdf] = useState<SolarPackage | null>(null);
  const [showCosting, setShowCosting] = useState<string | null>(null);
  const [editing, setEditing] = useState<SolarPackage | null>(null);
  const [pkg, setPkg] = useState<SolarPackage | null>(null);

  useEffect(() => {
    // Load packages from DB (or localStorage fallback)
    loadAdminPackagesFromDB().then((loadedPackages) => {
      setPackages(loadedPackages);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    // Save packages to DB when they change after initial load
    if (!isLoaded) return;
    saveAdminPackagesToDB(packages);
  }, [packages, isLoaded]);

  const emptyPkg = (): SolarPackage => ({
    id: `pkg-${Date.now()}`,
    name: "",
    capacity: "",
    type: "Custom",
    description: "",
    warranty: "25 years Panel | 5 years Inverter | 1 year Installation",
    products: [],
    installationCost: 0,
    transportationCost: 0,
    otherCharges: 0,
    profitMarginPct: 20,
    active: true,
    popular: false,
  });

  function openAdd() {
    const p = emptyPkg();
    setEditing(null);
    setPkg(p);
    setShowForm(true);
  }

  function openEdit(p: SolarPackage) {
    setEditing(p);
    setPkg({ ...p, products: p.products.map(r => ({ ...r })) });
    setShowForm(true);
  }

  function duplicatePkg(p: SolarPackage) {
    const dup: SolarPackage = {
      ...p,
      id: `pkg-${Date.now()}`,
      name: `${p.name} (Copy)`,
      products: p.products.map(r => ({ ...r, rowId: newRowId() })),
    };
    setPackages(ps => [...ps, dup]);
  }

  function deletePkg(id: string) {
    if (!confirm("Delete this package?")) return;
    setPackages(ps => ps.filter(p => p.id !== id));
  }

  function toggleActive(id: string) {
    setPackages(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  function savePkg() {
    if (!pkg) return;
    if (!pkg.name || !pkg.capacity) return alert("Name and Capacity are required");
    if (editing) {
      setPackages(ps => ps.map(p => p.id === editing.id ? pkg : p));
    } else {
      setPackages(ps => [...ps, pkg]);
    }
    setShowForm(false);
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Package Builder</h1>
          <p className="text-gray-500 text-sm mt-1">Create solar package proposals with internal costing. Customers only see final price.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={16} /> New Package
        </button>
      </div>

      {/* Package cards */}
      <div className="space-y-4">
        {packages.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <Package size={40} className="mx-auto mb-3 text-gray-300" />
            No packages yet. Click "New Package" to create one.
          </div>
        )}
        {packages.map(p => {
          const cost = calcPackageCosting(p);
          const showingCost = showCosting === p.id;
          return (
            <div key={p.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${!p.active ? "opacity-60" : ""} ${p.popular ? "border-purple-300 ring-1 ring-purple-300" : "border-gray-200"}`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
                      {p.popular && <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 rounded-full px-2 py-0.5">⭐ Popular</span>}
                      <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${p.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{p.description}</p>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="text-gray-600"><strong>Capacity:</strong> {p.capacity}</span>
                      <span className="text-gray-600"><strong>Products:</strong> {p.products.length}</span>
                      <span className="text-orange-600 font-bold"><strong>Selling Price: ₹{formatNumber(cost.sellingPrice)}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button onClick={() => setShowCosting(showingCost ? null : p.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                      {showingCost ? <><EyeOff size={13} /> Hide Cost</> : <><Eye size={13} /> Cost Sheet</>}
                    </button>
                    <button onClick={() => setShowPdf(p)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
                      <Printer size={13} /> Customer PDF
                    </button>
                    <button onClick={() => duplicatePkg(p)} className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"><Copy size={14} /></button>
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg border border-gray-300 text-blue-500 hover:bg-blue-50"><Pencil size={14} /></button>
                    <button onClick={() => toggleActive(p.id)} className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
                      {p.active ? <XCircle size={14} /> : <CheckCircle size={14} />}
                    </button>
                    <button onClick={() => deletePkg(p.id)} className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50"><Trash2 size={14} /></button>
                  </div>
                </div>

                {/* Internal costing — admin only */}
                {showingCost && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-yellow-800 mb-3 uppercase tracking-wide">🔒 Internal Cost Sheet — Admin Only (Never shown to customer)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      {[
                        { l: "Material Cost", v: cost.materialCost },
                        { l: "Installation Cost", v: p.installationCost },
                        { l: "Transportation", v: p.transportationCost },
                        { l: "Other Charges", v: p.otherCharges },
                        { l: "Total Cost", v: cost.totalCost },
                        { l: `Profit (${p.profitMarginPct}%)`, v: cost.profitAmount },
                      ].map(({ l, v }) => (
                        <div key={l} className="bg-white rounded-lg p-3 border border-yellow-200">
                          <p className="text-xs text-gray-500">{l}</p>
                          <p className="font-bold text-gray-800">₹{formatNumber(v)}</p>
                        </div>
                      ))}
                      <div className="bg-orange-500 rounded-lg p-3 text-white">
                        <p className="text-xs text-orange-100">Selling Price</p>
                        <p className="font-bold text-lg">₹{formatNumber(cost.sellingPrice)}</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-yellow-100">
                          <tr>
                            {["Product", "Category", "Qty", "Unit", "Purchase Cost", "Line Total"].map(h => (
                              <th key={h} className="px-3 py-2 text-left text-yellow-800 font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {p.products.map(pr => (
                            <tr key={pr.rowId} className="border-t border-yellow-100">
                              <td className="px-3 py-2 text-gray-700">{pr.productName}</td>
                              <td className="px-3 py-2 text-gray-500">{pr.category}</td>
                              <td className="px-3 py-2 text-gray-700">{pr.quantity}</td>
                              <td className="px-3 py-2 text-gray-700">{pr.unit}</td>
                              <td className="px-3 py-2 text-gray-700">₹{formatNumber(pr.purchaseCost)}</td>
                              <td className="px-3 py-2 font-semibold text-gray-800">₹{formatNumber(pr.purchaseCost * pr.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Package Form Modal ─────────────────────────────── */}
      {showForm && pkg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-lg">{editing ? "Edit Package" : "New Package"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Package Name *</label>
                  <input value={pkg.name} onChange={e => setPkg(p => p ? { ...p, name: e.target.value } : p)} className={inputCls} placeholder="e.g. 5 kW Solar Package" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Capacity *</label>
                  <input value={pkg.capacity} onChange={e => setPkg(p => p ? { ...p, capacity: e.target.value } : p)} className={inputCls} placeholder="e.g. 5 kW" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Package Type</label>
                  <select value={pkg.type} onChange={e => setPkg(p => p ? { ...p, type: e.target.value as SolarPackage["type"] } : p)} className={inputCls}>
                    {["1kW", "3kW", "5kW", "10kW", "Custom"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea value={pkg.description} onChange={e => setPkg(p => p ? { ...p, description: e.target.value } : p)} rows={2} className={`${inputCls} resize-none`} placeholder="Brief description for customers" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Warranty Info</label>
                  <input value={pkg.warranty} onChange={e => setPkg(p => p ? { ...p, warranty: e.target.value } : p)} className={inputCls} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="active" checked={pkg.active} onChange={e => setPkg(p => p ? { ...p, active: e.target.checked } : p)} className="w-4 h-4 accent-purple-600" />
                  <label htmlFor="active" className="text-sm text-gray-700">Active (visible on website)</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="popular" checked={pkg.popular} onChange={e => setPkg(p => p ? { ...p, popular: e.target.checked } : p)} className="w-4 h-4 accent-purple-600" />
                  <label htmlFor="popular" className="text-sm text-gray-700">Mark as Popular</label>
                </div>
              </div>

              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Products in this Package</label>
                  <button onClick={() => setPkg(p => p ? { ...p, products: [...p.products, { rowId: newRowId(), productId: "", productName: "", category: "", quantity: 1, unit: "Pcs", purchaseCost: 0 }] } : p)}
                    className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg font-medium">
                    <Plus size={12} /> Add Product
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {pkg.products.map((row, idx) => (
                    <div key={row.rowId} className="grid grid-cols-12 gap-2 bg-gray-50 rounded-lg p-2">
                      <div className="col-span-5">
                        <select value={row.productId} onChange={e => {
                          const prod = PRODUCTS.find(p => p.id === e.target.value);
                          setPkg(pk => pk ? { ...pk, products: pk.products.map((r, i) => i === idx ? { ...r, productId: prod?.id || "", productName: prod?.name || "", category: prod?.category || "", unit: prod?.unit || "Pcs" } : r) } : pk);
                        }} className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400">
                          <option value="">— Select Product —</option>
                          {CATEGORIES.map(cat => (
                            <optgroup key={cat} label={cat}>
                              {PRODUCTS.filter(p => p.category === cat).map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input type="number" min={1} value={row.quantity} onChange={e => setPkg(pk => pk ? { ...pk, products: pk.products.map((r, i) => i === idx ? { ...r, quantity: Number(e.target.value) } : r) } : pk)}
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-purple-400" placeholder="Qty" />
                      </div>
                      <div className="col-span-1 flex items-center">
                        <span className="text-xs text-gray-500">{row.unit}</span>
                      </div>
                      <div className="col-span-3">
                        <input type="number" min={0} value={row.purchaseCost || ""} onChange={e => setPkg(pk => pk ? { ...pk, products: pk.products.map((r, i) => i === idx ? { ...r, purchaseCost: Number(e.target.value) } : r) } : pk)}
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-right focus:outline-none focus:ring-1 focus:ring-purple-400" placeholder="Purchase Cost ₹" />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <button onClick={() => setPkg(pk => pk ? { ...pk, products: pk.products.filter((_, i) => i !== idx) } : pk)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                      </div>
                    </div>
                  ))}
                  {pkg.products.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No products added yet</p>}
                </div>
              </div>

              {/* Costing */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-xs font-bold text-yellow-800 mb-3 uppercase tracking-wide">🔒 Internal Costing (Admin Only)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: "Installation Cost (₹)", k: "installationCost" },
                    { l: "Transportation Cost (₹)", k: "transportationCost" },
                    { l: "Other Charges (₹)", k: "otherCharges" },
                    { l: "Profit Margin (%)", k: "profitMarginPct" },
                  ].map(({ l, k }) => (
                    <div key={k}>
                      <label className="block text-xs text-gray-600 mb-1">{l}</label>
                      <input type="number" min={0} value={(pkg as never)[k] || ""} onChange={e => setPkg(p => p ? { ...p, [k]: Number(e.target.value) } : p)}
                        className="w-full border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white" />
                    </div>
                  ))}
                </div>
                {(() => {
                  const c = calcPackageCosting(pkg);
                  return (
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Total Cost: <strong>₹{formatNumber(c.totalCost)}</strong></span>
                      <span className="text-gray-600">Profit: <strong>₹{formatNumber(c.profitAmount)}</strong></span>
                      <span className="text-orange-600 font-bold text-base">Selling Price: ₹{formatNumber(c.sellingPrice)}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={savePkg} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold">Save Package</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Customer PDF Modal ─────────────────────────────── */}
      {showPdf && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Customer Proposal — Print / Save as PDF</h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button onClick={() => setShowPdf(null)} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
              </div>
            </div>
            <div id="pkg-pdf" className="p-6">
              <PackageProposal pkg={showPdf} cost={calcPackageCosting(showPdf)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Package Proposal PDF Component ───────────────────────────
function PackageProposal({ pkg, cost }: { pkg: SolarPackage; cost: ReturnType<typeof calcPackageCosting> }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }} className="text-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-orange-500 pb-5 mb-5">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white text-xl">☀️</div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">{COMPANY.brand}</h1>
            <p className="text-gray-500 text-xs">{COMPANY.legalName}</p>
          </div>
        </div>
        <p className="text-gray-500 text-xs">{COMPANY.address} | {COMPANY.phone} | {COMPANY.email}</p>
      </div>

      {/* Title */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl p-5 mb-5 text-center">
        <p className="text-xs uppercase tracking-widest text-orange-100 mb-1">Solar Package Proposal</p>
        <h2 className="text-2xl font-bold">{pkg.name}</h2>
        <p className="text-orange-100 mt-1">{pkg.capacity} System</p>
      </div>

      {/* Description */}
      {pkg.description && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">{pkg.description}</p>
        </div>
      )}

      {/* Included Products — NO prices shown */}
      <div className="mb-5">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Package size={16} className="text-orange-500" /> Included in This Package
        </h3>
        <table className="w-full border-collapse border border-gray-300 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left">#</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Product / Component</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Category</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Qty</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Unit</th>
            </tr>
          </thead>
          <tbody>
            {pkg.products.filter(p => p.productName).map((p, i) => (
              <tr key={p.rowId} className="border-b border-gray-200">
                <td className="border border-gray-300 px-3 py-2 text-center">{i + 1}</td>
                <td className="border border-gray-300 px-3 py-2 font-medium">{p.productName}</td>
                <td className="border border-gray-300 px-3 py-2 text-gray-600">{p.category}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{p.quantity}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{p.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-2 text-right italic">* Individual product prices not disclosed. Package price is all-inclusive.</p>
      </div>

      {/* Benefits */}
      <div className="mb-5">
        <h3 className="font-bold text-gray-800 mb-2">Package Benefits</h3>
        <div className="grid grid-cols-2 gap-2">
          {["Reduce electricity bills up to 90%", "Clean & renewable energy", "25 year performance warranty", "Government subsidy eligible", "Professional installation", "After-sales support included"].map(b => (
            <div key={b} className="flex items-center gap-2 text-xs text-gray-700 bg-green-50 rounded-lg p-2">
              <CheckCircle size={12} className="text-green-500 flex-shrink-0" /> {b}
            </div>
          ))}
        </div>
      </div>

      {/* Warranty */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
        <p className="font-semibold text-blue-800 text-sm mb-1">🛡️ Warranty Coverage</p>
        <p className="text-blue-700 text-xs">{pkg.warranty}</p>
      </div>

      {/* Final Price — only this is shown */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-5 mb-5 text-center">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">All-Inclusive Package Price</p>
        <p className="text-4xl font-bold text-orange-400">₹{formatNumber(cost.sellingPrice)}</p>
        <p className="text-gray-400 text-xs mt-2">Inclusive of all materials, installation, and taxes</p>
        <p className="text-gray-300 text-xs mt-1 italic">{amountInWords(cost.sellingPrice)}</p>
      </div>

      {/* Terms */}
      <div className="border border-gray-200 rounded-xl p-4 mb-5">
        <p className="font-semibold text-gray-700 text-sm mb-2">Terms & Conditions</p>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Price is valid for 30 days from proposal date.</p>
          <p>• 50% advance payment required to confirm order.</p>
          <p>• Installation timeline: 2–5 working days after material delivery.</p>
          <p>• Government subsidy paperwork assistance provided at no extra charge.</p>
          <p>• Subject to site survey. Price may vary based on roof type and location.</p>
        </div>
      </div>

      {/* Contact */}
      <div className="flex justify-between items-end border-t border-gray-200 pt-4">
        <div>
          <p className="font-semibold text-gray-700 text-sm mb-1">Contact Us</p>
          <p className="text-xs text-gray-600">📞 {COMPANY.phone}</p>
          <p className="text-xs text-gray-600">✉️ {COMPANY.email}</p>
          <p className="text-xs text-gray-600">📍 {COMPANY.address}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg" style={{ fontFamily: "cursive" }}>{COMPANY.legalName}</p>
          <p className="text-xs text-gray-500 mt-4 italic">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
}
