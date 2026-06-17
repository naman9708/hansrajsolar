import type { ProductCategory } from "@/lib/products";

export interface InvoiceLineItem {
  id: string;
  category: ProductCategory | "";
  brand: string; // "" for unbranded categories
  productId: string;
  productName: string;
  hsn: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  gstRate: number;
  // Calculated
  taxableAmount: number; // qty * unitPrice
  gstAmount: number;
  totalAmount: number;
}

export interface TaxSummaryRow {
  hsn: string;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalTax: number;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone?: string;
  gstin?: string;
}

export interface InvoiceData {
  type: "Estimate" | "Invoice";
  number: string;
  date: string;
  customer: CustomerInfo;
  items: InvoiceLineItem[];
  termsAndConditions: string;
}

export interface InvoiceSummary {
  subTotal: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalGst: number;
  grandTotal: number;
  amountInWords: string;
  taxSummary: TaxSummaryRow[];
}
