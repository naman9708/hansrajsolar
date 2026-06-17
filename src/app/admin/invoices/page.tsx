"use client";

import { useState, useRef, useCallback } from "react";
import { Plus, Eye, Printer, Download, RefreshCw } from "lucide-react";
import ProductRow from "@/components/invoice/ProductRow";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { COMPANY } from "@/lib/company";
import { formatDate } from "@/lib/utils";
import { calcLineItem } from "@/lib/invoice-calc";
import type { InvoiceLineItem, InvoiceData } from "@/types/invoice";

let _idCounter = 0;
function newId() {
  return `row-${++_idCounter}-${Date.now()}`;
}

function emptyItem(): InvoiceLineItem {
  return {
    id: newId(),
    category: "",
    brand: "",
    productId: "",
    productName: "",
    hsn: "",
    quantity: 1,
    unit: "",
    unitPrice: 0,
    gstRate: 0,
    taxableAmount: 0,
    gstAmount: 0,
    totalAmount: 0,
  };
}

export default function InvoicesPage() {
  const [docType, setDocType] = useState<"Estimate" | "Invoice">("Estimate");
  const [docNumber, setDocNumber] = useState("22");
  const [docDate, setDocDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerGstin, setCustomerGstin] = useState("");
  const [items, setItems] = useState<InvoiceLineItem[]>([emptyItem()]);
  const [terms, setTerms] = useState(COMPANY.termsAndConditions);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const addRow = useCallback(() => {
    setItems((prev) => [...prev, emptyItem()]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateItem = useCallback((updated: InvoiceLineItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }, []);

  const resetForm = () => {
    setItems([emptyItem()]);
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPhone("");
    setCustomerGstin("");
  };

  const invoiceData: InvoiceData = {
    type: docType,
    number: docNumber,
    date: new Date(docDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    customer: {
      name: customerName,
      address: customerAddress,
      phone: customerPhone,
      gstin: customerGstin,
    },
    items,
    termsAndConditions: terms,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {docType} Builder
          </h1>
          <p className="text-gray-500 text-sm">
            Hansraj Solar — Smart Product Selection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw size={15} /> Reset
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-400 text-orange-600 hover:bg-orange-50 transition-colors text-sm"
          >
            <Eye size={15} /> {showPreview ? "Hide" : "Preview"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6 space-y-6">
        {/* ── Document Type & Meta ──────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
            Document Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) =>
                  setDocType(e.target.value as "Estimate" | "Invoice")
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="Estimate">Estimate</option>
                <option value="Invoice">Invoice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Number
              </label>
              <input
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. 22"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        {/* ── Customer Details ───────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
            Customer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Customer Name *
              </label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="MANOJ KUMAR"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address *
              </label>
              <input
                value={customerAddress}
                onChange={(e) =>
                  setCustomerAddress(e.target.value.toUpperCase())
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="GAUSPUR IRA, HAJIPUR"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="9XXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Customer GSTIN (optional)
              </label>
              <input
                value={customerGstin}
                onChange={(e) =>
                  setCustomerGstin(e.target.value.toUpperCase())
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="GSTIN if applicable"
              />
            </div>
          </div>
        </div>

        {/* ── Product Table ──────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Products / Items
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Select category → brand → product. HSN/SAC, GST &amp; Unit are
                filled automatically.
              </p>
            </div>
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              <Plus size={15} /> Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-8">
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Item (Category → Brand → Product)
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-28">
                    HSN/SAC{" "}
                    <span className="text-green-600 normal-case">(auto)</span>
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-20">
                    Qty
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-16">
                    Unit{" "}
                    <span className="text-green-600 normal-case">(auto)</span>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase w-28">
                    Unit Price (₹)
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase w-32">
                    GST{" "}
                    <span className="text-green-600 normal-case">(auto)</span>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase w-32">
                    Amount{" "}
                    <span className="text-green-600 normal-case">(auto)</span>
                  </th>
                  <th className="px-3 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <ProductRow
                    key={item.id}
                    index={idx}
                    item={item}
                    onChange={updateItem}
                    onRemove={() => removeRow(item.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Info banner */}
          <div className="px-5 py-3 bg-blue-50 border-t border-blue-100 text-xs text-blue-700">
            <strong>How to use:</strong> Select a category first. For Solar
            Panels, Inverters &amp; Batteries — choose the brand, then the
            product. For GI Structures, Solar BOS &amp; Installation Services —
            select the product directly. Fill in <strong>Qty</strong> and{" "}
            <strong>Unit Price</strong>. Everything else calculates
            automatically.
          </div>
        </div>

        {/* ── Terms & Conditions ─────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
            Terms &amp; Conditions
          </h2>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        {/* ── Invoice Preview ─────────────────────────────────── */}
        {showPreview && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-orange-200 bg-orange-50">
              <h2 className="font-semibold text-orange-800 text-sm uppercase tracking-wide">
                Live Preview — exactly as it will print
              </h2>
            </div>
            <div className="p-4" ref={previewRef}>
              <InvoicePreview data={invoiceData} />
            </div>
          </div>
        )}
      </div>

      {/* ── Print Styles (only visible when printing) ────────── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-preview,
          #invoice-preview * {
            visibility: visible;
          }
          #invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
