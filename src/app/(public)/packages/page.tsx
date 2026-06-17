"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Phone, Zap, Shield, Sun } from "lucide-react";
import { loadStoredAdminPackages, mapAdminToPublic, type PublicPackage, loadAdminPackagesFromDB } from "@/lib/packages";

export default function PackagesPage() {
  const [packages, setPackages] = useState<PublicPackage[]>([]);

  useEffect(() => {
    loadAdminPackagesFromDB().then(adminPackages => {
      const publicPackages = adminPackages.filter((pkg) => pkg.active).map(mapAdminToPublic);
      setPackages(publicPackages);
    });
  }, []);
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-orange-950 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-full px-4 py-1.5 text-sm mb-4">
            <Sun size={14} /> Solar Packages
          </div>
          <h1 className="text-4xl font-bold mb-3">Choose Your Solar Package</h1>
          <p className="text-gray-300">Complete solar systems with installation. All prices include GST and installation charges.</p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative bg-white rounded-2xl shadow-sm border ${pkg.border} overflow-hidden ${pkg.popular ? "ring-2 ring-orange-500" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ MOST POPULAR
                </div>
              )}
              <div className="flex flex-col md:flex-row">
                {/* Left: color card */}
                <div className={`bg-gradient-to-br ${pkg.color} text-white p-8 md:w-64 flex-shrink-0 flex flex-col justify-center`}>
                  <p className="text-white/70 text-sm font-medium">{pkg.tag}</p>
                  <h2 className="text-2xl font-bold mt-1 mb-2">{pkg.name}</h2>
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                    <Zap size={14} /> {pkg.capacity} System
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{pkg.price}</p>
                    <p className="text-white/60 text-xs mt-1">onwards (incl. GST)</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 text-sm">
                    <p className="text-white/70">⚡ {pkg.units}</p>
                    <p className="text-white/70 mt-1">💰 Ideal: {pkg.idealBill}</p>
                  </div>
                </div>

                {/* Right: features */}
                <div className="flex-1 p-8">
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                    {pkg.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className={`${pkg.bg} rounded-xl p-4 mb-4`}>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield size={15} className="text-gray-600" />
                      <span className="font-medium text-gray-700">Warranty: </span>
                      <span className="text-gray-600">{pkg.warranty}</span>
                    </div>
                  </div>
                  <a
                    href="tel:9311630228"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
                  >
                    <Phone size={15} /> Call for Quote: 9311630228
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="py-8 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-gray-500 text-sm">
            * Prices are indicative and may vary based on site survey, roof type, location, and product selection. Contact us for an exact quote.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            * Government subsidies under PM Surya Ghar Yojana may reduce costs further for eligible customers.
          </p>
        </div>
      </section>
    </div>
  );
}
