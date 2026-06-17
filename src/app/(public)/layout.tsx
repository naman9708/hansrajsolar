"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
              <Sun size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">Hansraj Solar</p>
              <p className="text-xs text-orange-500">Hansraj Vastralay</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <a
            href="tel:9311630228"
            className="hidden md:flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Phone size={14} /> 9311630228
          </a>

          <button onClick={() => setShowAdminLogin(true)} className="hidden md:inline-flex items-center gap-2 ml-3 border border-gray-200 px-3 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-50">Admin Login</button>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  pathname === href ? "text-orange-500" : "text-gray-700"
                }`}
              >
                {label}
              </Link>
            ))}
            <a href="tel:9311630228" className="flex items-center gap-2 text-orange-500 py-2 text-sm font-medium">
              <Phone size={14} /> 9311630228
            </a>
            <button onClick={() => { setShowAdminLogin(true); setMenuOpen(false); }} className="w-full text-left py-2 text-sm font-medium text-gray-700">Admin Login</button>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sun size={20} className="text-orange-400" />
              <span className="font-bold text-lg">Hansraj Solar</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional solar installation company serving Bihar with quality products and expert service.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-3 text-orange-400">Quick Links</p>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="block text-gray-400 text-sm hover:text-white mb-1">{label}</Link>
            ))}
          </div>
          <div>
            <p className="font-semibold mb-3 text-orange-400">Contact Us</p>
            <p className="text-gray-400 text-sm mb-1">📍 Kedar Chowk, Madarpur, Vaishali, Bihar</p>
            <p className="text-gray-400 text-sm mb-1">📞 9311630228</p>
            <p className="text-gray-400 text-sm mb-1">✉️ hansrajsolar@gmail.com</p>
            <p className="text-gray-400 text-sm">GSTIN: 10CFLPK7732R1ZX</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 text-center text-gray-500 text-xs">
          © 2026 Hansraj Vastralay. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp + Call buttons */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        <a
          href="https://wa.me/919311630228"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-colors"
          title="WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.541 4.063 1.487 5.776L0 24l6.386-1.676A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.367l-.36-.214-3.724.977.994-3.634-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
        </a>
        <a
          href="tel:9311630228"
          className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-lg transition-colors"
          title="Call"
        >
          <Phone size={20} className="text-white" />
        </a>
      </div>
      {showAdminLogin && <AdminLoginModal open={showAdminLogin} onClose={() => setShowAdminLogin(false)} />}
    </div>
  );
}

// Admin login modal handled client-side — simple credential check
function AdminLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: pass }) });
      if (r.ok) {
        try { localStorage.setItem('hansraj-admin', '1'); } catch (e) {}
        router.push('/admin');
        onClose();
      } else {
        setError('Invalid credentials');
      }
    } catch (e) {
      setError('Network error');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="font-semibold text-lg mb-3">Admin Login</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-orange-500 text-white">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
