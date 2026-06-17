// ============================================================
// HANSRAJ SOLAR – CENTRALIZED PRODUCT MASTER
// Admin selects product; HSN/SAC, GST, Unit auto-populated
// ============================================================

export type ProductCategory =
  | "Solar Panels"
  | "Inverters"
  | "Batteries"
  | "GI Structures"
  | "Solar BOS"
  | "Installation Services";

export interface Product {
  id: string;
  name: string;
  brand: string | null; // null = no specific brand (GI Structure, BOS, Installation)
  category: ProductCategory;
  hsn: string;
  gstRate: number; // in % e.g. 5, 12, 18
  unit: string;
  defaultPrice?: number;
}

export const PRODUCTS: Product[] = [
  // ── Solar Panels ──────────────────────────────────────────
  {
    id: "panel-adani-620",
    name: "Adani Bifacial Topcon 620wp DCR Panel",
    brand: "Adani",
    category: "Solar Panels",
    hsn: "85414300",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 19000,
  },
  {
    id: "panel-adani-540",
    name: "Adani Mono PERC 540wp DCR Panel",
    brand: "Adani",
    category: "Solar Panels",
    hsn: "85414300",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 16000,
  },
  {
    id: "panel-tata-400",
    name: "Tata Solar 400wp Monocrystalline Panel",
    brand: "Tata Solar",
    category: "Solar Panels",
    hsn: "85414300",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 14000,
  },
  {
    id: "panel-waaree-545",
    name: "Waaree 545wp Bifacial Panel",
    brand: "Waaree",
    category: "Solar Panels",
    hsn: "85414300",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 15500,
  },
  {
    id: "panel-longi-550",
    name: "Longi Hi-MO 5 550wp Panel",
    brand: "Longi",
    category: "Solar Panels",
    hsn: "85414300",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 17000,
  },
  {
    id: "panel-vikram-500",
    name: "Vikram Solar 500wp Mono PERC Panel",
    brand: "Vikram Solar",
    category: "Solar Panels",
    hsn: "85414300",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 15000,
  },

  // ── Inverters ─────────────────────────────────────────────
  {
    id: "inv-deye-15kw",
    name: "Deye 15 KW 3 Phase Hybrid Inverter",
    brand: "Deye",
    category: "Inverters",
    hsn: "8501",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 350000,
  },
  {
    id: "inv-deye-10kw",
    name: "Deye 10 KW 3 Phase Hybrid Inverter",
    brand: "Deye",
    category: "Inverters",
    hsn: "8501",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 280000,
  },
  {
    id: "inv-solis-5kw",
    name: "Solis 5 KW Single Phase Hybrid Inverter",
    brand: "Solis",
    category: "Inverters",
    hsn: "8501",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 75000,
  },
  {
    id: "inv-growatt-5kw",
    name: "Growatt 5 KW Single Phase On-Grid Inverter",
    brand: "Growatt",
    category: "Inverters",
    hsn: "8501",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 55000,
  },
  {
    id: "inv-luminous-3kw",
    name: "Luminous 3 KW NXI 3300 PCU",
    brand: "Luminous",
    category: "Inverters",
    hsn: "8501",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 45000,
  },
  {
    id: "inv-microtek-5kw",
    name: "Microtek 5 KW MPPT Solar Inverter",
    brand: "Microtek",
    category: "Inverters",
    hsn: "8501",
    gstRate: 5,
    unit: "Pcs",
    defaultPrice: 65000,
  },

  // ── Batteries ─────────────────────────────────────────────
  {
    id: "bat-eastman-100ah",
    name: "Eastman 51.2V 100AH Lithium Battery",
    brand: "Eastman",
    category: "Batteries",
    hsn: "8507",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 90000,
  },
  {
    id: "bat-eastman-200ah",
    name: "Eastman 51.2V 200AH Lithium Battery",
    brand: "Eastman",
    category: "Batteries",
    hsn: "8507",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 175000,
  },
  {
    id: "bat-luminous-150ah",
    name: "Luminous 150AH Tall Tubular Battery",
    brand: "Luminous",
    category: "Batteries",
    hsn: "8507",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 18000,
  },
  {
    id: "bat-okaya-150ah",
    name: "Okaya 150AH C20 Solar Battery",
    brand: "Okaya",
    category: "Batteries",
    hsn: "8507",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 16500,
  },
  {
    id: "bat-amaron-100ah",
    name: "Amaron 100AH Tall Tubular Battery",
    brand: "Amaron",
    category: "Batteries",
    hsn: "8507",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 14000,
  },

  // ── GI Structures ─────────────────────────────────────────
  {
    id: "gi-struct-1kw",
    name: "GI Mounting Structure - 1 KW",
    brand: null,
    category: "GI Structures",
    hsn: "7308",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 8000,
  },
  {
    id: "gi-struct-3kw",
    name: "GI Mounting Structure - 3 KW",
    brand: null,
    category: "GI Structures",
    hsn: "7308",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 24000,
  },
  {
    id: "gi-struct-5kw",
    name: "GI Mounting Structure - 5 KW",
    brand: null,
    category: "GI Structures",
    hsn: "7308",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 40000,
  },
  {
    id: "gi-struct-10kw",
    name: "GI Mounting Structure - 10 KW",
    brand: null,
    category: "GI Structures",
    hsn: "7308",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 80000,
  },
  {
    id: "gi-struct-15kw",
    name: "GI Mounting Structure - 15 KW",
    brand: null,
    category: "GI Structures",
    hsn: "7308",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 120000,
  },

  // ── Solar BOS ─────────────────────────────────────────────
  {
    id: "bos-1kw",
    name: "Solar BOS Item - 1 KW",
    brand: null,
    category: "Solar BOS",
    hsn: "8544",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 5000,
  },
  {
    id: "bos-3kw",
    name: "Solar BOS Item - 3 KW",
    brand: null,
    category: "Solar BOS",
    hsn: "8544",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 15000,
  },
  {
    id: "bos-5kw",
    name: "Solar BOS Item - 5 KW",
    brand: null,
    category: "Solar BOS",
    hsn: "8544",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 25000,
  },
  {
    id: "bos-10kw",
    name: "Solar BOS Item - 10 KW",
    brand: null,
    category: "Solar BOS",
    hsn: "8544",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 50000,
  },
  {
    id: "bos-15kw",
    name: "Solar BOS Item - 15 KW",
    brand: null,
    category: "Solar BOS",
    hsn: "8544",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 75000,
  },

  // ── Installation Services ─────────────────────────────────
  {
    id: "inst-1kw",
    name: "Installation & Commissioning Service - 1 KW",
    brand: null,
    category: "Installation Services",
    hsn: "9954",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 5000,
  },
  {
    id: "inst-3kw",
    name: "Installation & Commissioning Service - 3 KW",
    brand: null,
    category: "Installation Services",
    hsn: "9954",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 15000,
  },
  {
    id: "inst-5kw",
    name: "Installation & Commissioning Service - 5 KW",
    brand: null,
    category: "Installation Services",
    hsn: "9954",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 25000,
  },
  {
    id: "inst-10kw",
    name: "Installation & Commissioning Service - 10 KW",
    brand: null,
    category: "Installation Services",
    hsn: "9954",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 50000,
  },
  {
    id: "inst-15kw",
    name: "Installation & Commissioning Service - 15 KW",
    brand: null,
    category: "Installation Services",
    hsn: "9954",
    gstRate: 18,
    unit: "Nos",
    defaultPrice: 75000,
  },
];

export const CATEGORIES: ProductCategory[] = [
  "Solar Panels",
  "Inverters",
  "Batteries",
  "GI Structures",
  "Solar BOS",
  "Installation Services",
];

// Categories that have brand sub-selection
export const BRANDED_CATEGORIES: ProductCategory[] = [
  "Solar Panels",
  "Inverters",
  "Batteries",
];

// Categories with no brand (just pick the product directly)
export const UNBRANDED_CATEGORIES: ProductCategory[] = [
  "GI Structures",
  "Solar BOS",
  "Installation Services",
];

export function getBrandsByCategory(category: ProductCategory): string[] {
  const brands = PRODUCTS.filter(
    (p) => p.category === category && p.brand !== null
  ).map((p) => p.brand as string);
  return [...new Set(brands)].sort();
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsByCategoryAndBrand(
  category: ProductCategory,
  brand: string
): Product[] {
  return PRODUCTS.filter((p) => p.category === category && p.brand === brand);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
