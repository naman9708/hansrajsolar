import { formatNumber } from "@/lib/utils";

export const PACKAGES_STORAGE_KEY = "hansraj-solar-packages";

export interface PkgProduct {
  rowId: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseCost: number;
}

export interface SolarPackage {
  id: string;
  name: string;
  capacity: string;
  type: "1kW" | "3kW" | "5kW" | "10kW" | "Custom";
  description: string;
  warranty: string;
  products: PkgProduct[];
  installationCost: number;
  transportationCost: number;
  otherCharges: number;
  profitMarginPct: number;
  active: boolean;
  popular: boolean;
}

export interface PublicPackage {
  name: string;
  capacity: string;
  tag: string;
  price: string;
  units: string;
  idealBill: string;
  color: string;
  bg: string;
  border: string;
  features: string[];
  warranty: string;
  popular?: boolean;
}

export function calcPackageCosting(pkg: SolarPackage) {
  const materialCost = pkg.products.reduce((sum, product) => sum + product.purchaseCost * product.quantity, 0);
  const totalCost = materialCost + pkg.installationCost + pkg.transportationCost + pkg.otherCharges;
  const profitAmount = (totalCost * pkg.profitMarginPct) / 100;
  const sellingPrice = totalCost + profitAmount;
  return { materialCost, totalCost, profitAmount, sellingPrice };
}

export function loadStoredAdminPackages(): SolarPackage[] {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_PACKAGES;
  }

  try {
    const stored = window.localStorage.getItem(PACKAGES_STORAGE_KEY);
    if (!stored) return DEFAULT_ADMIN_PACKAGES;
    const parsed = JSON.parse(stored) as SolarPackage[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ADMIN_PACKAGES;
  } catch {
    return DEFAULT_ADMIN_PACKAGES;
  }
}

export function saveAdminPackages(packages: SolarPackage[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
  } catch {
    // ignore storage failures
  }
}

export function mapAdminToPublic(pkg: SolarPackage): PublicPackage {
  const cost = calcPackageCosting(pkg);
  const featureList = pkg.products
    .filter((product) => product.productName)
    .map((product) => product.productName)
    .slice(0, 8);

  return {
    name: pkg.name,
    capacity: pkg.capacity,
    tag: pkg.type === "Custom" ? "Custom" : `${pkg.type} Package`,
    price: pkg.active ? `₹${formatNumber(cost.sellingPrice)}` : "Not Available",
    units: `${pkg.capacity} system`,
    idealBill: pkg.description || `Solar package for ${pkg.capacity}`,
    color: pkg.popular ? "from-orange-500 to-orange-600" : "from-blue-500 to-blue-600",
    bg: pkg.popular ? "bg-orange-50" : "bg-blue-50",
    border: pkg.popular ? "border-orange-200" : "border-blue-200",
    features: featureList.length > 0 ? featureList : [pkg.description || "Custom solar package"],
    warranty: pkg.warranty,
    popular: pkg.popular,
  };
}

// Async functions for database persistence (API)
export async function loadAdminPackagesFromDB(): Promise<SolarPackage[]> {
  try {
    const res = await fetch('/api/packages', { method: 'GET' });
    if (!res.ok) return DEFAULT_ADMIN_PACKAGES;
    const data = await res.json();
    return Array.isArray(data.packages) && data.packages.length > 0 ? data.packages : DEFAULT_ADMIN_PACKAGES;
  } catch {
    // fallback to localStorage on network error
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(PACKAGES_STORAGE_KEY);
        if (!stored) return DEFAULT_ADMIN_PACKAGES;
        const parsed = JSON.parse(stored) as SolarPackage[];
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ADMIN_PACKAGES;
      } catch {
        return DEFAULT_ADMIN_PACKAGES;
      }
    }
    return DEFAULT_ADMIN_PACKAGES;
  }
}

export async function saveAdminPackagesToDB(packages: SolarPackage[]) {
  try {
    // save to API
    const res = await fetch('/api/packages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packages }) });
    if (!res.ok) throw new Error('API error');
  } catch {
    // fallback: save to localStorage on API error
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
      } catch (e) {}
    }
  }
}

