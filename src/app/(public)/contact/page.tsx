"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle, Sun } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", phone: "", address: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-900 to-orange-950 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-full px-4 py-1.5 text-sm mb-4">
            <Sun size={14} /> Contact Us
          </div>
          <h1 className="text-4xl font-bold mb-3">Get In Touch</h1>
          <p className="text-gray-300">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            <div className="space-y-5 mb-8">
              {[
                { icon: MapPin, label: "Our Address", val: "Kedar Chowk, Madarpur, Vaishali, Bihar" },
                { icon: Phone, label: "Phone / WhatsApp", val: "9311630228" },
                { icon: Mail, label: "Email", val: "hansrajsolar@gmail.com" },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{label}</p>
                    <p className="text-gray-600 text-sm">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <a href="tel:9311630228" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
                <Phone size={14} /> Call Now
              </a>
              <a href="https://wa.me/919311630228" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

            <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-5">
              <p className="font-semibold text-gray-800 mb-1 text-sm">Business Hours</p>
              <p className="text-gray-600 text-sm">Monday – Saturday: 9:00 AM – 7:00 PM</p>
              <p className="text-gray-600 text-sm">Sunday: 10:00 AM – 4:00 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <p className="font-bold text-gray-800 text-lg">Thank You!</p>
                <p className="text-gray-600 text-sm mt-1">Your message has been received. We will contact you very soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                  <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="9XXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Address / Location</label>
                  <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Village, Block, District" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Message *</label>
                  <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={4} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    placeholder="Tell us about your solar requirement, monthly bill, roof area, etc." />
                </div>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
                  Send Message 📤
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
