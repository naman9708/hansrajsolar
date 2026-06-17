"use client";
import { useState } from "react";
import Link from "next/link";
import { FileText, Package, BoxSelect, Image, ArrowRight, Sun, TrendingUp, Zap } from "lucide-react";

const STATS = [
  { label: "Total Products", value: "30+", icon: BoxSelect, color: "bg-blue-500", href: "/admin/products" },
  { label: "Total Packages", value: "5", icon: Package, color: "bg-purple-500", href: "/admin/packages" },
  { label: "Invoices/Estimates", value: "∞", icon: FileText, color: "bg-orange-500", href: "/admin/invoices" },
  { label: "Gallery Photos", value: "6", icon: Image, color: "bg-green-500", href: "/admin/gallery" },
];

const QUICK_ACTIONS = [
  { label: "New Invoice / Estimate", desc: "Create estimate or invoice for a customer", href: "/admin/invoices", icon: FileText, color: "from-orange-500 to-orange-600" },
  { label: "Manage Products", desc: "Add, edit or remove products from master list", href: "/admin/products", icon: BoxSelect, color: "from-blue-500 to-blue-600" },
  { label: "Build a Package", desc: "Create solar package proposals with costing", href: "/admin/packages", icon: Package, color: "from-purple-500 to-purple-600" },
  { label: "Update Gallery", desc: "Upload and manage project photos", href: "/admin/gallery", icon: Image, color: "from-green-500 to-green-600" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome to Hansraj Solar Admin Panel</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
          <Sun size={18} className="text-orange-500" />
          <span className="text-sm font-medium text-gray-700">Hansraj Vastralay</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map(({ label, desc, href, icon: Icon, color }) => (
            <Link key={label} href={href}
              className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <Zap size={24} className="mb-3 text-orange-200" />
          <h3 className="font-bold text-lg mb-1">Invoice &amp; Estimate Builder</h3>
          <p className="text-orange-100 text-sm mb-4">Smart product selection with auto HSN/SAC, GST calculation, and print-ready PDF layout matching your format exactly.</p>
          <Link href="/admin/invoices" className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-50 transition-colors">
            Open Builder <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <Package size={24} className="mb-3 text-purple-200" />
          <h3 className="font-bold text-lg mb-1">Package Builder</h3>
          <p className="text-purple-100 text-sm mb-4">Build solar package proposals with internal cost calculation. Customers only see the final price — never the cost breakdown.</p>
          <Link href="/admin/packages" className="inline-flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-50 transition-colors">
            Build Package <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
