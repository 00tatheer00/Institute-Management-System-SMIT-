"use client";

import { motion } from "framer-motion";

const alumniAvatars = [
  {
    name: "Hamza Farooq",
    role: "Full Stack Engineer",
    company: "10Pearls",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    offsetY: "translate-y-2",
  },
  {
    name: "Bilal Ahmed",
    role: "Mobile App Lead",
    company: "Systems Ltd",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    offsetY: "-translate-y-3",
  },
  {
    name: "Zainab Tariq",
    role: "AI Scientist",
    company: "Afiniti",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    offsetY: "translate-y-4",
  },
  {
    name: "Usman Ghani",
    role: "Cloud Architect",
    company: "Contour Software",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    offsetY: "-translate-y-1",
  },
  {
    name: "Fatima Noor",
    role: "UI/UX Director",
    company: "Careem",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    offsetY: "translate-y-3",
  },
  {
    name: "Saad Sheikh",
    role: "Top Rated Freelancer",
    company: "Upwork ($120k+)",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    offsetY: "-translate-y-4",
  },
  {
    name: "Arham Khan",
    role: "Cyber Defense Analyst",
    company: "Habib Bank",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    offsetY: "translate-y-1",
  },
  {
    name: "Maryam Bibi",
    role: "Python Data Engineer",
    company: "Jazz Telco",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    offsetY: "-translate-y-2",
  },
  {
    name: "Talha Zubair",
    role: "DevOps Engineer",
    company: "VentureDive",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    offsetY: "translate-y-3",
  },
  {
    name: "Hassan Raza",
    role: "Frontend Specialist",
    company: "Folio3",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    offsetY: "-translate-y-3",
  },
];

export function AlumniMosaic() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-r from-[#0284c7] via-[#059669] to-[#16a34a] text-white">
      {/* Background dot pattern */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="container-custom relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Floating Mosaic Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4 items-center justify-center">
          {alumniAvatars.map((alumnus, idx) => (
            <motion.div
              key={alumnus.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.15, y: -6, zIndex: 30 }}
              className={`relative group cursor-pointer ${alumnus.offsetY}`}
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-white/30 bg-white/10 shadow-lg backdrop-blur-xs transition-all duration-300 group-hover:border-white group-hover:shadow-2xl">
                <img
                  src={alumnus.image}
                  alt={alumnus.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-950 text-white text-[11px] shadow-2xl border border-white/20 pointer-events-none z-50">
                <p className="font-bold">{alumnus.name}</p>
                <p className="text-[10px] text-emerald-300">{alumnus.role}</p>
                <p className="text-[9px] text-white/60">{alumnus.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 pt-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            We don&apos;t just teach IT<br />
            <span className="text-emerald-200 underline decoration-white/40 underline-offset-8">
              We manufacture success stories
            </span>
          </h2>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed">
            From zero background to remote global careers, our graduates are powering Pakistan&apos;s digital revolution across multinational software houses and freelance marketplaces.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
