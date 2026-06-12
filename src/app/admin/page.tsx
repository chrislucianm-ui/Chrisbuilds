"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Download, LogOut, Trash2, CheckCircle2, 
  Mail, Phone, Eye, User, Clock, Lock, ShieldAlert, 
  DollarSign, Sun, Moon, RefreshCw, AlertCircle, MessageSquare, Check, X
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget?: string;
  service: string;
  message: string;
  status: "unread" | "read" | "contacted";
  timestamp: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard states
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fetch inquiries when authenticated
  useEffect(() => {
    if (isAuthenticated === true) {
      fetchInquiries();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          return;
        }
      }
      setIsAuthenticated(false);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || "Invalid login credentials.");
      }
    } catch (err) {
      setLoginError("Connection error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setInquiries([]);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "unread" | "read" | "contacted") => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        setInquiries(prev => 
          prev.map(inq => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteInquiry = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiries?id=${deleteTargetId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq.id !== deleteTargetId));
        if (selectedInquiry && selectedInquiry.id === deleteTargetId) {
          setSelectedInquiry(null);
        }
        setDeleteTargetId(null);
      }
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ["Inquiry ID", "Date", "Name", "Email", "Phone", "Project Type", "Message", "Status"];
    const rows = inquiries.map(item => [
      item.id,
      new Date(item.timestamp).toLocaleString(),
      item.name,
      item.email,
      item.phone || "N/A",
      item.service || "webdev",
      (item.message || "").replace(/\n/g, " "),
      item.status || "unread"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `chrisbuilds_inquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search inquiries
  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || (item.status || "unread") === statusFilter;
    const matchesService = serviceFilter === "all" || item.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Count stats
  const totalCount = inquiries.length;
  const unreadCount = inquiries.filter(i => (i.status || "unread") === "unread").length;
  const contactedCount = inquiries.filter(i => (i.status || "unread") === "contacted").length;

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-purple-500 animate-spin" />
        <span>VERIFYING SECURE SESSION GATEWAY...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      theme === "dark" 
        ? "bg-slate-950 text-slate-100" 
        : "bg-slate-50 text-slate-800"
    }`}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-20 ${
          theme === "dark" ? "bg-purple-600/30" : "bg-purple-300/30"
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-10 ${
          theme === "dark" ? "bg-[#00a0c2]/30" : "bg-[#00a0c2]/20"
        }`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            /* -----------------------------------------------------------------
               LOGIN VIEW
               ----------------------------------------------------------------- */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="min-h-[80vh] flex items-center justify-center"
            >
              <div className={`w-full max-w-md p-8 rounded-3xl border shadow-xl backdrop-blur-lg ${
                theme === "dark"
                  ? "bg-slate-900/60 border-slate-800/80 shadow-slate-950/50"
                  : "bg-white/70 border-slate-200 shadow-slate-200/50"
              }`}>
                <div className="flex flex-col items-center mb-8">
                  <div className={`p-4 rounded-2xl border mb-4 ${
                    theme === "dark" ? "bg-slate-800/50 border-slate-700/50 text-purple-400" : "bg-purple-50 border-purple-100 text-purple-600"
                  }`}>
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h1 className="text-xl font-black tracking-wider uppercase">
                    CHRIS<span className="text-[#6c00d9]">BUILDS</span> GATE
                  </h1>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Admin Authorization Required</span>
                </div>

                {loginError && (
                  <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Username</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Admin account identifier"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none border font-medium ${
                          theme === "dark"
                            ? "bg-slate-950/60 border-slate-800 focus:border-[#6c00d9] text-white"
                            : "bg-slate-50 border-slate-200 focus:border-[#6c00d9] text-slate-800"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none border font-medium ${
                          theme === "dark"
                            ? "bg-slate-950/60 border-slate-800 focus:border-[#6c00d9] text-white"
                            : "bg-slate-50 border-slate-200 focus:border-[#6c00d9] text-slate-800"
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full mt-2 py-3.5 bg-[#6c00d9] hover:bg-[#5600b3] disabled:bg-[#6c00d9]/60 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authorizing...
                      </>
                    ) : (
                      "Establish Session"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* -----------------------------------------------------------------
               DASHBOARD VIEW
               ----------------------------------------------------------------- */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-8"
            >
              {/* Header Navbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 border-slate-200/20">
                <div className="text-left">
                  <h1 className="text-2xl font-black uppercase tracking-wider">
                    CHRIS<span className="text-[#6c00d9]">BUILDS</span> PANEL
                  </h1>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mt-0.5">Administrative Inquiries Console</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Theme Toggle */}
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className={`p-2.5 rounded-xl border cursor-pointer hover:scale-105 transition-all ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-white border-slate-200 text-slate-600"
                    }`}
                    title="Toggle Theme"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>

                  {/* Refresh Button */}
                  <button
                    onClick={fetchInquiries}
                    disabled={isLoading}
                    className={`p-2.5 rounded-xl border cursor-pointer hover:scale-105 transition-all flex items-center justify-center ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                    }`}
                    title="Refresh Feed"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  </button>

                  {/* Export Button */}
                  <button
                    onClick={handleExportCSV}
                    disabled={inquiries.length === 0}
                    className={`p-2.5 rounded-xl border cursor-pointer hover:scale-105 transition-all text-xs font-semibold flex items-center gap-1.5 ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer hover:scale-105 transition-all flex items-center justify-center"
                    title="Purge Administrative Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Stat 1 */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                  theme === "dark" ? "bg-slate-900/40 border-slate-800/60" : "bg-white border-slate-200"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Submissions</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black">{totalCount}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">records cached</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden ${
                  theme === "dark" ? "bg-slate-900/40 border-slate-800/60" : "bg-white border-slate-200"
                }`}>
                  {unreadCount > 0 && (
                    <div className="absolute top-4 right-4 flex items-center justify-center w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Unread / Pending</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#6c00d9]">{unreadCount}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">awaiting dispatch</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className={`p-6 rounded-2xl border shadow-sm ${
                  theme === "dark" ? "bg-slate-900/40 border-slate-800/60" : "bg-white border-slate-200"
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Contacted Clients</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-500">{contactedCount}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">session completed</span>
                  </div>
                </div>
              </div>

              {/* Filters & Control Toolbar */}
              <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between ${
                theme === "dark" ? "bg-slate-900/30 border-slate-800/50" : "bg-slate-100/50 border-slate-200"
              }`}>
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, scope..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl focus:outline-none border ${
                      theme === "dark"
                        ? "bg-slate-950/60 border-slate-800 focus:border-[#6c00d9] text-white"
                        : "bg-white border-slate-200 focus:border-[#6c00d9] text-slate-800"
                    }`}
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">Filter Status:</span>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-3 py-2 text-xs rounded-xl focus:outline-none border cursor-pointer font-medium ${
                      theme === "dark" ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <option value="all">All Statuses</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="contacted">Contacted</option>
                  </select>

                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className={`px-3 py-2 text-xs rounded-xl focus:outline-none border cursor-pointer font-medium ${
                      theme === "dark" ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <option value="all">All Scopes</option>
                    <option value="webdev">Webdev</option>
                    <option value="appdev">Appdev</option>
                    <option value="uiux">UI/UX</option>
                    <option value="ai">AI System</option>
                    <option value="automation">Automation</option>
                    <option value="support">Studio Support</option>
                  </select>
                </div>
              </div>

              {/* Inquiry List Content Feed */}
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#6c00d9]" />
                  <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Loading database records...</span>
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className={`py-20 text-center rounded-2xl border border-dashed ${
                  theme === "dark" ? "bg-slate-900/10 border-slate-800" : "bg-slate-50/50 border-slate-200"
                }`}>
                  <p className="text-slate-400 text-xs font-mono tracking-wider uppercase mb-1">No inquiry logs matching criteria</p>
                  <span className="text-[10px] text-slate-500">Wait for client submissions or adjust query settings.</span>
                </div>
              ) : (
                <div className={`overflow-hidden border rounded-2xl shadow-sm ${
                  theme === "dark" ? "bg-slate-900/20 border-slate-800/80" : "bg-white border-slate-200"
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-[9px] font-bold uppercase tracking-wider font-mono ${
                          theme === "dark" ? "border-slate-800 text-slate-400 bg-slate-950/30" : "border-slate-100 text-slate-500 bg-slate-50"
                        }`}>
                          <th className="py-4 px-5">Client</th>
                          <th className="py-4 px-5">Details</th>
                          <th className="py-4 px-5">Project Scope</th>
                          <th className="py-4 px-5">Date Received</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/20 text-xs font-semibold">
                        {filteredInquiries.map((inq) => (
                          <tr 
                            key={inq.id} 
                            onClick={() => {
                              setSelectedInquiry(inq);
                              if ((inq.status || "unread") === "unread") {
                                handleUpdateStatus(inq.id, "read");
                              }
                            }}
                            className={`cursor-pointer transition-colors duration-300 hover:bg-slate-500/[0.03] ${
                              (inq.status || "unread") === "unread" && (theme === "dark" ? "bg-purple-950/10 font-bold" : "bg-purple-50/20 font-bold")
                            }`}
                          >
                            {/* Client Column */}
                            <td className="py-4.5 px-5 max-w-[200px] truncate">
                              <div className="flex flex-col text-left">
                                <span className={`text-sm ${theme === "dark" ? "text-white" : "text-slate-800"}`}>{inq.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{inq.email}</span>
                              </div>
                            </td>

                            {/* Details Column */}
                            <td className="py-4.5 px-5 max-w-xs truncate text-left text-slate-500">
                              {inq.message}
                            </td>

                            {/* Scope Column */}
                            <td className="py-4.5 px-5 text-left">
                              <div className="flex flex-col gap-1">
                                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full w-fit ${
                                  theme === "dark" ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                                }`}>
                                  {inq.service}
                                </span>
                                {inq.budget && <span className="text-[10px] text-slate-400 block font-mono">{inq.budget}</span>}
                              </div>
                            </td>

                            {/* Date Column */}
                            <td className="py-4.5 px-5 text-left text-[11px] text-slate-400 font-mono">
                              {new Date(inq.timestamp).toLocaleString()}
                            </td>

                            {/* Status Column */}
                            <td className="py-4.5 px-5 text-left">
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                                (inq.status || "unread") === "unread" 
                                  ? "bg-red-500/10 text-red-500" 
                                  : (inq.status || "unread") === "read"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-emerald-500/10 text-emerald-500"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  (inq.status || "unread") === "unread" ? "bg-red-500" : (inq.status || "unread") === "read" ? "bg-amber-500" : "bg-emerald-500"
                                }`} />
                                {(inq.status || "unread").toUpperCase()}
                              </span>
                            </td>

                            {/* Actions Column */}
                            <td className="py-4.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end items-center gap-2">
                                {/* Toggle Read/Contacted */}
                                {(inq.status || "unread") !== "contacted" ? (
                                  <button
                                    onClick={() => handleUpdateStatus(inq.id, "contacted")}
                                    className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                                      theme === "dark" 
                                        ? "bg-slate-800 hover:bg-slate-700 border-slate-700/60 text-emerald-400" 
                                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-emerald-600"
                                    }`}
                                    title="Mark contacted"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateStatus(inq.id, "unread")}
                                    className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                                      theme === "dark" 
                                        ? "bg-slate-800 hover:bg-slate-700 border-slate-700/60 text-amber-400" 
                                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-amber-600"
                                    }`}
                                    title="Mark unread"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Delete */}
                                <button
                                  onClick={() => setDeleteTargetId(inq.id)}
                                  className="p-1.5 rounded-lg border border-red-500/10 bg-red-500/5 hover:bg-red-500/15 text-red-500 cursor-pointer transition-colors"
                                  title="Permanently Delete Inquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* -----------------------------------------------------------------
           INQUIRY DETAIL MODAL SCREEN
           ----------------------------------------------------------------- */}
        <AnimatePresence>
          {selectedInquiry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setSelectedInquiry(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className={`w-full max-w-2xl p-8 rounded-3xl border shadow-2xl overflow-hidden relative ${
                  theme === "dark" 
                    ? "bg-slate-900 border-slate-800 text-white" 
                    : "bg-white border-slate-200 text-slate-800"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className={`absolute top-4 right-4 p-1.5 rounded-full cursor-pointer border hover:scale-105 transition-all ${
                    theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white" : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-6 text-left">
                  {/* Status header */}
                  <div className="flex justify-between items-center border-b pb-4 border-slate-200/20">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block mb-0.5">Inquiry Details</span>
                      <h2 className="text-xl font-black">{selectedInquiry.name}</h2>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full ${
                        (selectedInquiry.status || "unread") === "unread" 
                          ? "bg-red-500/10 text-red-500" 
                          : (selectedInquiry.status || "unread") === "read"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          (selectedInquiry.status || "unread") === "unread" ? "bg-red-500" : (selectedInquiry.status || "unread") === "read" ? "bg-amber-500" : "bg-emerald-500"
                        }`} />
                        {(selectedInquiry.status || "unread").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                      theme === "dark" ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                    }`}>
                      <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</span>
                        <a href={`mailto:${selectedInquiry.email}`} className="text-[#6c00d9] hover:underline font-bold mt-0.5">{selectedInquiry.email}</a>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                      theme === "dark" ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Phone Number</span>
                          <span className="font-bold mt-0.5">{selectedInquiry.phone || "N/A"}</span>
                        </div>
                      </div>
                      
                      {/* WhatsApp trigger */}
                      <a
                        href={`https://wa.me/${(selectedInquiry.phone || "").replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(selectedInquiry.name)},%20this%20is%20Chris%20from%20ChrisBuilds%20regarding%20your%20project...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                      theme === "dark" ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                    }`}>
                      <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Date Received</span>
                        <span className="font-bold mt-0.5">{new Date(selectedInquiry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                      theme === "dark" ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                    }`}>
                      <DollarSign className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Project Scope</span>
                        <span className="font-bold mt-0.5 uppercase tracking-wide">
                          {selectedInquiry.service}{selectedInquiry.budget ? ` // ${selectedInquiry.budget}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Details */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Message Details</span>
                    <div className={`p-5 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${
                      theme === "dark" ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200"
                    }`}>
                      {selectedInquiry.message}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center border-t pt-5 border-slate-200/20 mt-2">
                    <button
                      onClick={() => {
                        setDeleteTargetId(selectedInquiry.id);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>

                    <div className="flex gap-2">
                      {(selectedInquiry.status || "unread") !== "contacted" ? (
                        <button
                          onClick={() => handleUpdateStatus(selectedInquiry.id, "contacted")}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Mark Contacted
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(selectedInquiry.id, "unread")}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-4 h-4" /> Mark Unread
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -----------------------------------------------------------------
           DELETE CONFIRMATION DIALOG MODAL
           ----------------------------------------------------------------- */}
        <AnimatePresence>
          {deleteTargetId && !selectedInquiry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setDeleteTargetId(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className={`w-full max-w-sm p-6 rounded-2xl border shadow-xl relative text-center flex flex-col items-center gap-4 ${
                  theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3.5 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wider uppercase mb-1">Delete Inquiry Log?</h3>
                  <p className="text-xs text-slate-400">This action is permanent and cannot be undone.</p>
                </div>

                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setDeleteTargetId(null)}
                    disabled={isDeleting}
                    className={`flex-1 py-2.5 rounded-xl text-xs uppercase font-bold tracking-widest cursor-pointer border ${
                      theme === "dark" ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300" : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteInquiry}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/60 text-white text-xs uppercase font-bold tracking-widest rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isDeleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Confirm Delete"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
