import { Sun, MapPin, Zap } from "lucide-react";

const PROJECTS = [
  { title: "Residential Rooftop", location: "Hajipur, Vaishali", capacity: "5 kW", desc: "Complete 5kW on-grid system with net metering for a residential home.", emoji: "🏠", year: "2025" },
  { title: "Commercial Building", location: "Muzaffarpur, Bihar", capacity: "15 kW", desc: "Three-phase 15kW system for a commercial establishment with high daytime load.", emoji: "🏢", year: "2025" },
  { title: "Village Home Install", location: "Madarpur, Vaishali", capacity: "3 kW", desc: "3kW hybrid system with battery backup ensuring 24/7 power supply.", emoji: "🏘️", year: "2024" },
  { title: "Industrial Rooftop", location: "Patna, Bihar", capacity: "25 kW", desc: "Industrial-grade 25kW installation with advanced monitoring system.", emoji: "🏭", year: "2024" },
  { title: "School Solar Plant", location: "Vaishali, Bihar", capacity: "10 kW", desc: "10kW solar plant for a school reducing operating costs and teaching green energy.", emoji: "🏫", year: "2024" },
  { title: "Apartment Complex", location: "Hajipur, Bihar", capacity: "20 kW", desc: "Common area solar system for apartment complex common electricity needs.", emoji: "🏙️", year: "2023" },
];

export default function GalleryPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-orange-950 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-full px-4 py-1.5 text-sm mb-4">
            <Sun size={14} /> Project Gallery
          </div>
          <h1 className="text-4xl font-bold mb-3">Our Installations</h1>
          <p className="text-gray-300">Real solar installations we have completed across Bihar. Quality you can see.</p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-orange-500 text-white py-5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[["500+", "Projects Completed"], ["25 MW+", "Solar Installed"], ["Bihar", "State Coverage"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-2xl font-bold">{v}</p>
              <p className="text-orange-200 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map(({ title, location, capacity, desc, emoji, year }) => (
            <div key={title} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="relative bg-gradient-to-br from-orange-50 to-yellow-50 h-48 flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform">{emoji}</span>
                <span className="absolute top-3 right-3 text-xs bg-white/80 text-gray-600 rounded-full px-2 py-1 border">{year}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{title}</h3>
                  <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-600 rounded-full px-2 py-0.5 flex-shrink-0 ml-2">
                    <Zap size={10} /> {capacity}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                  <MapPin size={11} /> {location}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready for Your Solar Installation?</h2>
          <p className="text-gray-600 mb-6 text-sm">Join hundreds of happy customers who have switched to solar with Hansraj Solar.</p>
          <a href="tel:9311630228" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            📞 Call Now: 9311630228
          </a>
        </div>
      </section>
    </div>
  );
}
