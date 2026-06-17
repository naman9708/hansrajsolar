"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Package, Image, Settings, Sun, BoxSelect, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/invoices", label: "Invoice / Estimate", icon: FileText },
  { href: "/admin/products", label: "Product Master", icon: BoxSelect },
  { href: "/admin/packages", label: "Package Builder", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // client-side fallback: if cookie/localStorage missing, redirect to home
    try {
      const has = typeof window !== 'undefined' && (document.cookie.indexOf('hansraj_admin=1') !== -1 || localStorage.getItem('hansraj-admin') === '1');
      if (!has) router.push('/');
    } catch (e) {
      router.push('/');
    }
  }, [router]);

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-gray-900 text-white flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
              <Sun size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Hansraj Solar</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link key={href} href={href}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                isActive(href, exact) ? "bg-orange-500 text-white font-semibold" : "text-gray-400 hover:text-white hover:bg-gray-800")}>
              <Icon size={16} />{label}
            </Link>
          ))}
          <div className="pt-3 mt-3 border-t border-gray-800">
            <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
              <ExternalLink size={16} />View Website
            </Link>
            <button onClick={async () => {
              try { await fetch('/api/logout', { method: 'POST' }); } catch (e) {}
              try { localStorage.removeItem('hansraj-admin'); } catch (e) {}
              router.push('/');
            }} className="w-full text-left mt-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-white hover:bg-gray-800 transition-all">Logout</button>
          </div>
        </nav>
        <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-600">Hansraj Vastralay © 2026</div>
      </aside>
      <main className="flex-1 ml-60 min-h-screen overflow-auto">{children}</main>
    </div>
  );
}
