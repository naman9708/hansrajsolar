"use client";

import { COMPANY } from "@/lib/company";
import { calcInvoiceSummary } from "@/lib/invoice-calc";
import { formatNumber, formatCurrency } from "@/lib/utils";
import type { InvoiceData, InvoiceLineItem } from "@/types/invoice";

interface Props {
  data: InvoiceData;
  printMode?: boolean;
}

export default function InvoicePreview({ data, printMode = false }: Props) {
  const filledItems = data.items.filter((i) => i.productId);
  const summary = calcInvoiceSummary(filledItems);
  const totalQty = filledItems.reduce((s, i) => s + (i.quantity || 0), 0);

  return (
    <div
      id="invoice-preview"
      className={`bg-white font-sans ${printMode ? "p-4 text-xs" : "p-6 text-sm"} max-w-4xl mx-auto`}
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* ── Title ─────────────────────────────────────────── */}
      <div className="text-center mb-3">
        <h1
          className={`font-bold underline ${printMode ? "text-base" : "text-xl"}`}
        >
          {data.type}
        </h1>
      </div>

      {/* ── Company Header ────────────────────────────────── */}
      <div className="border border-gray-400 mb-3">
        <div className="flex items-start gap-4 p-3 border-b border-gray-400">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: "linear-gradient(135deg, #f97316, #eab308)" }}
            >
              ☀️
            </div>
          </div>
          {/* Company Info */}
          <div className="flex-1">
            <h2
              className={`font-bold text-gray-800 ${printMode ? "text-lg" : "text-2xl"}`}
            >
              {COMPANY.legalName}
            </h2>
            <p className="text-gray-600">{COMPANY.address}</p>
            <p className="text-gray-600">
              Phone: <strong>{COMPANY.phone}</strong>
            </p>
            <p className="text-gray-600">
              GSTIN: <strong>{COMPANY.gstin}</strong>
            </p>
          </div>
          <div className="text-right text-gray-600">
            <p>
              Email: <strong>{COMPANY.email}</strong>
            </p>
            <p>
              State: <strong>{COMPANY.state}</strong>
            </p>
          </div>
        </div>

        {/* ── Customer + Invoice Details ─────────────────── */}
        <div className="flex border-b border-gray-400">
          <div className="flex-1 p-3 border-r border-gray-400">
            <p className="font-bold text-gray-700 mb-1">
              {data.type} For:
            </p>
            <p className="font-bold text-gray-900">{data.customer.name || "—"}</p>
            <p className="text-gray-700">{data.customer.address || ""}</p>
            {data.customer.phone && (
              <p className="text-gray-700">Ph: {data.customer.phone}</p>
            )}
            {data.customer.gstin && (
              <p className="text-gray-700">GSTIN: {data.customer.gstin}</p>
            )}
          </div>
          <div className="flex-1 p-3">
            <p className="font-bold text-gray-700 mb-1">
              {data.type} Details:
            </p>
            <p>
              No: <strong>{data.number}</strong>
            </p>
            <p>
              Date: <strong>{data.date}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── Items Table ────────────────────────────────────── */}
      <table className="w-full border-collapse border border-gray-400 mb-3">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 px-2 py-2 text-left w-8">#</th>
            <th className="border border-gray-400 px-2 py-2 text-left">
              Item name
            </th>
            <th className="border border-gray-400 px-2 py-2 text-center">
              HSN/ SAC
            </th>
            <th className="border border-gray-400 px-2 py-2 text-center">
              Quantity
            </th>
            <th className="border border-gray-400 px-2 py-2 text-center">
              Unit
            </th>
            <th className="border border-gray-400 px-2 py-2 text-right">
              Price/ Unit (₹)
            </th>
            <th className="border border-gray-400 px-2 py-2 text-right">
              GST(₹)
            </th>
            <th className="border border-gray-400 px-2 py-2 text-right">
              Amount(₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {filledItems.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="border border-gray-400 px-4 py-8 text-center text-gray-400"
              >
                No items added yet
              </td>
            </tr>
          ) : (
            filledItems.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-300">
                <td className="border border-gray-400 px-2 py-2 text-center">
                  {idx + 1}
                </td>
                <td className="border border-gray-400 px-2 py-2 font-medium">
                  {item.productName}
                </td>
                <td className="border border-gray-400 px-2 py-2 text-center">
                  {item.hsn}
                </td>
                <td className="border border-gray-400 px-2 py-2 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-400 px-2 py-2 text-center">
                  {item.unit}
                </td>
                <td className="border border-gray-400 px-2 py-2 text-right">
                  ₹ {formatNumber(item.unitPrice)}
                </td>
                <td className="border border-gray-400 px-2 py-2 text-right">
                  <div>₹ {formatNumber(item.gstAmount)}</div>
                  <div className="text-xs text-gray-500">
                    ({item.gstRate}.0%)
                  </div>
                </td>
                <td className="border border-gray-400 px-2 py-2 text-right font-medium">
                  ₹ {formatNumber(item.totalAmount)}
                </td>
              </tr>
            ))
          )}
          {/* Totals row */}
          <tr className="bg-gray-50 font-bold">
            <td className="border border-gray-400 px-2 py-2"></td>
            <td className="border border-gray-400 px-2 py-2">Total</td>
            <td className="border border-gray-400 px-2 py-2"></td>
            <td className="border border-gray-400 px-2 py-2 text-center">
              {totalQty}
            </td>
            <td className="border border-gray-400 px-2 py-2"></td>
            <td className="border border-gray-400 px-2 py-2"></td>
            <td className="border border-gray-400 px-2 py-2 text-right">
              ₹ {formatNumber(summary.totalGst)}
            </td>
            <td className="border border-gray-400 px-2 py-2 text-right">
              ₹ {formatNumber(summary.grandTotal)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Tax Summary + Amount in Words ──────────────────── */}
      <div className="flex gap-0 border border-gray-400 mb-3">
        {/* Tax Summary */}
        <div className="flex-1 border-r border-gray-400">
          <p className="font-bold px-3 py-1 border-b border-gray-400 bg-gray-50">
            Tax Summary:
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="border-r border-b border-gray-400 px-2 py-1 text-left"
                  rowSpan={2}
                >
                  HSN/ SAC
                </th>
                <th
                  className="border-r border-b border-gray-400 px-2 py-1 text-right"
                  rowSpan={2}
                >
                  Taxable amount (₹)
                </th>
                <th
                  className="border-r border-b border-gray-400 px-2 py-1 text-center"
                  colSpan={2}
                >
                  CGST
                </th>
                <th
                  className="border-r border-b border-gray-400 px-2 py-1 text-center"
                  colSpan={2}
                >
                  SGST
                </th>
                <th className="border-b border-gray-400 px-2 py-1 text-right">
                  Total Tax(₹)
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border-r border-b border-gray-400 px-2 py-1 text-center">
                  Rate (%)
                </th>
                <th className="border-r border-b border-gray-400 px-2 py-1 text-right">
                  Amt (₹)
                </th>
                <th className="border-r border-b border-gray-400 px-2 py-1 text-center">
                  Rate (%)
                </th>
                <th className="border-r border-b border-gray-400 px-2 py-1 text-right">
                  Amt (₹)
                </th>
                <th className="border-b border-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {summary.taxSummary.map((row) => (
                <tr key={row.hsn} className="border-b border-gray-200">
                  <td className="border-r border-gray-400 px-2 py-1">
                    {row.hsn}
                  </td>
                  <td className="border-r border-gray-400 px-2 py-1 text-right">
                    {formatNumber(row.taxableAmount)}
                  </td>
                  <td className="border-r border-gray-400 px-2 py-1 text-center">
                    {row.cgstRate.toFixed(1)}
                  </td>
                  <td className="border-r border-gray-400 px-2 py-1 text-right">
                    {formatNumber(row.cgstAmount)}
                  </td>
                  <td className="border-r border-gray-400 px-2 py-1 text-center">
                    {row.sgstRate.toFixed(1)}
                  </td>
                  <td className="border-r border-gray-400 px-2 py-1 text-right">
                    {formatNumber(row.sgstAmount)}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {formatNumber(row.totalTax)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td className="border-r border-t border-gray-400 px-2 py-1">
                  TOTAL
                </td>
                <td className="border-r border-t border-gray-400 px-2 py-1 text-right">
                  {formatNumber(summary.totalTaxableAmount)}
                </td>
                <td className="border-r border-t border-gray-400 px-2 py-1"></td>
                <td className="border-r border-t border-gray-400 px-2 py-1 text-right">
                  {formatNumber(summary.totalCgst)}
                </td>
                <td className="border-r border-t border-gray-400 px-2 py-1"></td>
                <td className="border-r border-t border-gray-400 px-2 py-1 text-right">
                  {formatNumber(summary.totalSgst)}
                </td>
                <td className="border-t border-gray-400 px-2 py-1 text-right">
                  {formatNumber(summary.totalGst)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: Sub Total, Total, Amount in Words */}
        <div className="w-64 flex flex-col">
          <div className="flex justify-between px-3 py-2 border-b border-gray-400">
            <span className="text-gray-600">Sub Total</span>
            <span>:</span>
            <span className="font-medium">
              ₹ {formatNumber(summary.subTotal)}
            </span>
          </div>
          <div className="flex justify-between px-3 py-2 border-b border-gray-400 font-bold">
            <span>Total</span>
            <span>:</span>
            <span>₹ {formatNumber(summary.grandTotal)}</span>
          </div>
          <div className="px-3 py-2 flex-1">
            <p className="font-bold text-sm mb-1">
              {data.type} Amount In Words :
            </p>
            <p className="text-gray-700 text-xs leading-relaxed">
              {summary.amountInWords}
            </p>
          </div>
        </div>
      </div>

      {/* ── Terms & Bank Details ───────────────────────────── */}
      <div className="border border-gray-400">
        <div className="px-3 py-2 border-b border-gray-400">
          <span className="font-bold">Terms And Conditions:</span>
          <p className="text-gray-700 mt-1 whitespace-pre-line text-xs">
            {data.termsAndConditions}
          </p>
        </div>
        <div className="flex">
          <div className="flex-1 border-r border-gray-400 px-3 py-2">
            <p className="font-bold mb-2">Bank Details:</p>
            <p>
              Name: <strong>{COMPANY.bank.name}</strong>
            </p>
            <p>
              Account No.: <strong>{COMPANY.bank.accountNo}</strong>
            </p>
            <p>
              IFSC code: <strong>{COMPANY.bank.ifsc}</strong>
            </p>
            <p>
              Account Holder&apos;s Name:{" "}
              <strong>{COMPANY.bank.holderName}</strong>
            </p>
          </div>
          <div className="flex-1 px-3 py-2 flex flex-col items-center justify-center">
            <p className="font-bold mb-3">For {COMPANY.legalName}:</p>
            <div className="text-center">
              <p
                className="font-bold text-xl"
                style={{ fontFamily: "cursive" }}
              >
                {COMPANY.legalName}
              </p>
              <p className="text-xs italic text-gray-600 mt-4">
                Proprietor
              </p>
              <p className="text-xs text-gray-600">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
