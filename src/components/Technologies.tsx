"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Database, Flame, Code, Layers, Share2 } from "lucide-react";

interface Tech {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

const TECHS: Tech[] = [
  {
    id: "react",
    name: "React",
    category: "INTERACTION LIBRARY",
    description: "Component architectures, dynamic state systems, and responsive user experiences.",
    icon: <Code className="w-4 h-4 text-[#6c00d9]" />
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "APPLICATION PLATFORM",
    description: "Static Site Generation, Server Components, API structures, and search optimizations.",
    icon: <Layers className="w-4 h-4 text-[#6c00d9]" />
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "SERVER PROCESSOR",
    description: "Event-driven asynchronous services and microservices designed for high performance.",
    icon: <Terminal className="w-4 h-4 text-[#6c00d9]" />
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "DATA STORAGE",
    description: "Scalable schema-less data lakes, aggregation structures, and document structures.",
    icon: <Database className="w-4 h-4 text-[#6c00d9]" />
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "SERVERLESS UTILITY",
    description: "Real-time document syncing, authentication protocols, and serverless hosting.",
    icon: <Flame className="w-4 h-4 text-[#6c00d9]" />
  },
  {
    id: "python",
    name: "Python",
    category: "ANALYTICS CORE",
    description: "Large Language Models, semantic search pipelines, and custom automation scripts.",
    icon: <Cpu className="w-4 h-4 text-[#6c00d9]" />
  },
  {
    id: "flutter",
    name: "Flutter",
    category: "CROSS-PLATFORM ENGINE",
    description: "Compiling high-fidelity native iOS and Android apps directly from one clean codebase.",
    icon: <Share2 className="w-4 h-4 text-[#6c00d9]" />
  }
];

export default function Technologies() {
  return (
    <section id="technology" className="relative py-32 px-6 md:px-12 bg-transparent z-10">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-start mb-20 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6c00d9] mb-3 block">
            INTEGRATED STACK // TOOLS
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-premium text-slate-800 max-w-2xl leading-tight">
            High-performance frameworks <span className="text-slate-400">for scalable builds.</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#6c00d9]/20 mt-8" />
        </div>

        {/* Floating tech cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {TECHS.map((tech, idx) => (
            <motion.div
              key={tech.id}
              initial={{ y: 0 }}
              animate={{
                y: [0, -8, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                delay: idx * 0.45,
                ease: "easeInOut"
              }}
              className="bg-white/35 border border-white/60 p-6 rounded-xl flex flex-col justify-between h-48 hover:border-[#6c00d9]/30 transition-all duration-300 group cursor-pointer shadow-md backdrop-blur-md"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[8px] font-semibold text-slate-500 tracking-wider">
                    {tech.category}
                  </span>
                  <div className="p-2 border border-slate-200/50 bg-white/50 rounded-lg group-hover:rotate-6 transition-transform">
                    {tech.icon}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-bold text-slate-800 text-base mb-1.5 group-hover:text-[#6c00d9] transition-colors">
                  {tech.name}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3 font-medium">
                  {tech.description}
                </p>
              </div>

              {/* Minimalist footer tag */}
              <div className="border-t border-slate-200/50 pt-2 mt-2 flex justify-between items-center text-[8px] font-semibold text-slate-400">
                <span>MODULE // 0{idx + 1}</span>
                <span>VERIFIED</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
