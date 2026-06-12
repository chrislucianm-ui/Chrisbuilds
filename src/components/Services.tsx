"use client";

import { motion, Variants } from "framer-motion";
import { Laptop, Smartphone, Palette, BrainCircuit, Bot, ShieldCheck } from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SERVICES: Service[] = [
  {
    id: 1,
    title: "Website Development",
    description: "Next-gen, ultra-fast static and dynamic web experiences powered by Next.js and WebGL for maximum user retention.",
    icon: <Laptop className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "High-fidelity iOS and Android native and cross-platform solutions built for high-performance and fluid motion.",
    icon: <Smartphone className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 3,
    title: "UI/UX Design",
    description: "Stunning modern visual interface systems, interactive prototypes, and premium branding designed to captivate.",
    icon: <Palette className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 4,
    title: "AI Integrations",
    description: "Empower your systems with custom LLMs, smart routing agents, semantic search structures, and machine learning pipelines.",
    icon: <BrainCircuit className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 5,
    title: "Business Automation",
    description: "Scale operation bandwidth by mapping repetitive tasks to secure, serverless cloud scripts, databases, and automated pipelines.",
    icon: <Bot className="w-5 h-5 text-[#6c00d9]" />,
  },
  {
    id: 6,
    title: "Maintenance & Support",
    description: "Around-the-clock telemetry monitoring, dependency patches, speed optimization, and secure infrastructure auditing.",
    icon: <ShieldCheck className="w-5 h-5 text-[#6c00d9]" />,
  },
];

export default function Services() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section id="services" className="relative py-32 px-6 md:px-12 bg-transparent z-10">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-start mb-20 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6c00d9] mb-3 block">
            OUR CAPABILITIES // SERVICES
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-premium text-slate-800 max-w-2xl leading-tight">
            Comprehensive services <span className="text-slate-400">for ambitious brands.</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#6c00d9]/20 mt-8" />
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="bg-white/35 border border-white/60 p-8 rounded-2xl flex flex-col gap-6 relative group overflow-hidden shadow-md backdrop-blur-md transition-all duration-300"
            >
              {/* Icon & Title */}
              <div className="flex items-center gap-4">
                <div className="p-3 border border-slate-200/50 bg-white/50 rounded-xl group-hover:scale-105 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-bold text-sm md:text-base tracking-wide text-slate-800">
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {service.description}
              </p>

              <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400 border-t border-slate-200/50 pt-4 mt-2">
                <span>SERVICE EXPLICIT // 0{service.id}</span>
                <span className="text-slate-500 font-bold">ACTIVE</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 bg-white/40 border border-white/60 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-md backdrop-blur-md relative z-10"
        >
          <h4 className="text-slate-800 font-bold text-lg mb-2">Looking for a custom quote?</h4>
          <p className="text-xs text-slate-600 font-medium mb-5">Every digital product has unique requirements. Reach out directly to discuss your objectives and receive a tailored pricing proposal.</p>
          <a
            href="#contact"
            className="inline-block px-6 py-2.5 bg-[#6c00d9] hover:bg-[#5600b3] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-colors cursor-pointer"
          >
            Contact for Price Details
          </a>
        </motion.div>
      </div>
    </section>
  );
}
