"use client";
import { useState } from "react";
import { Save, CheckCircle, Building2, CreditCard, FileText, Phone } from "lucide-react";
import { COMPANY } from "@/lib/company";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [company, setCompany] = useState({
    brand: COMPANY.brand,
    legalName: COMPANY.legalName,
    address: COMPANY.address,
    phone: COMPANY.phone,
    email: COMPANY.email,
    gstin: COMPANY.gstin,
    state: COMPANY.state,
    whatsapp: COMPANY.phone,
  });
  const [bank, setBank] = useState({
    name: COMPANY.bank.name,
    accountNo: COMPANY.bank.accountNo,
    ifsc: COMPANY.bank.ifsc,
    holderName: COMPANY.bank.holderName,
  });
  const [terms, setTerms] = useState(COMPANY.termsAndConditions);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";
  const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center"><Icon size={16} className="text-orange-500" /></div>
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Company info used in all invoices, estimates and proposals</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-5">
        <Section icon={Building2} title="Company Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { l: "Brand / Website Name", k: "brand" },
              { l: "Legal / Billing Name", k: "legalName" },
              { l: "Phone Number", k: "phone" },
              { l: "WhatsApp Number", k: "whatsapp" },
              { l: "Email Address", k: "email" },
              { l: "GSTIN", k: "gstin" },
              { l: "State Code", k: "state" },
            ].map(({ l, k }) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(company as never)[k]} onChange={e => setCompany(p => ({ ...p, [k]: e.target.value }))} className={inputCls} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
              <input value={company.address} onChange={e => setCompany(p => ({ ...p, address: e.target.value }))} className={inputCls} />
            </div>
          </div>
        </Section>

        <Section icon={CreditCard} title="Bank Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { l: "Bank Name & Branch", k: "name" },
              { l: "Account Number", k: "accountNo" },
              { l: "IFSC Code", k: "ifsc" },
              { l: "Account Holder Name", k: "holderName" },
            ].map(({ l, k }) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                <input value={(bank as never)[k]} onChange={e => setBank(p => ({ ...p, [k]: e.target.value }))} className={inputCls} />
              </div>
            ))}
          </div>
        </Section>

        <Section icon={FileText} title="Default Terms & Conditions">
          <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          <p className="text-xs text-gray-400 mt-2">These terms appear at the bottom of every invoice and estimate.</p>
        </Section>

        <Section icon={Phone} title="Contact Links">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp Link</label>
              <input readOnly value={`https://wa.me/91${company.whatsapp}`} className={`${inputCls} bg-gray-50 text-gray-500`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Call Link</label>
              <input readOnly value={`tel:${company.phone}`} className={`${inputCls} bg-gray-50 text-gray-500`} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Links are auto-generated from phone/WhatsApp numbers above.</p>
        </Section>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-bounce">
          <CheckCircle size={16} /> Settings saved successfully!
        </div>
      )}
    </div>
  );
}
