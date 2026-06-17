import type { InvoiceLineItem, TaxSummaryRow, InvoiceSummary } from "@/types/invoice";
import { amountInWords } from "./utils";

export function calcLineItem(item: Partial<InvoiceLineItem>): Partial<InvoiceLineItem> {
  const qty = item.quantity || 0;
  const price = item.unitPrice || 0;
  const gstRate = item.gstRate || 0;

  const taxableAmount = qty * price;
  const gstAmount = (taxableAmount * gstRate) / 100;
  const totalAmount = taxableAmount + gstAmount;

  return { ...item, taxableAmount, gstAmount, totalAmount };
}

export function calcInvoiceSummary(items: InvoiceLineItem[]): InvoiceSummary {
  // Group by HSN for tax summary
  const hsnMap: Record<string, TaxSummaryRow> = {};

  let totalTaxableAmount = 0;
  let totalGst = 0;

  for (const item of items) {
    if (!item.productId) continue;
    const taxable = item.taxableAmount || 0;
    const gstRate = item.gstRate || 0;
    const halfRate = gstRate / 2;
    const cgst = (taxable * halfRate) / 100;
    const sgst = (taxable * halfRate) / 100;
    const totalTax = cgst + sgst;

    totalTaxableAmount += taxable;
    totalGst += totalTax;

    if (hsnMap[item.hsn]) {
      hsnMap[item.hsn].taxableAmount += taxable;
      hsnMap[item.hsn].cgstAmount += cgst;
      hsnMap[item.hsn].sgstAmount += sgst;
      hsnMap[item.hsn].totalTax += totalTax;
    } else {
      hsnMap[item.hsn] = {
        hsn: item.hsn,
        taxableAmount: taxable,
        cgstRate: halfRate,
        cgstAmount: cgst,
        sgstRate: halfRate,
        sgstAmount: sgst,
        totalTax,
      };
    }
  }

  const grandTotal = totalTaxableAmount + totalGst;

  return {
    subTotal: grandTotal,
    totalTaxableAmount,
    totalCgst: totalGst / 2,
    totalSgst: totalGst / 2,
    totalGst,
    grandTotal,
    amountInWords: amountInWords(grandTotal),
    taxSummary: Object.values(hsnMap).sort((a, b) =>
      a.hsn.localeCompare(b.hsn)
    ),
  };
}
