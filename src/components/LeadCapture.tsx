/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Send, 
  Database, 
  Lock, 
  QrCode, 
  Download, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  Briefcase,
  Layers,
  ChevronRight,
  Search,
  Filter,
  UserCheck
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

interface Lead {
  id: string;
  projectName: string;
  clientName: string;
  contactType: "wechat" | "email";
  contactVal: string;
  selectedTier: string;
  budgetRange: string;
  description: string;
  signedNdaName: string;
  timestamp: string;
  status: "pending" | "contacted" | "approved" | "archived";
  adminNotes?: string;
}

// Initial demo leads to showcase the database immediately
const DEFAULT_LEADS: Lead[] = [
  {
    id: "SF-OPC-2026-9041",
    projectName: "智能图像一键扩画与海外收单工具",
    clientName: "陈总 (AI 图像创业者)",
    contactType: "wechat",
    contactVal: "ch_creator_ai",
    selectedTier: "Weekly Launch Sprint (¥9,800)",
    budgetRange: "¥10,000 - ¥20,000",
    description: "需要一个全自适应的落地页，集成 Stripe 进行海外订阅收单，同时后台接入 Stable Diffusion 扩画 API 进行一键生图并展示水印，限期 5 天极速上线验证。",
    signedNdaName: "陈远博",
    timestamp: "2026-07-01 14:24",
    status: "approved",
    adminNotes: "已对接。核心 API 已经预备好，周一即可排期进入 active 轨道。"
  },
  {
    id: "SF-OPC-2026-8812",
    projectName: "全自动小红书爆款文案挽单工作流",
    clientName: "Sarah Zhao",
    contactType: "email",
    contactVal: "sarah.z@vanguard-ops.io",
    selectedTier: "Supersonic Monthly Retainer (¥24,800)",
    budgetRange: "¥20,000 - ¥50,000",
    description: "开发一个监测小红书评论区关键词，自动触发并调用大模型生成个性化私信、最终通过飞书消息群发和邮箱推送的自动化脚本。必须支持灵活的冷冻和续期暂停协议。",
    signedNdaName: "Zhao Sarah L.",
    timestamp: "2026-06-30 09:15",
    status: "pending",
    adminNotes: "需要跟客户明确冷冻天数的最小单位。建议在控制塔配置暂停钩子。"
  }
];

