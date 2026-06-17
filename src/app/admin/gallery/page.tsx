"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Image, X } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  location: string;
  capacity: string;
  description: string;
  emoji: string;
  active: boolean;
  year: string;
}

const EMOJIS = ["🏠","🏢","🏭","🏘️","🏫","🏙️","⚡","🌞"];

const INITIAL: GalleryItem[] = [
  { id:"g1", title:"Residential Rooftop", location:"Hajipur, Vaishali", capacity:"5 kW", description:"Complete 5kW on-grid system with net metering.", emoji:"🏠", active:true, year:"2025" },
  { id:"g2", title:"Commercial Building", location:"Muzaffarpur, Bihar", capacity:"15 kW", description:"Three-phase 15kW system for high daytime load.", emoji:"🏢", active:true, year:"2025" },
  { id:"g3", title:"Village Home", location:"Madarpur, Vaishali", capacity:"3 kW", description:"3kW hybrid with battery backup.", emoji:"🏘️", active:true, year:"2024" },
  { id:"g4", title:"Industrial Rooftop", location:"Patna, Bihar", capacity:"25 kW", description:"Industrial-grade 25kW with monitoring.", emoji:"🏭", active:true, year:"2024" },
  { id:"g5", title:"School Solar Plant", location:"Vaishali, Bihar", capacity:"10 kW", description:"10kW plant for school common areas.", emoji:"🏫", active:true, year:"2024" },
  { id:"g6", title:"Apartment Complex", location:"Hajipur, Bihar", capacity:"20 kW", description:"Common area solar for apartments.", emoji:"🏙️", active:true, year:"2023" },
];

const MAX_ACTIVE = 10;

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ title:"", location:"", capacity:"", description:"", emoji:"🏠", year: new Date().getFullYear().toString() });

  const activeCount = items.filter(i => i.active).length;

  function openAdd() {
    if (activeCount >= MAX_ACTIVE) return alert(`Maximum ${MAX_ACTIVE} active photos allowed. Deactivate one first.`);
    setEditing(null);
    setForm({ title:"", location:"", capacity:"", description:"", emoji:"🏠", year: new Date().getFullYear().toString() });
    setShowForm(true);
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm({ title: item.title, location: item.location, capacity: item.capacity, description: item.description, emoji: item.emoji, year: item.year });
    setShowForm(true);
  }

  function save() {
    if (!form.title || !form.location || !form.capacity) return alert("Title, Location and Capacity are required");
    if (editing) {
      setItems(its => its.map(i => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setItems(its => [...its, { id:`g${Date.now()}`, ...form, active: true }]);
    }
    setShowForm(false);
  }

  function toggleActive(id: string) {
    const item = items.find(i => i.id === id);
    if (item && !item.active && activeCount >= MAX_ACTIVE) return alert(`Maximum ${MAX_ACTIVE} active photos allowed.`);
    setItems(its => its.map(i => i.id === id ? { ...i, active: !i.active } : i));
  }

  function deleteItem(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    setItems(its => its.filter(i => i.id !== id));
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Active: <span className={`font-semibold ${activeCount >= MAX_ACTIVE ? "text-red-500" : "text-green-600"}`}>{activeCount}/{MAX_ACTIVE}</span> photos shown on website
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${!item.active ? "opacity-60 border-gray-200" : "border-green-200"}`}>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 h-36 flex items-center justify-center text-5xl">
              {item.emoji}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.location} • {item.year}</p>
                </div>
                <span className="text-xs bg-orange-100 text-orange-600 rounded-full px-2 py-0.5 flex-shrink-0 ml-2">{item.capacity}</span>
              </div>
              <p className="text-gray-600 text-xs mb-3 leading-relaxed">{item.description}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(item.id)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${item.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {item.active ? <><CheckCircle size={11} /> Active</> : <><XCircle size={11} /> Inactive</>}
                </button>
                <button onClick={() => openEdit(item)} className="text-blue-500 hover:text-blue-700 p-1"><Pencil size={14} /></button>
                <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <Image size={40} className="mx-auto mb-2 text-gray-300" />No gallery items yet.
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-800">{editing ? "Edit Gallery Item" : "Add Gallery Item"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="e.g. Residential 5kW Installation" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Capacity *</label>
                  <input value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className={inputCls} placeholder="5 kW" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                  <input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className={inputCls} placeholder="2025" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location *</label>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className={inputCls} placeholder="Village, District, Bihar" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Brief description of this installation" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setForm(p => ({ ...p, emoji: e }))}
                      className={`text-2xl p-2 rounded-lg border transition-colors ${form.emoji === e ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
