"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, PhoneCall, Mail, Check, ShieldCheck } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("webdev");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setError(null);
    console.log("[Inquiry Form] Submitting project inquiry data:", { name, email, phone, service, message });

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, phone, service, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("[Inquiry Form] Form successfully submitted and logged:", result);
        setSuccess(true);
      } else {
        const errorMsg = result.error || "Failed to submit inquiry. Please verify parameters and try again.";
        console.error("[Inquiry Form] Form submission rejected by server:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("[Inquiry Form] Connection/network error during submit fetch:", err);
      setError("Network connection error. Please check your connectivity and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setService("webdev");
    setMessage("");
    setSuccess(false);
    setError(null);
  };

  return (
    <section id="contact" className="relative py-32 px-6 md:px-12 bg-transparent z-10">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-start mb-20 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6c00d9] mb-3 block">
            GET IN TOUCH // COLLABORATIONS
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-premium text-slate-800 max-w-2xl leading-tight">
            Let's design something <span className="text-slate-400">extraordinary.</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#6c00d9]/20 mt-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Quick Info Sidebar */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white/35 border border-white/60 p-8 rounded-2xl shadow-md backdrop-blur-md flex-1 flex flex-col justify-between gap-6 relative">
              <div>
                <span className="text-[9px] font-semibold text-slate-500 tracking-widest block uppercase mb-6">Specifications</span>
                <div className="flex flex-col gap-4 text-xs text-slate-700">
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-400 font-semibold">EMAIL:</span>
                    <span className="font-bold">chrisbuilds.dev@gmail.com</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-400 font-semibold">PRICING STRUCTURE:</span>
                    <span className="font-bold">Contact for Details</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-400 font-semibold">RESPONSE LATENCY:</span>
                    <span className="font-bold">&lt; 1 Business Day</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-400 font-semibold">OPERATIONAL DOCK:</span>
                    <span className="font-bold">Global Remote</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 border border-slate-200/50 p-4 rounded-xl text-[10px] text-slate-500 flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>All conversations remain encrypted and confidential.</span>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="bg-white/35 border border-white/60 p-6 rounded-2xl shadow-md backdrop-blur-md flex flex-col justify-between gap-4">
              <span className="text-[9px] font-semibold text-slate-500 tracking-widest block uppercase">Direct Channels</span>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/918738882912?text=Hello%20ChrisBuilds,%20I%20have%20an%20idea%20for%20a%20project..."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 border border-slate-200 hover:border-slate-300 bg-white/80 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-[#6c00d9]" /> Message on WhatsApp
                </a>

                <a
                  href="mailto:chrisbuilds.dev@gmail.com?subject=Project%20Inquiry%20-%20ChrisBuilds"
                  className="w-full py-3.5 border border-slate-200 hover:border-slate-300 bg-white/80 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Mail className="w-4 h-4 text-[#6c00d9]" /> Send Direct Email
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-span-1 lg:col-span-8 bg-white/35 border border-white/60 rounded-2xl p-8 md:p-10 flex flex-col justify-center relative overflow-hidden min-h-[420px] shadow-md backdrop-blur-md">
            <AnimatePresence mode="wait">
              {success ? (
                /* Success Card */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center flex flex-col items-center justify-center gap-4 py-8"
                >
                  <div className="relative w-14 h-14 rounded-full border border-slate-300 flex items-center justify-center bg-slate-100 text-[#6c00d9] shadow-sm">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg tracking-wide">
                    MESSAGE DELIVERED
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-medium">
                    Thank you. We have received your inquiry. A creative partner from our studio will contact you shortly to schedule an initial design call.
                  </p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-[#6c00d9] hover:bg-[#5600b3] text-white text-xs uppercase tracking-widest mt-4 cursor-pointer rounded-full shadow-sm transition-colors font-bold"
                  >
                    Submit New Inquiry
                  </button>
                </motion.div>
              ) : isSubmitting ? (
                /* Submission loading */
                <motion.div
                  key="submitting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-12"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin" />
                  <h3 className="text-xs text-slate-600 uppercase tracking-widest font-bold">Transmitting data...</h3>
                </motion.div>
              ) : (
                /* Form fields */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-200/50 pb-4">
                    <span className="font-bold text-sm text-slate-800">
                      INQUIRE SESSION
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">STATUS: ONLINE</span>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl text-xs font-semibold text-left flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-b border-slate-200/60 focus:border-[#6c00d9] rounded-none py-2 text-sm text-slate-800 focus:outline-none transition-colors placeholder-slate-400 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-b border-slate-200/60 focus:border-[#6c00d9] rounded-none py-2 text-sm text-slate-800 focus:outline-none transition-colors placeholder-slate-400 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="Your Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-transparent border-b border-slate-200/60 focus:border-[#6c00d9] rounded-none py-2 text-sm text-slate-800 focus:outline-none transition-colors placeholder-slate-400 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Project Scope</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="bg-white border-b border-slate-200/60 focus:border-[#6c00d9] rounded-none py-2 text-sm text-slate-800 focus:outline-none transition-colors cursor-pointer font-medium"
                      >
                        <option value="webdev">Website Development</option>
                        <option value="appdev">Mobile App Development</option>
                        <option value="uiux">UI/UX Design Systems</option>
                        <option value="ai">AI Integrations</option>
                        <option value="automation">Workflow Automation</option>
                        <option value="support">Ongoing Studio Support</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Project Details</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us about your project objectives..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-transparent border-b border-slate-200/60 focus:border-[#6c00d9] rounded-none py-2 text-sm text-slate-800 focus:outline-none transition-colors resize-none placeholder-slate-400 font-medium"
                    />
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold mt-1.5">
                      <span>* All inquiries receive a free initial strategy call.</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#6c00d9] hover:bg-[#5600b3] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Inquiry
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
