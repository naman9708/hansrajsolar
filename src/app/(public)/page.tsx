"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Sun, Zap, Shield, IndianRupee, Users, HeadphonesIcon,
  Leaf, TrendingDown, BadgePercent, Home, Wrench, Star,
  ChevronDown, ChevronUp, Phone, Mail, MapPin,
  Calculator, ArrowRight, CheckCircle
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────
const WHY_US = [
  { icon: Shield, title: "High Quality Products", desc: "We use only top-brand solar panels, inverters and batteries with genuine warranty." },
  { icon: Wrench, title: "Professional Installation", desc: "Expert certified engineers handle every installation with precision and care." },
  { icon: BadgePercent, title: "Genuine Warranty", desc: "Full manufacturer warranty on all products plus our service warranty." },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Competitive pricing with flexible payment options. Best value in Bihar." },
  { icon: Users, title: "Experienced Team", desc: "10+ years of solar installation experience across Vaishali, Bihar." },
  { icon: HeadphonesIcon, title: "After Sales Support", desc: "24/7 customer support and annual maintenance service available." },
];

const BENEFITS = [
  { icon: TrendingDown, title: "Reduce Electricity Bills", desc: "Cut your electricity bill by up to 90% with rooftop solar." },
  { icon: IndianRupee, title: "Long Term Savings", desc: "Save lakhs over 25 years. Solar pays for itself in 3–5 years." },
  { icon: BadgePercent, title: "Government Subsidy", desc: "Get PM Surya Ghar subsidy upto ₹78,000 on residential systems." },
  { icon: Leaf, title: "Environment Friendly", desc: "Generate clean energy. Reduce carbon footprint for future generations." },
  { icon: Home, title: "Low Maintenance", desc: "Solar panels require minimal maintenance — just occasional cleaning." },
  { icon: Star, title: "Increase Property Value", desc: "Solar installation increases your property value by 10–20%." },
];

const PACKAGES = [
  { name: "1 kW Package", capacity: "1 kW", price: "₹65,000", units: "4 units/day", bill: "₹500–1,500/mo", color: "from-blue-500 to-blue-600" },
  { name: "3 kW Package", capacity: "3 kW", price: "₹1,80,000", units: "12 units/day", bill: "₹1,500–3,000/mo", color: "from-green-500 to-green-600" },
  { name: "5 kW Package", capacity: "5 kW", price: "₹2,80,000", units: "20 units/day", bill: "₹3,000–6,000/mo", popular: true, color: "from-orange-500 to-orange-600" },
  { name: "10 kW Package", capacity: "10 kW", price: "₹5,20,000", units: "40 units/day", bill: "₹6,000–10,000/mo", color: "from-purple-500 to-purple-600" },
];

const GALLERY = [
  { title: "Residential 5kW", location: "Hajipur, Vaishali", capacity: "5 kW", img: "🏠" },
  { title: "Commercial 15kW", location: "Muzaffarpur", capacity: "15 kW", img: "🏢" },
  { title: "Rooftop 3kW", location: "Vaishali, Bihar", capacity: "3 kW", img: "🏘️" },
  { title: "Industrial 25kW", location: "Patna, Bihar", capacity: "25 kW", img: "🏭" },
];

const FAQS = [
  { q: "How much does a 5kW solar system cost?", a: "A complete 5kW solar system costs approximately ₹2,80,000 including installation, structure, and all electrical components. Government subsidy may reduce this further." },
  { q: "How long does installation take?", a: "Typical residential installation (1–10kW) is completed within 2–3 days. Larger commercial projects may take 5–7 days." },
  { q: "What warranty do you provide?", a: "Solar panels come with 25-year performance warranty. Inverters have 5–10 year warranty. We provide 1-year installation warranty on our workmanship." },
  { q: "Can I get government subsidy?", a: "Yes! Under PM Surya Ghar Muft Bijli Yojana, you can get subsidy up to ₹78,000 for systems up to 3kW. We help with all subsidy paperwork." },
  { q: "Do solar panels work in cloudy weather?", a: "Yes, solar panels generate electricity even on cloudy days — just at reduced capacity (20–50%). They do not require direct sunlight to function." },
  { q: "How much can I save monthly?", a: "A 5kW system typically saves ₹3,000–5,000 per month on electricity bills. Annual savings of ₹36,000–60,000 are common." },
];

const TESTIMONIALS = [
  { name: "Rajesh Kumar", location: "Hajipur", stars: 5, text: "Excellent service! My 5kW system has been running perfectly for 2 years. Bill reduced from ₹4,500 to ₹300." },
  { name: "Sunita Devi", location: "Vaishali", stars: 5, text: "Very professional team. Installation was clean and quick. Highly recommend Hansraj Solar!" },
  { name: "Manoj Singh", location: "Muzaffarpur", stars: 5, text: "Best solar company in Bihar. Quality products, fair pricing, and great after-sales support." },
];

