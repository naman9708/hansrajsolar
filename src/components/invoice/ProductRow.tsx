"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  CATEGORIES,
  BRANDED_CATEGORIES,
  getBrandsByCategory,
  getProductsByCategoryAndBrand,
  getProductsByCategory,
  getProductById,
  type ProductCategory,
} from "@/lib/products";
import type { InvoiceLineItem } from "@/types/invoice";
import { formatNumber } from "@/lib/utils";
import { calcLineItem } from "@/lib/invoice-calc";

interface ProductRowProps {
  index: number;
  item: InvoiceLineItem;
  onChange: (updated: InvoiceLineItem) => void;
  onRemove: () => void;
}

export default function ProductRow({
  index,
  item,
  onChange,
  onRemove,
}: ProductRowProps) {
  const [brands, setBrands] = useState<string[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof getProductsByCategory>>([]);
  const isBranded = item.category
    ? BRANDED_CATEGORIES.includes(item.category as ProductCategory)
    : false;

  // When category changes → refresh brands/products list
  useEffect(() => {
    if (!item.category) return;
    const cat = item.category as ProductCategory;
    if (BRANDED_CATEGORIES.includes(cat)) {
      setBrands(getBrandsByCategory(cat));
      setProducts([]);
    } else {
      setBrands([]);
      setProducts(getProductsByCategory(cat));
    }
  }, [item.category]);

  // When brand changes → refresh product list
  useEffect(() => {
    if (!item.category || !item.brand) return;
    const cat = item.category as ProductCategory;
    if (BRANDED_CATEGORIES.includes(cat)) {
      setProducts(getProductsByCategoryAndBrand(cat, item.brand));
    }
  }, [item.brand, item.category]);

  function handleCategoryChange(cat: string) {
    onChange(
      calcLineItem({
        ...item,
        category: cat as ProductCategory,
        brand: "",
        productId: "",
        productName: "",
        hsn: "",
        unit: "",
        gstRate: 0,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }) as InvoiceLineItem
    );
  }

  function handleBrandChange(brand: string) {
    onChange(
      calcLineItem({
        ...item,
        brand,
        productId: "",
        productName: "",
        hsn: "",
        unit: "",
        gstRate: 0,
      }) as InvoiceLineItem
    );
  }

  function handleProductChange(productId: string) {
    const prod = getProductById(productId);
    if (!prod) return;
    onChange(
      calcLineItem({
        ...item,
        productId: prod.id,
        productName: prod.name,
        hsn: prod.hsn,
        unit: prod.unit,
        gstRate: prod.gstRate,
        unitPrice: item.unitPrice || prod.defaultPrice || 0,
      }) as InvoiceLineItem
    );
  }

  function handleQtyChange(qty: number) {
    onChange(calcLineItem({ ...item, quantity: qty }) as InvoiceLineItem);
  }

  function handlePriceChange(price: number) {
    onChange(calcLineItem({ ...item, unitPrice: price }) as InvoiceLineItem);
  }

  const selectCls =
    "w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <tr className="border-b border-gray-200 hover:bg-orange-50/30 transition-colors">
      {/* # */}
      <td className="px-3 py-3 text-center text-sm font-medium text-gray-500 w-8">
        {index + 1}
      </td>

      {/* Item / Product Selection */}
      <td className="px-3 py-3 min-w-[320px]">
        <div className="space-y-1.5">
          {/* Category */}
          <select
            value={item.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={selectCls}
          >
            <option value="">— Select Category —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Brand (only for branded categories) */}
          {isBranded && item.category && (
            <select
              value={item.brand}
              onChange={(e) => handleBrandChange(e.target.value)}
              disabled={!item.category}
              className={selectCls}
            >
              <option value="">— Select Brand —</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}

          {/* Product */}
          {item.category && (
            <select
              value={item.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              disabled={isBranded && !item.brand}
              className={selectCls}
            >
              <option value="">— Select Product —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {/* Show selected product name as confirmation */}
          {item.productName && (
            <p className="text-xs text-green-700 font-medium truncate">
              ✓ {item.productName}
            </p>
          )}
        </div>
      </td>

      {/* HSN/SAC – auto-filled, readonly */}
      <td className="px-3 py-3 text-center w-28">
        <input
          readOnly
          value={item.hsn}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-center bg-gray-50 text-gray-600 cursor-not-allowed"
          placeholder="Auto"
        />
      </td>

      {/* Quantity – admin fills */}
      <td className="px-3 py-3 w-20">
        <input
          type="number"
          min={0}
          value={item.quantity || ""}
          onChange={(e) => handleQtyChange(Number(e.target.value))}
          placeholder="0"
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </td>

      {/* Unit – auto-filled */}
      <td className="px-3 py-3 w-16">
        <input
          readOnly
          value={item.unit}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-center bg-gray-50 text-gray-600 cursor-not-allowed"
          placeholder="Auto"
        />
      </td>

      {/* Unit Price – admin fills */}
      <td className="px-3 py-3 w-28">
        <input
          type="number"
          min={0}
          value={item.unitPrice || ""}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          placeholder="0.00"
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </td>

      {/* GST – auto */}
      <td className="px-3 py-3 w-32 text-right">
        {item.productId ? (
          <div className="text-sm">
            <div className="font-medium text-gray-800">
              ₹{formatNumber(item.gstAmount || 0)}
            </div>
            <div className="text-xs text-gray-500">({item.gstRate}%)</div>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Amount – auto */}
      <td className="px-3 py-3 w-32 text-right">
        {item.productId ? (
          <span className="font-semibold text-gray-800 text-sm">
            ₹{formatNumber(item.totalAmount || 0)}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Remove */}
      <td className="px-3 py-3 w-10 text-center">
        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-600 transition-colors"
          title="Remove row"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}
