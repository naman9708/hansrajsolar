import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
    num
  );
}

// ── Amount in Words (Indian numbering) ───────────────────────
const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function numToWords(n: number): string {
  if (n === 0) return "Zero";
  if (n < 0) return "Minus " + numToWords(-n);

  let words = "";

  if (Math.floor(n / 10000000) > 0) {
    words += numToWords(Math.floor(n / 10000000)) + " Crore ";
    n %= 10000000;
  }
  if (Math.floor(n / 100000) > 0) {
    words += numToWords(Math.floor(n / 100000)) + " Lakh ";
    n %= 100000;
  }
  if (Math.floor(n / 1000) > 0) {
    words += numToWords(Math.floor(n / 1000)) + " Thousand ";
    n %= 1000;
  }
  if (Math.floor(n / 100) > 0) {
    words += ones[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) {
      words += ones[n] + " ";
    } else {
      words += tens[Math.floor(n / 10)] + " ";
      if (n % 10 > 0) words += ones[n % 10] + " ";
    }
  }

  return words.trim();
}

export function amountInWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = numToWords(rupees) + " Rupees";
  if (paise > 0) {
    result += " and " + numToWords(paise) + " Paise";
  }
  return result + " only";
}

// ── Invoice / Estimate Number Generator ──────────────────────
export function generateInvoiceNumber(prefix: string, count: number): string {
  return `${prefix}-${String(count).padStart(4, "0")}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