// ── Calculator logic ─────────────────────────────────────────
function calcSolar(bill: number, perUnit: number, connection: "ongrid" | "hybrid") {
  // Estimate monthly units from the bill and per-unit charge
  const pricePerUnit = perUnit > 0 ? perUnit : 8; // fallback to ₹8/unit if invalid
  const units = bill / pricePerUnit;

  // Production assumption: 1 kW generates ~120 units/month
  const rawKw = units / 120;
  const capacity = Math.ceil(rawKw * 10) / 10; // round up to nearest 0.1 kW

  // Cost assumption per kW
  const costPerKw = 58000;
  const cost = capacity * costPerKw;

  // Savings factor depending on connection type
  const savingsFactor = connection === "hybrid" ? 0.97 : 0.87; // hybrid up to 97%, ongrid up to 87%
  const monthlySavings = bill * savingsFactor;
  const annualSavings = monthlySavings * 12;

  const payback = annualSavings > 0 ? cost / annualSavings : Infinity;

  return {
    capacity: capacity.toFixed(1),
    cost: Math.round(cost),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    payback: isFinite(payback) ? payback.toFixed(1) : "—",
  };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

// ── Component ────────────────────────────────────────────────
export default function HomePage() {
  const [bill, setBill] = useState("");
  const [perUnit, setPerUnit] = useState<number>(8);
  const [connection, setConnection] = useState<'ongrid' | 'hybrid'>('ongrid');
  const [result, setResult] = useState<ReturnType<typeof calcSolar> | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", address: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleCalc() {
    const b = Number(bill);
    if (b > 0) setResult(calcSolar(b, perUnit, connection));
  }

  function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setContactForm({ name: "", phone: "", address: "", message: "" });
  }

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-orange-950 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-orange-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-yellow-400 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-full px-4 py-1.5 text-sm mb-6">
            <Sun size={14} /> Bihar's Trusted Solar Company
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Power Your Home With<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Clean Solar Energy
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Professional solar installation across Vaishali, Bihar. Reduce your electricity bill by 90% with our premium solar systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:9311630228" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 justify-center">
              <Phone size={18} /> Call Now: 9311630228
            </a>
            <Link href="/packages" className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-2 justify-center">
              View Packages <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-16">
            {[["500+", "Installations"], ["25yr", "Panel Warranty"], ["90%", "Bill Reduction"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-bold text-orange-400">{v}</p>
                <p className="text-gray-400 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY INTRO ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">About Us</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hansraj Solar — Hansraj Vastralay</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Based in Kedar Chowk, Madarpur, Vaishali, Bihar — Hansraj Solar is one of the most trusted solar installation companies in the region. We specialize in residential and commercial solar systems using top-brand products from Adani, Deye, Eastman, and more.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              With over 500 successful installations across Bihar, our experienced team delivers quality solar solutions that reduce electricity bills and contribute to a greener future.
            </p>
            <div className="flex flex-col gap-2">
              {["Licensed & GSTIN Registered", "Authorized dealer of top solar brands", "PM Surya Ghar subsidy assistance"].map(p => (
                <div key={p} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" /> {p}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "500+", l: "Happy Customers", c: "bg-orange-50 border-orange-200" },
              { v: "10+", l: "Years Experience", c: "bg-yellow-50 border-yellow-200" },
              { v: "25yr", l: "Panel Warranty", c: "bg-green-50 border-green-200" },
              { v: "24/7", l: "Support Available", c: "bg-blue-50 border-blue-200" },
            ].map(({ v, l, c }) => (
              <div key={l} className={`border rounded-xl p-5 text-center ${c}`}>
                <p className="text-3xl font-bold text-gray-800">{v}</p>
                <p className="text-sm text-gray-600 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">Why Us</p>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Hansraj Solar?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange-200 font-semibold text-sm uppercase tracking-wide mb-2">Solar Benefits</p>
            <h2 className="text-3xl font-bold">Benefits of Going Solar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
                <Icon size={28} className="text-yellow-300 mb-3" />
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-orange-100 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLAR SAVINGS CALCULATOR ─────────────────────────── */}
      <section className="py-16 bg-white" id="calculator">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">Free Tool</p>
            <h2 className="text-3xl font-bold text-gray-900">Solar Savings Calculator</h2>
            <p className="text-gray-600 mt-2">Enter your monthly electricity bill to see how much you can save</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label className="block text-gray-400 text-sm mb-2">Monthly Electricity Bill (₹)</label>
                <input
                  type="number"
                  value={bill}
                  onChange={e => setBill(e.target.value)}
                  placeholder="e.g. 3000"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
                />
              </div>
              <div className="w-40">
                <label className="block text-gray-400 text-sm mb-2">₹ / unit</label>
                <input
                  type="number"
                  value={perUnit}
                  onChange={e => setPerUnit(Number(e.target.value))}
                  placeholder="e.g. 8"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
                />
              </div>
              <div className="w-40">
                <label className="block text-gray-400 text-sm mb-2">Connection</label>
                <select value={connection} onChange={e => setConnection(e.target.value as any)} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none">
                  <option value="ongrid">On-grid</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <button
                onClick={() => handleCalc()}
                className="sm:self-end bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Calculator size={18} /> Calculate
              </button>
            </div>

            {result && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse-once">
                {[
                  { label: "Recommended Capacity", value: `${result.capacity} kW`, color: "text-blue-400" },
                  { label: "Estimated Cost", value: `₹${fmt(result.cost)}`, color: "text-orange-400" },
                  { label: "Monthly Savings", value: `₹${fmt(result.monthlySavings)}`, color: "text-green-400" },
                  { label: "Annual Savings", value: `₹${fmt(result.annualSavings)}`, color: "text-yellow-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-4 text-center">
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-gray-400 text-xs mt-1">{label}</p>
                  </div>
                ))}
                <div className="col-span-2 md:col-span-4 bg-orange-500/20 border border-orange-500/40 rounded-xl p-4 text-center mt-2">
                  <p className="text-orange-300 text-sm">⚡ Your system will pay for itself in approximately <span className="font-bold text-white text-lg">{result.payback} years</span> — then it's free electricity for 20+ more years!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PACKAGE SHOWCASE ─────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">Our Packages</p>
            <h2 className="text-3xl font-bold text-gray-900">Solar Packages for Every Need</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {PACKAGES.map(({ name, capacity, price, units, bill: b, color, popular }) => (
              <div key={name} className={`relative rounded-2xl overflow-hidden shadow-lg ${popular ? "ring-2 ring-orange-500 scale-105" : ""}`}>
                {popular && (
                  <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-xs text-center py-1 font-semibold">
                    ⭐ Most Popular
                  </div>
                )}
                <div className={`bg-gradient-to-br ${color} p-6 text-white ${popular ? "pt-8" : ""}`}>
                  <p className="font-bold text-lg">{name}</p>
                  <p className="text-white/80 text-sm">Capacity: {capacity}</p>
                  <p className="text-3xl font-bold mt-3">{price}</p>
                  <p className="text-white/70 text-xs">onwards (incl. GST)</p>
                </div>
                <div className="bg-white p-4 space-y-2">
                  <p className="text-sm text-gray-700">⚡ {units} generation</p>
                  <p className="text-sm text-gray-700">💰 Ideal for {b} bill</p>
                  <p className="text-sm text-green-600 font-medium">✓ 25yr panel warranty</p>
                  <p className="text-sm text-green-600 font-medium">✓ Complete installation</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/packages" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              View All Packages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ──────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">Our Work</p>
            <h2 className="text-3xl font-bold text-gray-900">Recent Installations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {GALLERY.map(({ title, location, capacity, img }) => (
              <div key={title} className="group rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 h-40 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {img}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-800 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{location}</p>
                  <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-600 rounded-full px-2 py-0.5">{capacity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/gallery" className="inline-flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 rounded-full font-semibold transition-colors">
              View Full Gallery <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">Testimonials</p>
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, location, stars, text }) => (
              <div key={name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex mb-3">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{text}"</p>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">FAQ</p>
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-gray-800 text-sm pr-4">{q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-orange-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ──────────────────────────────────── */}
      <section className="py-16 bg-gray-50" id="contact">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">Get In Touch</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us Today</h2>
            <p className="text-gray-600 mb-6">Ready to switch to solar? Get a free quote or consultation from our expert team.</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Address</p>
                  <p className="text-gray-600 text-sm">Kedar Chowk, Madarpur, Vaishali, Bihar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Phone / WhatsApp</p>
                  <a href="tel:9311630228" className="text-orange-500 text-sm hover:underline">9311630228</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Email</p>
                  <a href="mailto:hansrajsolar@gmail.com" className="text-orange-500 text-sm hover:underline">hansrajsolar@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-800">Message Sent!</p>
                <p className="text-gray-600 text-sm mt-1">We will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your Name *</label>
                  <input required value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                  <input required value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="9XXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                  <input value={contactForm.address} onChange={e => setContactForm(p => ({ ...p, address: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Village, District, Bihar" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
                  <textarea value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                    rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" placeholder="Tell us about your requirements..." />
                </div>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
