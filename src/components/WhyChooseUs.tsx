"use client";

import { motion } from "framer-motion";
import { Zap, Sparkles, Search, Compass, ShieldCheck } from "lucide-react";

interface StatItem {
  id: number;
  title: string;
  description: string;
  metric: string;
  subMetric: string;
  icon: React.ReactNode;
}

const STATS: StatItem[] = [
  {
    id: 1,
    title: "Fast Delivery",
    description: "Rapid agile development pipeline delivering high-performance features in days, not months.",
    metric: "98%",
    subMetric: "ON-TIME RATIO",
    icon: <Zap className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 2,
    title: "Modern Design",
    description: "Visually premium, minimalist glass-panels, fluid animations, and custom visual assets.",
    metric: "Awwwards",
    subMetric: "DESIGN COMPLIANT",
    icon: <Sparkles className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 3,
    title: "SEO Optimized",
    description: "Server-side page loading and metadata layout designed to capture high rankings in index registers.",
    metric: "100",
    subMetric: "SEO METRICS",
    icon: <Search className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 4,
    title: "Mobile First",
    description: "Responsive layouts built to deliver pixel-perfect interactions on any touch canvas.",
    metric: "60fps",
    subMetric: "RENDER SPEED",
    icon: <Compass className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 5,
    title: "Secure Architecture",
    description: "Serverless endpoints, secure cloud data storage, and strict cryptographic communications.",
    metric: "A+",
    subMetric: "SECURITY RATING",
    icon: <ShieldCheck className="w-5 h-5 text-[#6c00d9]" />,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-32 px-6 md:px-12 bg-transparent z-10">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-start mb-20 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6c00d9] mb-3 block">
            OUR PRINCIPLES // PHILOSOPHY
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-premium text-slate-800 max-w-2xl leading-tight">
            Why leading brands <span className="text-slate-400">choose ChrisBuilds.</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#6c00d9]/20 mt-8" />
        </div>

        {/* Stripe-like feature columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white/35 border border-white/60 p-6 rounded-xl flex flex-col justify-between h-[280px] hover:border-[#6c00d9]/30 transition-all duration-300 group shadow-md backdrop-blur-md"
            >
              <div>
                {/* Icon wrapper */}
                <div className="p-3 border border-slate-200/50 bg-white/50 rounded-xl w-fit mb-6">
                  {stat.icon}
                </div>

                <h3 className="font-bold text-slate-800 text-sm tracking-wide mb-2">
                  {stat.title}
                </h3>

                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  {stat.description}
                </p>
              </div>

              {/* Metric label at bottom */}
              <div className="border-t border-slate-200/50 pt-3 mt-4 flex justify-between items-end">
                <div>
                  <span className="text-[7px] font-semibold text-slate-500 uppercase tracking-widest block mb-0.5">
                    {stat.subMetric}
                  </span>
                  <span className="text-sm font-black tracking-premium text-slate-800 leading-none block">
                    {stat.metric}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
