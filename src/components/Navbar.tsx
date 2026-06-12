"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Showcase", href: "#showcase" },
  { label: "Demos", href: "#apps-games" },
  { label: "Services", href: "#services" },
  { label: "Stack", href: "#technology" },
  { label: "Inquire", href: "#contact" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 md:px-12 ${
          scrolled ? "mt-2 max-w-5xl mx-auto" : "mt-0 w-full"
        }`}
      >
        <div
          className={`w-full transition-all duration-500 rounded-2xl flex items-center justify-between py-3 px-8 ${
            scrolled
              ? "liquid-glass bg-white/40 border-white/60 shadow-[0_8px_30px_rgba(31,38,135,0.04)]"
              : "bg-transparent border-b border-white/10"
          }`}
        >
          {/* Logo Brand */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <span className="font-sans font-black tracking-[0.2em] text-slate-800 text-sm">
              CHRIS<span className="text-[#6c00d9]">BUILDS</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs font-mono uppercase tracking-[0.18em] text-slate-600 hover:text-slate-900 transition-colors duration-300 relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#6c00d9] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="btn-vibrant px-6 py-2 rounded-full text-xs uppercase tracking-[0.15em] flex items-center gap-1.5 cursor-pointer font-sans font-bold border border-slate-200"
            >
              Start Project <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border border-slate-200 rounded-full bg-white/50 hover:bg-white/80 text-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#cbe3fc]/98 backdrop-blur-xl pt-28 px-10 md:hidden flex flex-col justify-between pb-16"
          >
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#6c00d9]/[0.01] rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col gap-6 font-sans text-2xl tracking-premium text-left mt-8">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-slate-700 hover:text-slate-900 transition-colors py-3 border-b border-slate-200 flex items-center justify-between"
                >
                  <span className="font-light">{link.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
                className="btn-vibrant w-full text-center py-4 rounded-full text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-pointer font-sans font-bold"
              >
                Start Project <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