export default function LeadCapture() {
  const { language } = useLanguage();
  const { user, updateUserMembership } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Form States
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [contactType, setContactType] = useState<"wechat" | "email">("wechat");
  const [contactVal, setContactVal] = useState("");
  const [selectedTier, setSelectedTier] = useState("monthly");
  const [budgetRange, setBudgetRange] = useState("¥20,000 - ¥50,000");
  const [description, setDescription] = useState("");
  const [signedNdaName, setSignedNdaName] = useState("");
  const [ndaChecked, setNdaChecked] = useState(false);

  // Auto-prefill if user logs in or is already logged in
  useEffect(() => {
    if (user) {
      if (!clientName) setClientName(user.username);
      if (!contactVal) {
        setContactVal(user.email);
        setContactType("email");
      }
    }
  }, [user]);
  
  // UI States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedHash, setSubmittedHash] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopyWeChat = () => {
    navigator.clipboard.writeText("opc_studio");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Filters & Search for Admin Hub
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const saved = localStorage.getItem("opc_market_leads");
    if (saved) {
       try {
        setLeads(JSON.parse(saved));
      } catch (e) {
        setLeads(DEFAULT_LEADS);
      }
    } else {
      localStorage.setItem("opc_market_leads", JSON.stringify(DEFAULT_LEADS));
      setLeads(DEFAULT_LEADS);
    }
  }, []);

  useEffect(() => {
    const handleConvert = (e: Event) => {
      const customEvent = e as CustomEvent<{ projectName: string; description: string }>;
      if (customEvent.detail) {
        setProjectName(customEvent.detail.projectName);
        setDescription(customEvent.detail.description);
        setSelectedTier("monthly"); // Auto-select Monthly retainer
        setBudgetRange("¥20,000 - ¥50,000");
        setIsSubmitted(false); // Reset form state for new lead
        setAdminMode(false); // Toggle back to client portal
      }
    };
    window.addEventListener("convertBlueprintToLead", handleConvert);
    return () => window.removeEventListener("convertBlueprintToLead", handleConvert);
  }, []);

  const saveLeadsToStorage = (updatedLeads: Lead[]) => {
    localStorage.setItem("opc_market_leads", JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !clientName || !contactVal || !description) {
      alert(language === "cn" ? "请完整填写必填字段" : "Please fill in all required fields.");
      return;
    }
    if (!ndaChecked || !signedNdaName) {
      alert(language === "cn" ? "请阅读并签署 NDA 协议以保护您的知识产权" : "Please check and sign the NDA to secure your IP.");
      return;
    }

    const txId = `SF-OPC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: Lead = {
      id: txId,
      projectName,
      clientName,
      contactType,
      contactVal,
      selectedTier: selectedTier === "sprint" 
        ? "Weekly Launch Sprint (¥9,800)" 
        : selectedTier === "monthly" 
        ? "Supersonic Monthly Retainer (¥24,800)" 
        : "Architect Advisory (¥4,800)",
      budgetRange,
      description,
      signedNdaName,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "pending"
    };

    const updated = [newLead, ...leads];
    saveLeadsToStorage(updated);
    
    // Auto-activate membership and credits if user is logged in
    if (user && (selectedTier === "sprint" || selectedTier === "monthly" || selectedTier === "advisor")) {
      updateUserMembership(selectedTier as "none" | "sprint" | "monthly" | "advisor");
    }

    setSubmittedHash(txId);
    setIsSubmitted(true);
    
    // Track simulated lead submission to trigger immediate high-value feedback
    const event = new CustomEvent("newLeadSubmitted", { detail: newLead });
    window.dispatchEvent(event);
  };

  const resetForm = () => {
    setProjectName("");
    setClientName("");
    setContactVal("");
    setDescription("");
    setSignedNdaName("");
    setNdaChecked(false);
    setIsSubmitted(false);
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin2026") {
      setIsAdminAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError(language === "cn" ? "密码错误 (提示: admin2026)" : "Incorrect password (Hint: admin2026)");
    }
  };

  const handleDeleteLead = (id: string) => {
    const filtered = leads.filter(l => l.id !== id);
    saveLeadsToStorage(filtered);
  };

  const handleUpdateStatus = (id: string, newStatus: "pending" | "contacted" | "approved" | "archived") => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { ...l, status: newStatus };
      }
      return l;
    });
    saveLeadsToStorage(updated);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { ...l, adminNotes: notes };
      }
      return l;
    });
    saveLeadsToStorage(updated);
  };

  const exportLeadsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `opc_world_leads_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter leads for Admin Dashboard
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <section id="opc-conversion-lead-funnel" className="border-t border-zinc-200 bg-zinc-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header containing toggle for Admin View vs Client view */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <span className="font-mono text-[10px] font-extrabold tracking-widest text-orange-600 bg-orange-100/60 border border-orange-200 px-3 py-1 rounded-full uppercase">
              {language === "cn" ? "🚀 商业闭环 & 订购中心" : "🚀 Commercial Onboarding & Book Slots"}
            </span>
            <h2 className="mt-4 font-sans text-3xl font-black text-zinc-900 tracking-tight sm:text-4xl">
              {language === "cn" ? "即刻启动您的一人公司研发蓝图" : "Book Your OPC Solo Engineering Slot Now"}
            </h2>
            <p className="mt-3 font-sans text-sm text-zinc-600 leading-relaxed">
              {language === "cn" 
                ? "锁定我们极其稀缺的单兵极客研发负载。提交您的创意点子，签署极客双向保密与知识产权一键让渡备忘录，我们将直接调配最优高能工具链为您超音速交付。"
                : "Secure our elite developer bandwidth. Submit your conceptual idea, lock your pricing tier, and electronically sign our streamlined NDA to transfer 100% intellectual property instantly."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              id="toggle-admin-panel-btn"
              onClick={() => {
                setAdminMode(!adminMode);
                setIsAdminAuthenticated(false);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                adminMode 
                  ? "bg-zinc-900 border-zinc-800 text-white shadow-md"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              {adminMode 
                ? (language === "cn" ? "返回客户端订购" : "Back to Client Portal")
                : (language === "cn" ? "管理后台 (线索库)" : "Operator Leads Dashboard")
              }
            </button>
          </div>
        </div>

        {/* ADMIN MODE MAIN INTERFACE */}
        {adminMode ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-md md:p-8">
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 mb-6">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="font-sans text-lg font-bold text-zinc-900">
                  {language === "cn" ? "安全锁验证" : "Secure Operator Gate"}
                </h3>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                  {language === "cn" 
                    ? "此后台仅允许创始人/首席架构师登录管理已提交的商业线索。输入初始校验密码即可解锁线索库。"
                    : "This workspace is restricted to the Lead Systems Architect. Enter the project validation password to access live inquiries."}
                </p>

                <form onSubmit={handleVerifyPassword} className="mt-6 flex gap-2">
                  <input
                    id="admin-pass-input"
                    type="password"
                    placeholder={language === "cn" ? "输入登录密码 (默认: admin2026)" : "Enter key (Default: admin2026)"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="flex-grow rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    id="submit-admin-pass-btn"
                    type="submit"
                    className="rounded-xl bg-zinc-900 hover:bg-zinc-800 px-5 text-sm font-semibold text-white transition-colors cursor-pointer"
                  >
                    {language === "cn" ? "解锁" : "Unlock"}
                  </button>
                </form>
                {passwordError && (
                  <p className="mt-2 text-xs text-red-500 font-medium">{passwordError}</p>
                )}
                
                <div className="mt-6 rounded-lg bg-zinc-50 p-3.5 border border-zinc-150 text-left">
                  <p className="text-[11px] font-medium text-zinc-600 leading-normal">
                    💡 <strong>{language === "cn" ? "体验提示:" : "Prototype Tips:"}</strong> <br />
                    {language === "cn" 
                      ? "为了方便您进行完整的商业闭环验证，密码已设为" 
                      : "For full evaluation of our monetized pipeline, the preset pass is"}{" "}
                    <code className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded font-mono font-bold">admin2026</code>。
                    {language === "cn" 
                      ? "解锁后可以查看并修改所有的合作线索和导流备注。" 
                      : " Unlocking lets you audit, update statuses, edit notes, and download the entire client pipeline as JSON."}
                  </p>
                </div>
              </div>
            ) : (
              // AUTHENTICATED ADMIN PANEL
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-6 mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold font-mono">
                      {leads.length}
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-bold text-zinc-900">
                        {language === "cn" ? "云端商机调度台" : "OPC Live Sales Command & Lead Hub"}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {language === "cn" ? "管理、跟进并归档客户端提交的高客单价意向书" : "Track and convert high-ticket inquiries submitted on this application"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      id="export-leads-btn"
                      onClick={exportLeadsJSON}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-700 cursor-pointer shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {language === "cn" ? "导出 JSON 数据" : "Export Lead Pool (JSON)"}
                    </button>
                    <button
                      id="reset-leads-btn"
                      onClick={() => {
                        if (confirm(language === "cn" ? "确定重置回初始演示线索吗？" : "Are you sure you want to reset to initial leads?")) {
                          saveLeadsToStorage(DEFAULT_LEADS);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 px-3.5 py-2 text-xs font-semibold text-red-700 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {language === "cn" ? "重置演示数据" : "Reset Data"}
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      id="admin-search-leads"
                      type="text"
                      placeholder={language === "cn" ? "搜索项目、客户姓名、描述或微信号..." : "Search leads by client, keyword, WeChat..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 pl-9 pr-4 py-2.5 text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-zinc-400" />
                    <select
                      id="admin-filter-status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-orange-500"
                    >
                      <option value="all">{language === "cn" ? "全部状态" : "All Status"}</option>
                      <option value="pending">{language === "cn" ? "待处理 (Pending)" : "Pending"}</option>
                      <option value="contacted">{language === "cn" ? "沟通中 (Contacted)" : "Contacted"}</option>
                      <option value="approved">{language === "cn" ? "已批准/待排期 (Approved)" : "Approved"}</option>
                      <option value="archived">{language === "cn" ? "已归档 (Archived)" : "Archived"}</option>
                    </select>
                  </div>
                </div>

                {/* Leads List container */}
                {filteredLeads.length === 0 ? (
                  <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-sm text-zinc-500 font-medium">
                      {language === "cn" ? "暂无匹配的商机线索" : "No matching inquiries found."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredLeads.map((lead) => (
                      <div 
                        id={`lead-card-${lead.id}`}
                        key={lead.id}
                        className={`rounded-2xl border p-5 transition-all ${
                          lead.status === "approved" 
                            ? "bg-emerald-50/20 border-emerald-150"
                            : lead.status === "contacted"
                            ? "bg-blue-50/20 border-blue-150"
                            : "bg-zinc-50/50 border-zinc-150"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <span className="font-mono text-[9px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded mr-2">
                              {lead.id}
                            </span>
                            <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded ${
                              lead.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : lead.status === "contacted"
                                ? "bg-blue-100 text-blue-800"
                                : lead.status === "pending"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-zinc-100 text-zinc-600"
                            }`}>
                              {lead.status.toUpperCase()}
                            </span>

                            <h4 className="mt-2 font-sans text-sm font-bold text-zinc-900">
                              {lead.projectName}
                            </h4>
                          </div>

                          <div className="flex flex-row sm:flex-col items-start gap-1 text-[10px] text-zinc-500 font-mono text-right sm:text-left self-start">
                            <span>{lead.timestamp}</span>
                            <span className="hidden sm:inline bg-orange-100/50 text-orange-700 px-1.5 py-0.2 rounded font-semibold">
                              {lead.budgetRange}
                            </span>
                          </div>
                        </div>

                        {/* Client details info */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-zinc-100">
                          <div className="text-xs">
                            <span className="text-zinc-400">{language === "cn" ? "客户姓名/单位:" : "Client Name:"}</span>
                            <p className="font-semibold text-zinc-800 mt-0.5">{lead.clientName}</p>
                          </div>
                          <div className="text-xs">
                            <span className="text-zinc-400">{language === "cn" ? "联系微信号/邮箱:" : "Contact info:"}</span>
                            <p className="font-mono font-semibold text-zinc-800 mt-0.5 select-all">
                              {lead.contactType === "wechat" ? "微信: " : "Email: "}
                              {lead.contactVal}
                            </p>
                          </div>
                          <div className="text-xs">
                            <span className="text-zinc-400">{language === "cn" ? "预订方案服务:" : "Desired Service:"}</span>
                            <p className="font-semibold text-orange-600 mt-0.5 truncate">{lead.selectedTier}</p>
                          </div>
                        </div>

                        {/* Description and NDA signature */}
                        <div className="mt-4 text-xs text-zinc-600 leading-relaxed">
                          <strong className="text-zinc-800 block mb-1">{language === "cn" ? "项目需求背景/变现构想:" : "Project Pitch / Deliverable Description:"}</strong>
                          <p className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">{lead.description}</p>
                        </div>

                        <div className="mt-3 flex items-center gap-1.5 font-sans text-[11px] text-zinc-500">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            {language === "cn" ? "客户已签署双向保密与软件物权一键让渡书。签名印章:" : "NDA signed. Signee: "} 
                            <strong className="font-mono text-zinc-700 underline">{lead.signedNdaName}</strong>
                          </span>
                        </div>

                        {/* Admin scheduling / notes section */}
                        <div className="mt-4 border-t border-zinc-100 pt-4">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                            {language === "cn" ? "创始人跟进简报 & 资源调配" : "Architect Dispatch Notes"}
                          </span>
                          <div className="flex gap-2">
                            <input
                              id={`admin-notes-${lead.id}`}
                              type="text"
                              placeholder={language === "cn" ? "添加私密跟进备注 (如：客户要求配合国际支付，周二排期...)" : "Add private notes (e.g. Schedule for Tuesday...)"}
                              defaultValue={lead.adminNotes || ""}
                              onBlur={(e) => handleUpdateNotes(lead.id, e.target.value)}
                              className="flex-grow rounded-lg border border-zinc-200 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                            />
                            <div className="flex items-center gap-1">
                              <select
                                id={`admin-status-select-${lead.id}`}
                                defaultValue={lead.status}
                                onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                                className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-700 focus:outline-none"
                              >
                                <option value="pending">{language === "cn" ? "待处理" : "Pending"}</option>
                                <option value="contacted">{language === "cn" ? "沟通中" : "Contacted"}</option>
                                <option value="approved">{language === "cn" ? "批准上线" : "Approved"}</option>
                                <option value="archived">{language === "cn" ? "已归档" : "Archived"}</option>
                              </select>
                              <button
                                id={`admin-delete-lead-${lead.id}`}
                                onClick={() => handleDeleteLead(lead.id)}
                                className="rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 p-1.5 text-red-600 transition-colors cursor-pointer"
                                title={language === "cn" ? "删除此线索" : "Delete Lead"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* CLIENT-FACING ONBOARDING INTERFACE (THE FUNNEL) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side: Interactive Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    id="opc-order-funnel-form"
                    key="funnel-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                  >
                    <div className="border-b border-zinc-100 pb-4 mb-2">
                      <h3 className="font-sans text-lg font-bold text-zinc-900 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-orange-600" />
                        {language === "cn" ? "订购舱：排期席位锁定" : "Booking Bay: Lock Dev Spot"}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        {language === "cn" 
                          ? "锁定 48 小时极速交付通道，直接交付线上运行的可交付产品" 
                          : "Input your roadmap metrics to unlock direct development access with Lead Architect."}
                      </p>
                    </div>

                    {/* Step 1: Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                          {language === "cn" ? "1. 您的称呼/单位 (必填) *" : "1. Your Name / Company (Required) *"}
                        </label>
                        <input
                          id="form-client-name"
                          type="text"
                          required
                          placeholder={language === "cn" ? "例如：张总 / 极客数智" : "e.g., Sarah Zhao / Creator Studio"}
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                          {language === "cn" ? "2. 项目名称 (必填) *" : "2. Project Title (Required) *"}
                        </label>
                        <input
                          id="form-project-name"
                          type="text"
                          required
                          placeholder={language === "cn" ? "例如：AI 自动选词营销站" : "e.g., AI SEO Leads Funnel"}
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    {/* Step 2: Contact Method */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                          {language === "cn" ? "3. 紧急对接方式 *" : "3. Direct Contact Channel *"}
                        </label>
                        <div className="flex rounded-xl bg-zinc-100 p-0.5 border border-zinc-200">
                          <button
                            id="form-contact-type-wechat"
                            type="button"
                            onClick={() => setContactType("wechat")}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                              contactType === "wechat"
                                ? "bg-white text-zinc-950 shadow-2xs"
                                : "text-zinc-500 hover:text-zinc-950"
                            }`}
                          >
                            {language === "cn" ? "微信号 (首选)" : "WeChat ID (Preferred)"}
                          </button>
                          <button
                            id="form-contact-type-email"
                            type="button"
                            onClick={() => setContactType("email")}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                              contactType === "email"
                                ? "bg-white text-zinc-950 shadow-2xs"
                                : "text-zinc-500 hover:text-zinc-950"
                            }`}
                          >
                            Email
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                          &nbsp;
                        </label>
                        <input
                          id="form-contact-val"
                          type="text"
                          required
                          placeholder={contactType === "wechat" ? (language === "cn" ? "输入微信号" : "WeChat Handle") : "Enter email address"}
                          value={contactVal}
                          onChange={(e) => setContactVal(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    {/* Step 3: Tier Select & Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                          {language === "cn" ? "4. 意向预订套餐 *" : "4. Pricing Strategy Tier *"}
                        </label>
                        <select
                          id="form-selected-tier"
                          value={selectedTier}
                          onChange={(e) => {
                            setSelectedTier(e.target.value);
                            if (e.target.value === "sprint") setBudgetRange("¥9,800");
                            else if (e.target.value === "advisor") setBudgetRange("¥4,800");
                            else setBudgetRange("¥20,000 - ¥50,000");
                          }}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        >
                          <option value="sprint">{language === "cn" ? "周度短途交付 (¥9,800 单次)" : "Weekly Launch Sprint (¥9,800)"}</option>
                          <option value="monthly">{language === "cn" ? "超音速月度定金 (¥24,800/月)" : "Monthly Retainer (¥24,800/mo)"}</option>
                          <option value="advisor">{language === "cn" ? "首席飞行导航咨询 (¥4,800 单次)" : "Advisory Consulting (¥4,800)"}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                          {language === "cn" ? "5. 预估商业预算 *" : "5. Estimated Product Budget *"}
                        </label>
                        <select
                          id="form-budget-range"
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        >
                          {selectedTier === "sprint" && <option value="¥9,800">¥9,800 (固定周预算)</option>}
                          {selectedTier === "advisor" && <option value="¥4,800">¥4,800 (固定咨询费)</option>}
                          <option value="¥10,000 - ¥20,000">¥10,000 - ¥20,000</option>
                          <option value="¥20,000 - ¥50,000">¥20,000 - ¥50,000 (推荐月投)</option>
                          <option value="¥50,000 - ¥100,000">¥50,000 - ¥100,000</option>
                          <option value="¥100,000+">¥100,000+ (复杂系统定制)</option>
                        </select>
                      </div>
                    </div>

                    {/* Step 4: Description */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        {language === "cn" ? "6. 产品创意及变现构想简述 (必填) *" : "6. Product Vision & Monetization Pitch (Required) *"}
                      </label>
                      <textarea
                        id="form-project-description"
                        required
                        rows={3}
                        placeholder={language === "cn" 
                          ? "简单描述您想构建的功能或业务模型。例如：我们需要集成微信扫码、自动生成电子收据、多商户权限，并要求 48 小时交付一个可测试的 Beta 版本..." 
                          : "Describe your feature list, user acquisition funnel, or custom requirements. E.g. We need to integrate OAuth, build high-conversion landing pages, and test interactive components..."}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    {/* DUAL NDA AGREEMENT AND SIGNATURE SECTION */}
                    <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 space-y-3.5">
                      <div className="flex items-start gap-2">
                        <input
                          id="form-nda-checkbox"
                          type="checkbox"
                          required
                          checked={ndaChecked}
                          onChange={(e) => setNdaChecked(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="text-xs">
                          <strong className="text-zinc-800 font-sans block">
                            {language === "cn" ? "🔒 签署双向保密与软件所有权百分百过渡契约" : "🔒 Dual Non-Disclosure & 100% IP Ownership Deed"}
                          </strong>
                          <span className="text-zinc-500 leading-normal mt-0.5 block">
                            {language === "cn" 
                              ? "我确认首席工程师不会在任何公开渠道泄露我的商业设想；且在项目交付验收时，平台无条件将 100% 代码资产和数据库完全让渡至我的名下。"
                              : "I enforce that the platform shall never disclose my commercial setup; upon delivery, 100% source code repositories and variables are instantly and unconditionally transferred to me."}
                          </span>
                        </div>
                      </div>

                      {ndaChecked && (
                        <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-3 items-center border-t border-orange-100/60 pt-3">
                          <label className="text-[11px] font-semibold text-orange-800">
                            {language === "cn" ? "✍️ 请在下方键入您的法定姓名完成数字签约:" : "✍️ Type Legal Name for Digital Signature:"}
                          </label>
                          <input
                            id="form-signed-nda"
                            type="text"
                            required
                            placeholder={language === "cn" ? "例如：张大伟" : "e.g., Sarah Zhao"}
                            value={signedNdaName}
                            onChange={(e) => setSignedNdaName(e.target.value)}
                            className="rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs text-orange-950 font-mono focus:border-orange-400 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      id="submit-opc-order-btn"
                      type="submit"
                      className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 py-3.5 text-xs font-semibold text-white cursor-pointer transition-all shadow-md shadow-orange-500/10 hover:shadow-lg flex items-center justify-center gap-1.5 group"
                    >
                      <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      {language === "cn" ? "安全投递工单 & 预留开发机位" : "Secure Lock Spot & Dispatch Ticket"}
                    </button>
                  </motion.form>
                ) : (
                  // SUBMITTED SUCCESS DISPLAY
                  <motion.div 
                    key="success-display"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center space-y-6"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 animate-bounce">
                      <Check className="h-8 w-8" />
                    </div>

                    <div className="max-w-md mx-auto">
                      <h3 className="font-sans text-xl font-bold text-zinc-900">
                        {language === "cn" ? "🎉 席位锁定成功，排单已激活！" : "🎉 Spot Locked & Dispatched Successfully!"}
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed mt-2">
                        {language === "cn" 
                          ? "您的工单与双向 NDA 协议已被系统安全存储，并分配了唯一的商用安全哈希指纹。首席架构师将在 12 小时内审阅完毕，并通过您的微信号与您开启纯异步沟通。"
                          : "Your product parameters and signed IP deed have been secure-hashed. Lead Systems Architect will review your backlog within 12 hours."}
                      </p>
                    </div>

                    {/* Receipt Fingerprint Details */}
                    <div className="bg-zinc-50 rounded-2xl border border-zinc-150 p-4 max-w-sm mx-auto text-left font-mono text-[11px] text-zinc-500 space-y-1.5">
                      <div className="flex justify-between border-b border-zinc-200 pb-1.5 mb-1.5">
                        <span className="font-bold text-zinc-800">TRANSACTION RECEIPT</span>
                        <span className="text-orange-600 font-bold">{submittedHash}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Client:</span>
                        <span className="text-zinc-700">{clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Project:</span>
                        <span className="text-zinc-700 truncate max-w-[200px]">{projectName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="text-zinc-700">{selectedTier === "sprint" ? "Weekly Sprint" : selectedTier === "monthly" ? "Monthly Retainer" : "Advisory"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Signed Deed:</span>
                        <span className="text-emerald-600 font-bold">{signedNdaName} (DEED_VERIFIED)</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                      <button
                        id="reset-success-form-btn"
                        onClick={resetForm}
                        className="rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-5 py-2.5 text-xs font-semibold text-zinc-700 cursor-pointer shadow-xs"
                      >
                        {language === "cn" ? "再投递一份构想" : "Submit Another Idea"}
                      </button>
                      <button
                        id="view-admin-instantly-btn"
                        onClick={() => {
                          setAdminMode(true);
                          setIsAdminAuthenticated(true);
                        }}
                        className="rounded-xl bg-zinc-950 hover:bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-md inline-flex items-center gap-1.5"
                      >
                        <Database className="h-3.5 w-3.5" />
                        {language === "cn" ? "进入后台查看线索 (管理员)" : "View Lead in Admin Hub"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side: High-conversion Value Prop Checklist & WeChat QR placeholder */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              
              {/* Trust Checklist Cards */}
              <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 flex-grow">
                <div>
                  <span className="font-mono text-[9px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                    {language === "cn" ? "双向安心履约契约" : "SLA ASSURANCES"}
                  </span>
                  <h3 className="font-sans text-base font-black text-white mt-3">
                    {language === "cn" ? "一人公司三大交付铁律" : "Three Delivery Pillars for Solopreneurs"}
                  </h3>
                </div>

                <ul className="space-y-4 text-xs text-zinc-400">
                  <li className="flex gap-3">
                    <Check className="h-4.5 w-4.5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{language === "cn" ? "1. 无限期随时暂停与解冻" : "1. Unlimited Pause & Resume"}</strong>
                      <span className="mt-1 block leading-relaxed">
                        {language === "cn" 
                          ? "随时可冷冻剩余天数。比如您下单了 1 个月，前 10 天做好了主要功能，由于市场验证需要，可点击一键暂停，半年内随时解冻，毫无沟通撕扯。"
                          : "Freeze remaining days at any point. Resume when marketing validations are solid. Every cent works."}
                      </span>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <Check className="h-4.5 w-4.5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{language === "cn" ? "2. 拒绝外包转包与沟通损耗" : "2. No Middlemen or Subcontracting"}</strong>
                      <span className="mt-1 block leading-relaxed">
                        {language === "cn" 
                          ? "没有项目经理，更没有实习生。您所沟通的对象即是写出最后一行类型安全 TypeScript 健壮代码的 Lead Systems Architect 本人。"
                          : "No redundant sales calls. You align directly with the Lead Systems Architect writing your modular production code."}
                      </span>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <Check className="h-4.5 w-4.5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{language === "cn" ? "3. 100% 极速透明部署" : "3. 100% Instant Ownership"}</strong>
                      <span className="mt-1 block leading-relaxed">
                        {language === "cn" 
                          ? "交付即直接提供部署在云端的高性能、安全可运行成品。代码仓库 GitHub、数据库、Stripe 账户一键交割，全物理级绝对隔离保护。"
                          : "Immediate deployment to production serverless containers. One-click repository transfer upon project completion."}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* WeChat QR Support Box */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
                <div className="h-24 w-24 bg-zinc-50 border border-zinc-200 rounded-2xl p-2 flex items-center justify-center flex-shrink-0 relative group overflow-hidden">
                  {/* Glowing Scanner Sweep Laser Bar */}
                  <div className="absolute left-1 right-1 h-0.5 bg-orange-500 shadow-[0_0_8px_#ea580c] z-10 animate-[bounce_2s_infinite]" style={{ top: "10%" }} />
                  
                  {/* Real beautiful QR graphic using standard SVG */}
                  <svg viewBox="0 0 100 100" className="h-full w-full text-zinc-900 select-none">
                    {/* QR Finder patterns */}
                    <path d="M 8 8 h 24 v 24 h -24 z M 14 14 v 12 h 12 v -12 z" fill="currentColor"/>
                    <path d="M 68 8 h 24 v 24 h -24 z M 74 14 v 12 h 12 v -12 z" fill="currentColor"/>
                    <path d="M 8 68 h 24 v 24 h -24 z M 14 74 v 12 h 12 v -12 z" fill="currentColor"/>
                    
                    {/* Small alignment block */}
                    <path d="M 70 70 h 10 v 10 h -10 z M 73 73 v 4 h 4 v -4 z" fill="currentColor"/>
                    
                    {/* Grid noises representing real QR patterns */}
                    <rect x="42" y="8" width="6" height="6" fill="currentColor"/>
                    <rect x="52" y="14" width="8" height="6" fill="currentColor"/>
                    <rect x="42" y="24" width="12" height="6" fill="currentColor"/>
                    <rect x="42" y="42" width="10" height="10" fill="currentColor"/>
                    <rect x="62" y="42" width="8" height="12" fill="currentColor"/>
                    <rect x="76" y="50" width="12" height="12" fill="currentColor"/>
                    <rect x="42" y="62" width="12" height="8" fill="currentColor"/>
                    <rect x="56" y="72" width="10" height="10" fill="currentColor"/>
                    <rect x="18" y="42" width="8" height="8" fill="currentColor"/>
                    <rect x="50" y="84" width="14" height="6" fill="currentColor"/>
                    <rect x="84" y="84" width="8" height="8" fill="currentColor"/>
                  </svg>
                  <div className="absolute inset-0 bg-zinc-950/90 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <QrCode className="h-7 w-7 text-orange-400 animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-sans text-xs font-bold text-zinc-900 flex items-center justify-center sm:justify-start gap-1.5">
                    {language === "cn" ? "创始人微信 1v1 直连专线" : "Founder WeChat Direct Connection"}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </h4>
                  <p className="text-[11px] text-zinc-500 leading-normal mt-1.5">
                    {language === "cn" 
                      ? "扫描二维码或一键复制微信号添加。10 分钟内极速响应，支持免费进行产品痛点精算和算力套餐定制。" 
                      : "Scan QR or copy WeChat ID to add. 10-minute response time. Free products blueprint assessment & custom compute plan consultation."}
                  </p>
                  
                  {/* Interactive ID display & copy button */}
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <div className="px-2.5 py-1 bg-zinc-100 border border-zinc-200 rounded-md font-mono text-[11px] font-bold text-zinc-800">
                      ID: opc_studio
                    </div>
                    <button
                      id="btn-copy-wechat"
                      onClick={handleCopyWeChat}
                      className={`px-3 py-1 font-sans text-[10px] font-bold rounded-md border cursor-pointer transition-all duration-200 shadow-3xs hover:shadow-2xs active:scale-95 flex items-center gap-1 ${
                        copied
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                      }`}
                    >
                      {copied ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                          {language === "cn" ? "已复制微信号!" : "ID Copied!"}
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                          {language === "cn" ? "一键复制微信号" : "Copy WeChat ID"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