export const DEFAULT_PUBLIC_PACKAGES: PublicPackage[] = [
  {
    name: "1 kW Solar Package",
    capacity: "1 kW",
    tag: "Starter",
    price: "₹65,000",
    units: "4 units/day",
    idealBill: "₹500 – ₹1,500/month",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    features: [
      "1 kW Solar Panel (DCR Grade)",
      "1 kW Solar Inverter",
      "GI Mounting Structure",
      "Solar BOS & Wiring",
      "Professional Installation",
      "Net Metering Assistance",
    ],
    warranty: "25yr Panel | 5yr Inverter | 1yr Installation",
  },
  {
    name: "3 kW Solar Package",
    capacity: "3 kW",
    tag: "Popular Home",
    price: "₹1,80,000",
    units: "12 units/day",
    idealBill: "₹1,500 – ₹3,000/month",
    color: "from-green-500 to-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    features: [
      "3 kW Solar Panels (DCR Grade)",
      "3 kW Hybrid Inverter",
      "Battery Backup Option",
      "GI Mounting Structure",
      "Solar BOS & Wiring",
      "Professional Installation",
      "Net Metering Assistance",
    ],
    warranty: "25yr Panel | 5yr Inverter | 1yr Installation",
  },
  {
    name: "5 kW Solar Package",
    capacity: "5 kW",
    tag: "Best Value",
    price: "₹2,80,000",
    units: "20 units/day",
    idealBill: "₹3,000 – ₹6,000/month",
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    popular: true,
    features: [
      "5 kW Solar Panels (DCR Grade)",
      "5 kW Hybrid Inverter",
      "Lithium Battery Backup",
      "Heavy-Duty GI Structure",
      "Complete Solar BOS Kit",
      "Professional Installation",
      "Net Metering Assistance",
      "Annual Maintenance Support",
    ],
    warranty: "25yr Panel | 5yr Inverter | 1yr Installation",
  },
  {
    name: "10 kW Solar Package",
    capacity: "10 kW",
    tag: "Large Home / Small Business",
    price: "₹5,20,000",
    units: "40 units/day",
    idealBill: "₹6,000 – ₹10,000/month",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    features: [
      "10 kW Solar Panels (DCR Grade)",
      "10 kW Three Phase Inverter",
      "High-Capacity Battery System",
      "Industrial GI Structure",
      "Complete Solar BOS Kit",
      "Professional Installation",
      "DISCOM Net Metering Setup",
      "Priority After-Sales Support",
    ],
    warranty: "25yr Panel | 5yr Inverter | 1yr Installation",
  },
  {
    name: "Custom Solar Package",
    capacity: "Custom",
    tag: "Commercial / Industrial",
    price: "Get Quote",
    units: "As per requirement",
    idealBill: "₹10,000+/month",
    color: "from-gray-700 to-gray-900",
    bg: "bg-gray-50",
    border: "border-gray-200",
    features: [
      "Custom Capacity Design",
      "Commercial Grade Equipment",
      "Industrial GI Structure",
      "Complete BOS & Electrical",
      "Professional Team Installation",
      "DISCOM & Subsidy Support",
      "Dedicated Account Manager",
      "Priority Maintenance Contract",
    ],
    warranty: "25yr Panel | 10yr Inverter | 2yr Installation",
  },
];

export const DEFAULT_ADMIN_PACKAGES: SolarPackage[] = [
  {
    id: "pkg-5kw",
    name: "5 kW Solar Package",
    capacity: "5 kW",
    type: "5kW",
    description: "Complete 5kW solar system ideal for homes with ₹3,000–6,000/month electricity bills.",
    warranty: "25 years Panel | 5 years Inverter | 1 year Installation",
    products: [
      { rowId: "r1", productId: "panel-adani-620", productName: "Adani Bifacial Topcon 620wp DCR Panel", category: "Solar Panels", quantity: 8, unit: "Pcs", purchaseCost: 15000 },
      { rowId: "r2", productId: "inv-deye-10kw", productName: "Deye 10 KW 3 Phase Hybrid Inverter", category: "Inverters", quantity: 1, unit: "Pcs", purchaseCost: 230000 },
      { rowId: "r3", productId: "bat-eastman-100ah", productName: "Eastman 51.2V 100AH Lithium Battery", category: "Batteries", quantity: 1, unit: "Nos", purchaseCost: 72000 },
      { rowId: "r4", productId: "gi-struct-5kw", productName: "GI Mounting Structure - 5 KW", category: "GI Structures", quantity: 1, unit: "Nos", purchaseCost: 32000 },
      { rowId: "r5", productId: "bos-5kw", productName: "Solar BOS Item - 5 KW", category: "Solar BOS", quantity: 1, unit: "Nos", purchaseCost: 18000 },
      { rowId: "r6", productId: "inst-5kw", productName: "Installation & Commissioning Service - 5 KW", category: "Installation Services", quantity: 1, unit: "Nos", purchaseCost: 0 },
    ],
    installationCost: 12000,
    transportationCost: 3000,
    otherCharges: 2000,
    profitMarginPct: 20,
    active: true,
    popular: true,
  },
];
