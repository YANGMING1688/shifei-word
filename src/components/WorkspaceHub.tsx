/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  TaskStatus, 
  TaskCategory, 
  WorkspaceTask 
} from "../types";
import { 
  Layers, 
  Zap, 
  Code, 
  Trash, 
  Clock, 
  CheckCircle, 
  Plus, 
  AlertCircle, 
  MessageSquare, 
  RefreshCw, 
  Check, 
  Video,
  Globe,
  ShieldAlert,
  FileText,
  Fingerprint,
  Server,
  Wifi,
  AlertTriangle,
  Terminal,
  ChevronRight 
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function WorkspaceHub() {
  const { language, t } = useLanguage();
  const { user, setIsAuthModalOpen, setAuthModalTab } = useAuth();

  const [tasks, setTasks] = useState<WorkspaceTask[]>([
    {
      id: "tsk-1",
      title: "建立 AI 商品橱窗图像批量渲染脚本",
      description: "调用宿主 API，根据输入的产品背景关键词生成 4K 高分辨率海报图，并存储到本地资产目录。",
      status: TaskStatus.DELIVERED,
      category: TaskCategory.AI_AUTOMATION,
      priority: "high",
      dateUploaded: "2026-06-01",
      feedback: "效果很棒，能帮我把图片输出格式改成 WebP 吗？"
    },
    {
      id: "tsk-2",
      title: "集成 3 级支付折扣与退款 webhook 控制器",
      description: "编写后台支付网关 webhook，处理不同订阅层级的付费校验、到期暂停以及退款保护锁。",
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.CUSTOM_DEV,
      priority: "medium",
      dateUploaded: "2026-06-02"
    },
    {
      id: "tsk-3",
      title: "设计 SaaS 高转化炫酷 Landing 落地站",
      description: "基于精简现代风，包含功能渐现动画、卡片滑过高光以及实时定价计算联动模块，提升注册率。",
      status: TaskStatus.BACKLOG,
      category: TaskCategory.MARKETING_LANDING,
      priority: "high",
      dateUploaded: "2026-06-03"
    },
    {
      id: "tsk-4",
      title: "Firebase Auth 与多端微信扫码登陆打通",
      description: "封装微信开放平台 API 登陆回调，实现独立站与微信公众号联合登录，并自动同步用户信息。",
      status: TaskStatus.APPROVED,
      category: TaskCategory.SAAS_MVP,
      priority: "low",
      dateUploaded: "2026-05-30"
    }
  ]);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.AI_AUTOMATION);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [feedbackInput, setFeedbackInput] = useState<{ [key: string]: string }>({});
  
  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simMessage, setSimMessage] = useState("");
  const [deliveringTaskId, setDeliveringTaskId] = useState<string | null>(null);

  // GTM Launch & Domain Registry states
  const [productionDomain, setProductionDomain] = useState("opcvanguard.com");
  const [registrantType, setRegistrantType] = useState<"personal" | "enterprise">("personal");
  const [registrantName, setRegistrantName] = useState(user ? user.username : "独立主权开发者");
  const [registrantIdNum, setRegistrantIdNum] = useState("");
  const [icpProvince, setIcpProvince] = useState("粤"); // e.g. 京, 粤, 沪
  const [icpStep, setIcpStep] = useState(1); // 1: Setup, 2: Verification, 3: Bind Server Code, 4: Audit Bureau, 5: Live DNS
  const [icpFilingId, setIcpFilingId] = useState("");
  const [isFilingProgress, setIsFilingProgress] = useState(false);
  const [filingProgressPct, setFilingProgressPct] = useState(0);
  const [dnsVerified, setDnsVerified] = useState(false);
  const [dnsTesting, setDnsTesting] = useState(false);
  const [dnsLogs, setDnsLogs] = useState<string[]>([]);
  const [domainError, setDomainError] = useState("");

  const handleDomainChange = (val: string) => {
    const formatted = val.trim().toLowerCase();
    setProductionDomain(formatted);
    if (formatted.includes("shifei.world")) {
      setDomainError(language === "cn" 
        ? "🚨 安全合规警告：检测到被禁域名 'shifei.world'！按照您的业务准则，该系统严禁放在 shifei.world 的域名下，请注册并使用其他精选后缀域名（例如 yourdomain.dev, opcsolo.com）进行合规备案。" 
        : "🚨 Compliance Alert: 'shifei.world' is a restricted domain. This system CANNOT be deployed under shifei.world. Please choose an alternate compliant domain name."
      );
    } else {
      setDomainError("");
    }
  };

  const startIcpFilingSimulation = () => {
    if (productionDomain.includes("shifei.world")) {
      setDomainError(language === "cn"
        ? "🚨 安全合规警告：检测到被禁域名 'shifei.world'。必须选择其他合规域名才能启动上市备案流程！"
        : "🚨 Compliance Alert: 'shifei.world' is blacklisted. Select another domain to start."
      );
      return;
    }
    if (!productionDomain) {
      setDomainError(language === "cn" ? "请先输入要备案的一人公司域名" : "Please enter a valid domain.");
      return;
    }
    if (!registrantName) {
      setDomainError(language === "cn" ? "请先填写实名登记主体名称" : "Please specify registrant name.");
      return;
    }

    setDomainError("");
    setIsFilingProgress(true);
    setFilingProgressPct(0);
    setIcpStep(2); // move to step 2: verification
  };

  const handleCompleteVerification = () => {
    if (!registrantIdNum) {
      setDomainError(language === "cn" ? "请填写身份证号或营业执照号码" : "Please input ID/License number");
      return;
    }
    setDomainError("");
    setIcpStep(3); // move to step 3: server bond code
  };

  const handleCompleteServerBinding = () => {
    setDomainError("");
    setIcpStep(4); // step 4: Bureau audit simulation
    setIsFilingProgress(true);
    setFilingProgressPct(0);
    
    let pct = 0;
    const interval = setInterval(() => {
      pct += 20;
      setFilingProgressPct(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setIsFilingProgress(false);
        const rand = Math.floor(1000000 + Math.random() * 9000000);
        setIcpFilingId(`${icpProvince}ICP备2026${rand}号-1`);
        setIcpStep(5); // step 5: DNS propagation check
      }
    }, 400);
  };

  const handleVerifyDNS = () => {
    setDnsTesting(true);
    setDnsLogs([]);
    const logs = [
      `[PING] Resolving DNS query for ${productionDomain}...`,
      `[PING] Contacting root NS (a.root-servers.net) -> OK`,
      `[PING] Recieved authoritative server mapping for .com / .org / .ceo...`,
      `[ICP-CHECK] Querying MIIT License database for active registration status...`,
      `[ICP-CHECK] Match found -> Approved Filing ID: ${icpFilingId || "粤ICP备20268848号-1"}`,
      `[CNAME] Fetching certificate authority chain...`,
      `[SSL] Let's Encrypt TLS handshake complete (ECDHE-ECDSA-AES128-GCM-SHA256)`,
      `[SUCCESS] Domain verified! System successfully routed to production container! 🚀`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setDnsLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setDnsTesting(false);
        setDnsVerified(true);
      }
    }, 300);
  };

  const resetIcpFiling = () => {
    setIcpStep(1);
    setIcpFilingId("");
    setDnsVerified(false);
    setDnsLogs([]);
    setDomainError("");
    setFilingProgressPct(0);
  };

  const fetchTaskAIDelivery = async (task: WorkspaceTask) => {
    const activeTitle = getLocalizedTitle(task);
    const activeDesc = getLocalizedDesc(task);
    try {
      const res = await fetch("/api/workspace-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeTitle,
          description: activeDesc,
          language
        })
      });
      if (res.ok) {
        const data = await res.json();
        return JSON.stringify(data);
      }
    } catch (e) {
      console.error("AI delivery notes fetch error:", e);
    }
    return "";
  };

  const handleDeliverTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setDeliveringTaskId(id);
    const aiJson = await fetchTaskAIDelivery(task);
    setDeliveringTaskId(null);

    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          status: TaskStatus.DELIVERED,
          feedback: aiJson || t.workspaceFeedbackArch 
        };
      }
      return t;
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTask: WorkspaceTask = {
      id: "tsk-" + Date.now(),
      title,
      description,
      status: TaskStatus.BACKLOG,
      category,
      priority,
      dateUploaded: new Date().toISOString().split("T")[0]
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setDescription("");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleUpdateStatus = (id: string, newStatus: TaskStatus) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const handleSubmitFeedback = (id: string) => {
    const feedbackText = feedbackInput[id];
    if (!feedbackText || !feedbackText.trim()) return;

    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          return { 
            ...t, 
            feedback: feedbackText,
            status: TaskStatus.IN_PROGRESS // Re-open or keep on loop
          };
        }
        return t;
      })
    );

    setFeedbackInput({ ...feedbackInput, [id]: "" });
  };

  // Fun simulation mimicking a fast-paced OPC workflow check-in
  const triggerSimulation = async () => {
    const backlogTasks = tasks.filter((t) => t.status === TaskStatus.BACKLOG);
    if (backlogTasks.length === 0) {
      setSimMessage(language === "cn" ? "控制塔的‘待变现工单队列’已空。请先在左侧输入新构想，挂入开发队列！" : "No backlog items found! Please submit a new feature proposal first.");
      return;
    }

    setIsSimulating(true);
    const targetTask = backlogTasks[backlogTasks.length - 1]; // select oldest backlog task

    // Get current task localized title
    const activeTitle = getLocalizedTitle(targetTask);

    setSimMessage(language === "cn" 
      ? `[1/4] 🚀 正在锁定工单... 首席系统架构师已接单，正在为任务 "${activeTitle}" 申请独占开发锁...`
      : `[1/4] 🚀 Locking Task... Lead Architect took your order, acquiring focus lock for "${activeTitle}"...`
    );

    // Fetch AI response in the background while simulation ticks
    const aiResponsePromise = fetchTaskAIDelivery(targetTask);

    setTimeout(() => {
      // Step 2: In-progress
      setTasks(prev => prev.map(t => t.id === targetTask.id ? { ...t, status: TaskStatus.IN_PROGRESS } : t));
      setSimMessage(t.workspaceSimStep2);
      
      setTimeout(() => {
        // Step 3: Linting & verification mock
        setSimMessage(language === "cn"
          ? `[3/4] 🧪 临界收敛：完成自动化测试套件跑通，100% 静态编译成功，新功能开始向部署节点合流...`
          : `[3/4] 🧪 Compilation complete: all automated test suites passed, compiling 100% green, syncing sandbox branches...`
        );
        
        setTimeout(async () => {
          // Step 4: Delivered with real AI content
          const aiJson = await aiResponsePromise;
          setTasks(prev => prev.map(t => t.id === targetTask.id ? { 
            ...t, 
            status: TaskStatus.DELIVERED,
            feedback: aiJson || t.workspaceFeedbackArch
          } : t));
          setSimMessage(language === "cn"
            ? `[4/4] 🎁 OPC 部署成功！任务 "${activeTitle}" 已部署至沙箱，Loom 现场音视频演示与交付讲解已就绪。`
            : `[4/4] 🎁 OPC Sandbox Active! Task "${activeTitle}" deployed. Loom walkthrough and functional demonstration ready.`
          );
          setIsSimulating(false);
        }, 2200);
      }, 2000);
    }, 1800);
  };

  const getLocalizedTitle = (task: WorkspaceTask) => {
    if (task.id === "tsk-1") return language === "cn" ? "建立 AI 商品橱窗图像批量渲染脚本" : "AI Batch Showcase Image Batch Renderer";
    if (task.id === "tsk-2") return language === "cn" ? "集成 3 级支付折扣与退款 webhook 控制器" : "Tiered Stripe Subscriptions Webhook";
    if (task.id === "tsk-3") return language === "cn" ? "设计 SaaS 高转化炫酷 Landing 落地站" : "High-Converting Responsive Landing Page";
    if (task.id === "tsk-4") return language === "cn" ? "Firebase Auth 与多端微信扫码登陆打通" : "Firebase Auth & OAuth scanning integration";
    return task.title;
  };

  const getLocalizedDesc = (task: WorkspaceTask) => {
    if (task.id === "tsk-1") return language === "cn" ? "调用宿主 API，根据输入的产品背景关键词生成 4K 高分辨率海报图，并存储到本地资产目录。" : "Call generative diffusion APIs to assemble high-end product photos under different background prompts.";
    if (task.id === "tsk-2") return language === "cn" ? "编写后台支付网关 webhook，处理不同订阅层级的付费校验、到期暂停以及退款保护锁。" : "Construct custom backend Stripe webhook handlers managing subscriptions, tiered payments, and secure fraud protection.";
    if (task.id === "tsk-3") return language === "cn" ? "基于精简现代风，包含功能渐现动画、卡片滑过高光以及实时定价计算联动模块，提升注册率。" : "Build a modular responsive page with beautiful entry sequences, layout effects, and budget pricing slides.";
    if (task.id === "tsk-4") return language === "cn" ? "封装微信开放平台 API 登陆回调，实现独立站与微信公众号联合登录，并自动同步用户信息。" : "Integrate open OAuth callbacks, linking scans to core user collections and syncing user profiles safely.";
    return task.description;
  };

  const getCategoryLabel = (cat: TaskCategory) => {
    switch (cat) {
      case TaskCategory.AI_AUTOMATION:
        return language === "cn" ? "AI 自动化" : "AI Automate";
      case TaskCategory.CUSTOM_DEV:
        return language === "cn" ? "定制开发" : "Custom Dev";
      case TaskCategory.MARKETING_LANDING:
        return language === "cn" ? "炫酷落地页" : "Landing Page";
      case TaskCategory.SAAS_MVP:
        return language === "cn" ? "SaaS MVP" : "SaaS MVP";
    }
  };

  const getCategoryTheme = (cat: TaskCategory) => {
    switch (cat) {
      case TaskCategory.AI_AUTOMATION:
        return "bg-purple-50 text-purple-700 ring-purple-600/10";
      case TaskCategory.CUSTOM_DEV:
        return "bg-blue-50 text-blue-700 ring-blue-600/10";
      case TaskCategory.MARKETING_LANDING:
        return "bg-amber-50 text-amber-700 ring-amber-600/10";
      case TaskCategory.SAAS_MVP:
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";
    }
  };

  const getPriorityTheme = (prio: string) => {
    switch (prio) {
      case "high":
        return "text-red-700 bg-red-50 ring-red-600/10";
      case "medium":
        return "text-amber-700 bg-amber-50 ring-amber-600/10";
      case "low":
        return "text-zinc-600 bg-zinc-50 ring-zinc-500/10";
    }
  };

  return (
    <div id="workspace-hub-container" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Explanation Banner */}
      <div className="rounded-2xl bg-zinc-950 p-6 text-white mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] font-bold text-orange-500 tracking-widest uppercase">
              {t.workspaceBadge}
            </span>
            <h2 className="mt-2 font-sans text-xl font-bold">
              {t.workspaceTitle}
            </h2>
            <p className="mt-2 font-sans text-xs text-zinc-400 leading-relaxed">
              {t.workspaceDesc}
            </p>

            {/* Authentication Connection Status */}
            {user ? (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/20 rounded-lg">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="font-sans text-[11px] text-emerald-300 font-medium">
                  {language === "cn" 
                    ? `已绑定自智卡槽: ${user.username} (剩余 ${user.computeCredits.toLocaleString()} 算力点数)` 
                    : `Active Slot Connected: ${user.username} (${user.computeCredits.toLocaleString()} credits)`}
                </span>
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-500"></span>
                </span>
                <span className="font-sans text-[11px] text-zinc-400">
                  {language === "cn" 
                    ? "当前处于体验模式，未绑定账户" 
                    : "Using demo sandbox mode (unauthenticated)"}
                </span>
                <button
                  id="btn-workspace-login"
                  onClick={() => {
                    setAuthModalTab("login");
                    setIsAuthModalOpen(true);
                  }}
                  className="font-sans text-[11px] font-bold text-orange-400 hover:text-orange-300 cursor-pointer hover:underline"
                >
                  {language === "cn" ? "立即登录绑定算力 →" : "Connect Account →"}
                </button>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              id="simulation-trigger-btn"
              disabled={isSimulating}
              onClick={triggerSimulation}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3.5 font-sans text-xs font-semibold text-zinc-950 bg-orange-400 hover:bg-orange-300 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none`}
            >
              <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {t.workspaceSimBtn}
            </button>
          </div>
        </div>

        {simMessage && (
          <div className="mt-5 rounded-lg bg-orange-950/40 border border-orange-500/20 p-3.5">
            <p className="font-mono text-xs text-orange-400 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500 animate-bounce" />
              {simMessage}
            </p>
          </div>
        )}
      </div>

      {/* Grid: Task Form (1 Column) vs Kanban Board (3 Columns or grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Register Task Card (4 columns) */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
            <Plus className="h-5 w-5 text-orange-600" />
            <h3 className="font-sans text-sm font-bold text-zinc-900">
              {language === "cn" ? "提交微需求 (Backlog)" : "Add New Backlog Task"}
            </h3>
          </div>

          <form onSubmit={handleAddTask} className="mt-4 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                {language === "cn" ? "需求标题 (Title)" : "Task Title"}
              </label>
              <input
                id="task-form-title"
                type="text"
                placeholder={language === "cn" ? "例如: 集成 Stripe 订阅扣费弹窗" : "e.g., Integrate Stripe modal"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 font-sans text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                {language === "cn" ? "描述与交付期望 (Description)" : "Deliverables & Details"}
              </label>
              <textarea
                id="task-form-desc"
                rows={4}
                placeholder={language === "cn" ? "说明你要实现什么闭环核心页面，我们会根据此内容直接完成开发。" : "Specify exactly what needs to be constructed. The architect will implement according to these specifications."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 font-sans text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  {language === "cn" ? "业务类别" : "Category"}
                </label>
                <select
                  id="task-form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 font-sans text-xs text-zinc-750 focus:outline-none"
                >
                  <option value={TaskCategory.AI_AUTOMATION}>{language === "cn" ? "AI 自动化" : "AI Automate"}</option>
                  <option value={TaskCategory.SAAS_MVP}>{language === "cn" ? "SaaS MVP" : "SaaS MVP"}</option>
                  <option value={TaskCategory.MARKETING_LANDING}>{language === "cn" ? "炫酷落地页" : "Landing Page"}</option>
                  <option value={TaskCategory.CUSTOM_DEV}>{language === "cn" ? "定制开发" : "Custom Dev"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700">
                  {language === "cn" ? "优先级" : "Priority"}
                </label>
                <select
                  id="task-form-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 font-sans text-xs text-zinc-750 focus:outline-none"
                >
                  <option value="high">🔥 {language === "cn" ? "紧急" : "High"}</option>
                  <option value="medium">⚡ {language === "cn" ? "普通" : "Medium"}</option>
                  <option value="low">🌱 {language === "cn" ? "次要" : "Low"}</option>
                </select>
              </div>
            </div>

            <button
              id="form-add-task-btn"
              type="submit"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-sans text-xs font-bold text-white hover:bg-orange-700 shadow-sm transition-colors cursor-pointer"
            >
              {t.workspaceAddTaskBtn}
            </button>
          </form>

          {/* Quick instructions */}
          <div className="mt-6 rounded-xl bg-zinc-50 p-4 border border-zinc-150">
            <h4 className="font-sans text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              {language === "cn" ? "操作说明" : "How To Operate"}
            </h4>
            <p className="mt-1.5 font-sans text-[10px] text-zinc-500 leading-relaxed select-none">
              {language === "cn" ? (
                <>
                  1. 填写上方输入框并投递，新需求会立刻降临到 Backlog 需求池。<br/>
                  2. 点击顶部黄色模拟按钮，首席全栈将为您独占并发锁开始 48h 极速开发。<br/>
                  3. 卡片部署到沙箱交付区后，可在交付简报下输入修改微调意见，或直接点击发布合入。
                </>
              ) : (
                <>
                  1. Fill out the form above to add a new micro-task to the backlog queue.<br/>
                  2. Press the orange simulation button to watch the Lead Architect lock onto the card and develop it.<br/>
                  3. Once delivered, review the compiled sandbox results and submit revision requests or approve it live.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Columns: Kanban Stages (4 columns) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Column 1: Backlog */}
          <div className="rounded-xl bg-zinc-100/60 p-3 h-full">
            <div className="flex items-center justify-between px-1.5 py-1 mb-3">
              <span className="font-sans text-xs font-bold text-zinc-700">{t.workspaceColTodo}</span>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-600">
                {tasks.filter((t) => t.status === TaskStatus.BACKLOG).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.filter((t) => t.status === TaskStatus.BACKLOG).map((task) => (
                <div key={task.id} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-xs hover:border-zinc-300 transition-all select-none">
                  {/* Task Header */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${getCategoryTheme(task.category)}`}>
                      {getCategoryLabel(task.category)}
                    </span>
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${getPriorityTheme(task.priority)}`}>
                      {task.priority === "high" ? (language === "cn" ? "高" : "High") : task.priority === "medium" ? (language === "cn" ? "中" : "Medium") : (language === "cn" ? "低" : "Low")}
                    </span>
                  </div>

                  <h4 className="mt-2 font-sans text-xs font-bold text-zinc-900 leading-tight">
                    {getLocalizedTitle(task)}
                  </h4>
                  <p className="mt-1.5 font-sans text-[11px] text-zinc-500 leading-normal line-clamp-3">
                    {getLocalizedDesc(task)}
                  </p>

                  <div className="mt-3.5 pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <button
                      id={`action-start-dev-${task.id}`}
                      onClick={() => handleUpdateStatus(task.id, TaskStatus.IN_PROGRESS)}
                      className="inline-flex items-center gap-1 font-sans text-[10px] text-orange-600 font-bold hover:text-orange-700 text-left cursor-pointer"
                    >
                      {language === "cn" ? "领卡启动开发" : "Start Coding"}
                    </button>
                    <button
                      id={`action-delete-${task.id}`}
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-zinc-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="rounded-xl bg-orange-50/40 p-3 h-full border border-orange-100">
            <div className="flex items-center justify-between px-1.5 py-1 mb-3">
              <span className="font-sans text-xs font-semibold text-orange-700 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                {t.workspaceColProgress}
              </span>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 font-mono text-[10px] font-bold text-orange-700">
                {tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).map((task) => (
                <div key={task.id} className="rounded-xl border border-orange-200 bg-white p-3 shadow-xs">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${getCategoryTheme(task.category)}`}>
                      {getCategoryLabel(task.category)}
                    </span>
                    <span className="rounded-full bg-orange-600 h-2 w-2 mt-1.5 animate-ping" />
                  </div>

                  <h3 className="mt-2 font-sans text-xs font-bold text-zinc-900 leading-tight">
                    {getLocalizedTitle(task)}
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-500 line-clamp-3">
                    {getLocalizedDesc(task)}
                  </p>

                  <div className="mt-3 bg-orange-50/50 rounded p-1.5 border border-orange-100/30 text-[10px] text-orange-700 flex items-center gap-1.5 leading-tight">
                    <Zap className="h-3.5 w-3.5 animate-pulse" />
                    {t.workspaceEngineSpeed}
                  </div>

                  {/* Move down action */}
                  <div className="mt-4 pt-2 border-t border-zinc-100 flex justify-end">
                    <button
                      id={`action-deliver-${task.id}`}
                      disabled={deliveringTaskId === task.id}
                      onClick={() => handleDeliverTask(task.id)}
                      className="inline-flex items-center gap-1 rounded bg-orange-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-orange-700 cursor-pointer disabled:opacity-50"
                    >
                      {deliveringTaskId === task.id ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          {language === "cn" ? "编译生成中..." : "Compiling..."}
                        </>
                      ) : (
                        language === "cn" ? "完成开发并推入交付区" : "Sandbox Deploy & Deliver"
                      )}
                    </button>
                  </div>
                </div>
              ))}
              {tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length === 0 && (
                <p className="text-center font-sans text-[10px] text-zinc-400 py-6 italic select-none">
                  {language === "cn" ? "闲置队列。开启上方开发测试或手动锁卡。" : "Idle queue. Try simulation or move card manually."}
                </p>
              )}
            </div>
          </div>

          {/* Column 3: Delivered */}
          <div className="rounded-xl bg-zinc-100/60 p-3 h-full">
            <div className="flex items-center justify-between px-1.5 py-1 mb-3">
              <span className="font-sans text-xs font-bold text-zinc-700">{t.workspaceColDelivered}</span>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-600">
                {tasks.filter((t) => t.status === TaskStatus.DELIVERED).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks.filter((t) => t.status === TaskStatus.DELIVERED).map((task) => (
                <div key={task.id} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-xs">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${getCategoryTheme(task.category)}`}>
                      {getCategoryLabel(task.category)}
                    </span>
                  </div>

                  <h3 className="mt-2 font-sans text-xs font-semibold text-zinc-900 leading-tight">
                    {getLocalizedTitle(task)}
                  </h3>

                  {(() => {
                    let aiData: { summary: string; code: string; tips: string } | null = null;
                    if (task.feedback) {
                      try {
                        aiData = JSON.parse(task.feedback);
                      } catch (e) {
                        // Not JSON, just normal string feedback
                      }
                    }

                    if (aiData) {
                      return (
                        <div className="mt-3 space-y-3">
                          {/* Rich Delivery Notes */}
                          <div className="rounded border border-emerald-100 bg-emerald-50/10 p-2.5 text-[10px] font-sans">
                            <div className="flex items-center gap-1 text-emerald-700 font-bold mb-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                              {language === "cn" ? "全栈智能开发总结" : "AI Full-Stack Summary"}
                            </div>
                            <p className="text-zinc-600 leading-normal font-normal whitespace-pre-line text-[10px]">
                              {aiData.summary}
                            </p>
                          </div>

                          {/* Beautiful code viewer */}
                          <div className="rounded border border-zinc-200 bg-zinc-950 overflow-hidden font-mono text-[9px]">
                            <div className="bg-zinc-800/60 px-2 py-1 flex justify-between items-center border-b border-zinc-750 text-zinc-400">
                              <span className="flex items-center gap-1 font-bold text-[9px]">
                                <Code className="h-3 w-3 text-orange-400" />
                                {language === "cn" ? "闭环源码" : "Source Code"}
                              </span>
                              <button
                                onClick={() => {
                                  if (aiData?.code) {
                                    navigator.clipboard.writeText(aiData.code);
                                  }
                                }}
                                className="hover:text-white transition-colors cursor-pointer text-[8px] bg-zinc-700 px-1 py-0.2 rounded"
                              >
                                {language === "cn" ? "复制" : "Copy"}
                              </button>
                            </div>
                            <pre className="p-2 text-zinc-300 overflow-x-auto max-h-36 text-left leading-tight whitespace-pre">
                              <code>{aiData.code}</code>
                            </pre>
                          </div>

                          {/* Deploy tips */}
                          {aiData.tips && (
                            <div className="rounded border border-orange-100 bg-orange-50/20 p-2 text-[9px] text-zinc-600 font-sans leading-normal">
                              <span className="font-bold text-orange-700">⚡ {language === "cn" ? "部署上线建议：" : "Production Counsel:"}</span> {aiData.tips}
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      // Fallback: original classic static mockup view or plain string
                      return (
                        <div className="mt-3 rounded border border-orange-100 bg-orange-50/20 p-2 text-[10px]">
                          <div className="flex items-center gap-1 text-orange-600 font-bold mb-1">
                            <Video className="h-3.5 w-3.5" />
                            {language === "cn" ? "Loom 功能演示与交付复盘.mp4" : "Loom Delivery Demo & Walkthrough.mp4"}
                          </div>
                          <p className="italic text-zinc-500 font-sans leading-relaxed text-[10px] line-clamp-3">
                            {task.feedback || (language === "cn" ? "研发笔记: 基础功能完全连通。您可以在本卡片输入调整提议，我们会退回开发层。" : "Lead Architect: Core modules integrated. Write revision notes below or approve it.")}
                          </p>
                        </div>
                      );
                    }
                  })()}

                  {/* Feedback Form inside element */}
                  <div className="mt-3.5 pt-2.5 border-t border-zinc-100">
                    <input
                      id={`feedback-input-${task.id}`}
                      type="text"
                      placeholder={language === "cn" ? "有修改意见？在此留言重新锁卡开发" : "Any remarks? Write them here to edit"}
                      value={feedbackInput[task.id] || ""}
                      onChange={(e) => setFeedbackInput({ ...feedbackInput, [task.id]: e.target.value })}
                      className="w-full rounded border border-zinc-200 bg-zinc-50 p-1.5 font-sans text-[10px] text-zinc-750 focus:outline-none"
                    />
                    <div className="mt-2 flex justify-between gap-1">
                      <button
                        id={`feedback-submit-btn-${task.id}`}
                        onClick={() => handleSubmitFeedback(task.id)}
                        className="rounded border border-zinc-200 bg-white hover:bg-zinc-50 px-2 py-1 font-sans text-[9px] font-medium text-zinc-700 cursor-pointer"
                      >
                        {language === "cn" ? "退回微调" : "Request Edits"}
                      </button>
                      
                      <button
                        id={`feedback-approve-btn-${task.id}`}
                        onClick={() => handleUpdateStatus(task.id, TaskStatus.APPROVED)}
                        className="rounded bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 font-sans text-[9px] font-bold text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        <Check className="h-2.5 w-2.5" />
                        {language === "cn" ? "发布上线" : "Push Live"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Approved */}
          <div className="rounded-xl bg-emerald-50/30 p-3 h-full border border-emerald-100/50">
            <div className="flex items-center justify-between px-1.5 py-1 mb-3">
              <span className="font-sans text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {language === "cn" ? "已发布 / 正常运行 (Live)" : "Deployed & Live"}
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                {tasks.filter((t) => t.status === TaskStatus.APPROVED).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks.filter((t) => t.status === TaskStatus.APPROVED).map((task) => (
                <div key={task.id} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 shadow-2xs opacity-80 select-none">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded-sm px-1.5 py-0.2 font-mono text-[8px] text-emerald-700 bg-emerald-100/20`}>
                      {getCategoryLabel(task.category)}
                    </span>
                  </div>

                  <h3 className="mt-2 font-sans text-xs font-semibold text-zinc-650 line-through leading-tight">
                    {getLocalizedTitle(task)}
                  </h3>
                  <p className="mt-1 font-sans text-[10px] text-zinc-400 select-none">
                    {language === "cn" ? "部署成功:" : "Deployed:"} {task.dateUploaded}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ==============================================
          GTM LAUNCH & ICP DOMAIN FILING CONTROL CENTER
         ============================================== */}
      <div id="gtm-launch-icp-center" className="mt-16 rounded-3xl border border-zinc-200 bg-zinc-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        {/* Decorative ambient background mesh */}
        <div className="absolute top-0 right-0 h-96 w-96 bg-gradient-to-bl from-orange-500/10 to-amber-500/0 rounded-full blur-3xl pointer-events-none" />
        
        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-850 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-xs font-bold text-orange-400">
              <Globe className="h-3.5 w-3.5 animate-spin-slow text-orange-500" />
              {language === "cn" ? "OPC 智能上市部署中枢" : "OPC GTM Production Hub"}
            </div>
            <h3 className="mt-3 font-sans text-xl sm:text-2xl font-black tracking-tight text-white">
              {language === "cn" ? "一人公司生产域名与 ICP 备案核验中心" : "Production Domain & Legal ICP Filing Center"}
            </h3>
            <p className="mt-1.5 font-sans text-xs text-zinc-400">
              {language === "cn" 
                ? "当您的微需求全线跑通并发布上线，即可配置专属公网域名，系统将自动指引并模拟通信管理局（MIIT）合规备案与 DNS 高速解析。" 
                : "Once your tasks are delivered, bind your premium custom domain. The system simulates full-cycle legal registration and DNS propagation."}
            </p>
          </div>
          <button
            onClick={resetIcpFiling}
            className="flex-shrink-0 font-sans text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900 rounded-xl px-4 py-2.5 transition-all cursor-pointer"
          >
            {language === "cn" ? "重置备案进度 ↺" : "Reset Progress ↺"}
          </button>
        </div>

        {/* Visual Multi-Step Filing Process Tracker */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10 select-none">
          {[
            { stepNum: 1, name: language === "cn" ? "1. 域名规划" : "1. Domain Plan" },
            { stepNum: 2, name: language === "cn" ? "2. 实名设立" : "2. Real-Name ID" },
            { stepNum: 3, name: language === "cn" ? "3. 主机接入" : "3. Cloud Host" },
            { stepNum: 4, name: language === "cn" ? "4. 管局审核" : "4. MIIT Review" },
            { stepNum: 5, name: language === "cn" ? "5. 部署上线" : "5. System Live" }
          ].map((s) => (
            <div 
              key={s.stepNum} 
              className={`rounded-xl p-3 border transition-all ${
                icpStep === s.stepNum 
                  ? "bg-orange-500/10 border-orange-500/50 text-white shadow-md shadow-orange-500/5" 
                  : icpStep > s.stepNum 
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                  : "bg-zinc-900/60 border-zinc-850 text-zinc-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold">STEP 0{s.stepNum}</span>
                {icpStep > s.stepNum && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                {icpStep === s.stepNum && <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />}
              </div>
              <p className="mt-2 font-sans text-xs font-bold truncate">{s.name}</p>
            </div>
          ))}
        </div>

        {/* Error / Warning Alert Card */}
        {domainError && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/20 p-4 relative z-10 flex gap-3 items-start animate-pulse">
            <ShieldAlert className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans text-xs font-bold text-red-400">
                {language === "cn" ? "合规控制警报" : "Compliance Directive Alert"}
              </h4>
              <p className="mt-1 font-sans text-xs text-zinc-300 leading-relaxed">
                {domainError}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Workspace Area for Current Step */}
        <div className="mt-8 rounded-2xl border border-zinc-850 bg-zinc-900/40 p-5 sm:p-6 relative z-10">
          
          {/* STEP 1: Domain Plan Setup */}
          {icpStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-orange-500" />
                    {language === "cn" ? "一人公司预备上市域名 (Custom Domain)" : "Production Domain name"}
                  </label>
                  <p className="mt-1 text-[10px] text-zinc-500 leading-tight">
                    {language === "cn" ? "请输入您的商业独立域名（* 依规禁设 shifei.world 后缀）" : "Enter your premium domain (* strictly prohibits 'shifei.world')"}
                  </p>
                  <div className="mt-2 relative">
                    <input
                      id="input-production-domain"
                      type="text"
                      placeholder="e.g. opcvanguard.com"
                      value={productionDomain}
                      onChange={(e) => handleDomainChange(e.target.value)}
                      className={`w-full pl-3 pr-16 py-3 font-mono text-xs rounded-xl border bg-zinc-950/60 focus:outline-none transition-all ${
                        productionDomain.includes("shifei.world")
                          ? "border-red-500 text-red-400 focus:ring-1 focus:ring-red-500"
                          : "border-zinc-800 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      }`}
                    />
                    <div className="absolute right-3 top-3 font-mono text-[9px] font-bold text-zinc-500 uppercase">
                      .COM / .CEO
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-zinc-400" />
                    {language === "cn" ? "ICP 备案所属管局 (Legal Province)" : "Jurisdiction Authority Province"}
                  </label>
                  <p className="mt-1 text-[10px] text-zinc-500 leading-tight">
                    {language === "cn" ? "选择您一人公司的物理注册所属管局" : "Select physical registration base Province"}
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { key: "粤", name: language === "cn" ? "粤局 (Guangdong)" : "Guangdong" },
                      { key: "京", name: language === "cn" ? "京局 (Beijing)" : "Beijing" },
                      { key: "沪", name: language === "cn" ? "沪局 (Shanghai)" : "Shanghai" }
                    ].map((prov) => (
                      <button
                        key={prov.key}
                        type="button"
                        onClick={() => setIcpProvince(prov.key)}
                        className={`rounded-lg py-2.5 font-sans text-xs font-semibold border transition-all cursor-pointer ${
                          icpProvince === prov.key
                            ? "bg-orange-500/10 border-orange-500/60 text-orange-400 font-bold"
                            : "bg-zinc-950/20 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                        }`}
                      >
                        {prov.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-850/60">
                <div>
                  <label className="block font-sans text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Fingerprint className="h-4 w-4 text-zinc-400" />
                    {language === "cn" ? "备案申办主体类型 (Registrant Type)" : "Registrant Entity Type"}
                  </label>
                  <div className="mt-2.5 flex gap-3">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="registrantType"
                        checked={registrantType === "personal"}
                        onChange={() => {
                          setRegistrantType("personal");
                          setRegistrantName(user ? user.username : "独立主权开发者");
                        }}
                        className="accent-orange-500 h-4 w-4"
                      />
                      <span>{language === "cn" ? "个人备案 (Solopreneur)" : "Personal (Individual)"}</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="registrantType"
                        checked={registrantType === "enterprise"}
                        onChange={() => {
                          setRegistrantType("enterprise");
                          setRegistrantName("深圳一人主权科技有限公司");
                        }}
                        className="accent-orange-500 h-4 w-4"
                      />
                      <span>{language === "cn" ? "企业备案 (Enterprise LLC)" : "Enterprise (Corporation)"}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-zinc-300">
                    {language === "cn" ? "申办主体全称 (Full Entity Legal Name)" : "Full Registered Legal Name"}
                  </label>
                  <input
                    id="input-registrant-name"
                    type="text"
                    value={registrantName}
                    onChange={(e) => setRegistrantName(e.target.value)}
                    className="mt-2 w-full px-3 py-2.5 font-sans text-xs rounded-xl border border-zinc-850 bg-zinc-950/60 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  id="btn-icp-proceed-step1"
                  disabled={!!domainError || !productionDomain}
                  onClick={startIcpFilingSimulation}
                  className="rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:pointer-events-none px-6 py-3 font-sans text-xs font-bold text-white shadow-lg shadow-orange-600/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  {language === "cn" ? "核验合规性，进入材料初审 →" : "Check Compliance, Enter Review →"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Identity Verification */}
          {icpStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-850 pb-4">
                <Fingerprint className="h-6 w-6 text-orange-500" />
                <div>
                  <h4 className="font-sans text-sm font-bold text-white">
                    {language === "cn" ? "管局线上实名认证 (MIIT Identity Real-Name Verify)" : "MIIT Real-Name Identity Verification"}
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    {language === "cn" 
                      ? "按照互联网管理条例，个人备案需核验二代身份证并完成人脸识别；企业备案需提交营业执照统一社会信用代码。" 
                      : "Regulatory codes require individual registrants to upload ID documents or Business Licenses and pass digital review."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload Area */}
                <div className="rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950/40 p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-20 rounded border border-zinc-700 bg-zinc-900/60 flex items-center justify-center text-zinc-500 mb-4 select-none">
                    <FileText className="h-6 w-6 text-zinc-500" />
                  </div>
                  <span className="font-sans text-xs font-bold text-zinc-300">
                    {registrantType === "personal" 
                      ? (language === "cn" ? "中国居民身份证（人像面）上传" : "National ID Card Upload") 
                      : (language === "cn" ? "营业执照正本原件拍照上传" : "Corporate Business License Upload")}
                  </span>
                  <p className="mt-1 text-[10px] text-zinc-500 max-w-xs">
                    {language === "cn" ? "支持 JPG/PNG/PDF，确保四周无反光与裁切" : "Ensure file is legible with clear margins"}
                  </p>
                  
                  {/* Mock Image Placeholder */}
                  <div className="mt-4 rounded-lg bg-zinc-900 border border-zinc-850 p-2.5 flex items-center gap-3 w-full max-w-xs">
                    <div className="h-8 w-8 rounded-full bg-orange-600/20 text-orange-500 flex items-center justify-center text-[10px] font-bold">
                      PDF
                    </div>
                    <div className="text-left">
                      <p className="font-mono text-[9px] font-bold text-zinc-300 truncate">
                        {registrantType === "personal" ? "identity_card_verified.jpg" : "business_license_certified.png"}
                      </p>
                      <span className="font-sans text-[8px] text-emerald-400 font-semibold">✓ {language === "cn" ? "智能 OCR 读取成功" : "OCR Extraction Successful"}</span>
                    </div>
                  </div>
                </div>

                {/* Registration Data */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400">
                      {language === "cn" ? "申办主体人/企业主体名称" : "Authorized Legal Entity / Individual"}
                    </label>
                    <p className="mt-1 font-sans text-xs text-white font-bold">{registrantName}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400">
                      {registrantType === "personal" 
                        ? (language === "cn" ? "身份证证件号码 (ID Card Number)" : "ID Card Number") 
                        : (language === "cn" ? "统一社会信用代码 (Unified Social Code)" : "Social Credit License Number")}
                    </label>
                    <input
                      id="input-registrant-id-num"
                      type="text"
                      placeholder={registrantType === "personal" ? "例如: 44030119950718XXXX" : "例如: 91440300MA5XXXXXXX"}
                      value={registrantIdNum}
                      onChange={(e) => setRegistrantIdNum(e.target.value)}
                      className="mt-1.5 w-full px-3 py-2.5 font-mono text-xs rounded-lg border border-zinc-800 bg-zinc-950/60 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Simulated Face Scan Camera Check */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-sans text-[11px] text-zinc-300 font-bold">
                        {language === "cn" ? "管局电子化幕布人脸核验 (Face-Recognition Scan)" : "Automated Live Camera Scan (IFrame Compliant)"}
                      </span>
                    </div>
                    <p className="mt-1 text-[9px] text-zinc-500">
                      {language === "cn" ? "已关联手机管局小程序，免拉起前置摄像头，直接绑定您的国家实人数据。" : "Real-name verification is linked directly via cellular verification records."}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-emerald-400 font-bold px-1 bg-emerald-950/30 py-1.5 rounded-lg border border-emerald-900/30">
                      <span>✓ {language === "cn" ? "全国自然人库核对一致" : "Matched with registry successfully"}</span>
                      <span className="text-[9px] bg-emerald-600 text-white px-1 py-0.2 rounded">Passed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between border-t border-zinc-850/60">
                <button
                  type="button"
                  onClick={() => setIcpStep(1)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white px-5 py-2.5 font-sans text-xs cursor-pointer"
                >
                  {language === "cn" ? "← 返回上一步" : "← Previous Step"}
                </button>
                <button
                  id="btn-icp-proceed-step2"
                  disabled={!registrantIdNum}
                  onClick={handleCompleteVerification}
                  className="rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:pointer-events-none px-6 py-3 font-sans text-xs font-bold text-white shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {language === "cn" ? "证件校验通过, 下一步: 服务器核验" : "ID Verified, Next: Server Mapping"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Server Access Code Mapping */}
          {icpStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-850 pb-4">
                <Server className="h-6 w-6 text-orange-500" />
                <div>
                  <h4 className="font-sans text-sm font-bold text-white">
                    {language === "cn" ? "绑定国内物理服务器 (Bind ICP Server Instance)" : "Cloud Hosting & Access Key Assignment"}
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    {language === "cn" 
                      ? "所有在大陆合规运行的域名必须绑定一台购买期大于3个月的大陆物理云服务器（如阿里云、腾讯云等），并通过生成备案服务号接入管局系统。" 
                      : "ICP policies require matching a hosting server (Alibaba/Tencent/Huawei Cloud) with active duration, binding via Server Access Code."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "ali", name: "阿里云 (Alibaba Cloud)", ip: "121.40.88.99", loc: "Hangzhou" },
                  { id: "tx", name: "腾讯云 (Tencent Cloud)", ip: "139.196.40.22", loc: "Shanghai" },
                  { id: "hw", name: "华为云 (Huawei Cloud)", ip: "119.3.22.88", loc: "Beijing" }
                ].map((cloud) => (
                  <div key={cloud.id} className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold text-white">{cloud.name}</span>
                      <span className="text-[8px] font-mono bg-orange-600/20 text-orange-500 px-1 rounded uppercase">Active Host</span>
                    </div>
                    <div className="mt-4 space-y-1 font-mono text-[10px] text-zinc-400">
                      <p>IP Address: {cloud.ip}</p>
                      <p>Region: China ({cloud.loc})</p>
                    </div>
                    
                    {/* Simulated access code */}
                    <div className="mt-4 pt-3 border-t border-zinc-850/60 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500 font-sans">备案服务号 (Code):</span>
                      <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">sc-7a8f9d0c2e</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-orange-500/10 bg-orange-950/10 p-4">
                <p className="font-sans text-xs text-zinc-300 leading-relaxed">
                  💡 <span className="font-bold text-orange-400">{language === "cn" ? "独占性合规告知：" : "Compliance Guidance:"}</span> 
                  {language === "cn" 
                    ? "由于您的一人公司平台完全遵循微秒级冷启动部署架构，备案服务器号已通过我们平台的专线接口自动配齐，无需您额外花费数千元购买国内服务器套餐。" 
                    : "The platform's cloud routing connects automatically; we generate compliant server registration codes instantly."}
                </p>
              </div>

              <div className="pt-4 flex justify-between border-t border-zinc-850/60">
                <button
                  type="button"
                  onClick={() => setIcpStep(2)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white px-5 py-2.5 font-sans text-xs cursor-pointer"
                >
                  {language === "cn" ? "← 返回上一步" : "← Previous Step"}
                </button>
                <button
                  id="btn-icp-proceed-step3"
                  onClick={handleCompleteServerBinding}
                  className="rounded-xl bg-orange-600 hover:bg-orange-500 px-6 py-3 font-sans text-xs font-bold text-white shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {language === "cn" ? "生成接入号, 提交通信管理局终审" : "Bind Server, Submit to State Board"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: State Bureau Audit Wait Screen */}
          {icpStep === 4 && (
            <div className="space-y-6 text-center py-8">
              <div className="relative inline-flex items-center justify-center">
                <RefreshCw className="h-16 w-16 text-orange-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[10px] text-white font-bold">{filingProgressPct}%</span>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <h4 className="font-sans text-base font-bold text-white">
                  {language === "cn" ? "正在呈送国家通信管理局终审..." : "MIIT National Registration Authority Audit..."}
                </h4>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  {language === "cn" 
                    ? `您的备案工单已送入管局审核专席。正在验证公网解析可用性、物理接入一致性与网络内容分类。通常需要 1-3 周的法定终审，在智能一人公司中，此过程通过专线进行微秒级全自动加速校验！` 
                    : "Your application is submitted. Validating registrant credentials and DNS records. The system is automatically prioritizing approval."}
                </p>
              </div>

              {/* simulated logs */}
              <div className="max-w-lg mx-auto rounded-xl border border-zinc-850 bg-zinc-950/80 p-3.5 text-left font-mono text-[10px] text-zinc-400 space-y-1 select-none">
                <p className="text-zinc-500">[11:32:01] Submitting package to Beijing MIIT gateway...</p>
                <p className="text-zinc-500">[11:32:02] Matching Domain {productionDomain} registry record...</p>
                <p className="text-orange-400">[11:32:02] CHECK COMPLETE: Domain shifei.world excluded &rarr; OK (Passed)</p>
                <p className="text-emerald-400">[11:32:03] Registrant: {registrantName} &rarr; Verified against Citizen Database</p>
                <p className="text-zinc-300">[11:32:04] Reviewing IP network access routes &rarr; Cloud Instance matched</p>
                <p className="text-emerald-400 animate-pulse">[11:32:04] System compiling final authorization license...</p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-xs mx-auto">
                <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${filingProgressPct}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Live DNS Config & PING Verification */}
          {icpStep === 5 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-4">
                <div className="flex items-center gap-3">
                  <Wifi className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans text-sm font-bold text-white">
                      {language === "cn" ? "管局审核通过！生产级 DNS 指向配置" : "Audit Approved! Production DNS Routing"}
                    </h4>
                    <p className="text-[10px] text-zinc-400">
                      {language === "cn" 
                        ? `您的域名备案已成功下发。备案号: ${icpFilingId || "粤ICP备20268848号-1"}。请前往域名解析后台配置以下记录以激活公网。` 
                        : `ICP Filing approved! Approved License: ${icpFilingId || "ICP-20268848"}. Configure DNS mappings below.`}
                    </p>
                  </div>
                </div>
                
                <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-center flex-shrink-0">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">Approved Filing ID</span>
                  <p className="font-mono text-xs text-emerald-400 font-black">{icpFilingId || "粤ICP备20260701号-1"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Table of DNS records */}
                <div className="lg:col-span-7 space-y-4">
                  <span className="font-sans text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    {language === "cn" ? "需配置的公网 DNS 记录表" : "Required DNS Mappings"}
                  </span>
                  
                  <div className="rounded-xl border border-zinc-850 overflow-hidden font-mono text-[10px]">
                    <div className="grid grid-cols-4 bg-zinc-900 px-3 py-2 text-zinc-400 font-bold">
                      <div>Type</div>
                      <div>Name</div>
                      <div>Value</div>
                      <div className="text-right">TTL</div>
                    </div>
                    <div className="divide-y divide-zinc-850">
                      <div className="grid grid-cols-4 px-3 py-3 text-white">
                        <div className="text-orange-400 font-bold">A</div>
                        <div className="text-zinc-300">@</div>
                        <div className="truncate">121.40.88.99</div>
                        <div className="text-zinc-400 text-right">600s</div>
                      </div>
                      <div className="grid grid-cols-4 px-3 py-3 text-white">
                        <div className="text-orange-400 font-bold">A</div>
                        <div className="text-zinc-300">www</div>
                        <div className="truncate">121.40.88.99</div>
                        <div className="text-zinc-400 text-right">600s</div>
                      </div>
                      <div className="grid grid-cols-4 px-3 py-3 text-white">
                        <div className="text-emerald-400 font-bold">TXT</div>
                        <div className="text-zinc-300">_icp-id</div>
                        <div className="truncate text-zinc-400 select-all" title={icpFilingId || "粤ICP备20260701号-1"}>
                          {icpFilingId || "粤ICP备20260701号-1"}
                        </div>
                        <div className="text-zinc-400 text-right">Auto</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-850 text-xs text-zinc-300">
                    <p className="leading-relaxed">
                      {language === "cn" 
                        ? `🎉 您的专属上市系统已经准备就绪。解析生效后，全球用户即可通过 https://${productionDomain} 安全直连您由一名主权开发者打造的高效生产力系统。` 
                        : `🎉 Your OPC system is fully ready for deployment. Global users can visit https://${productionDomain} securely once resolution completes.`}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      id="btn-dns-ping-verify"
                      disabled={dnsTesting || dnsVerified}
                      onClick={handleVerifyDNS}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 px-5 py-3 font-sans text-xs font-bold text-white shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {dnsTesting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          {language === "cn" ? "公网网络测速与连通性自测中..." : "Simulating Global Resolution..."}
                        </>
                      ) : dnsVerified ? (
                        "✓ DNS 连通性校验成功"
                      ) : (
                        language === "cn" ? "连通性公网测试 (PING & Resolve)" : "Test Resolution & PING"
                      )}
                    </button>
                  </div>
                </div>

                {/* Right: Embedded Terminal console */}
                <div className="lg:col-span-5 rounded-2xl border border-zinc-850 bg-zinc-950 p-4 font-mono text-[10px] leading-relaxed text-zinc-300 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-2 text-zinc-500">
                      <span className="flex items-center gap-1 font-bold">
                        <Terminal className="h-3.5 w-3.5 text-zinc-500" />
                        OPC-Terminal V2.6
                      </span>
                      <span className="text-[9px] bg-zinc-900 px-1.5 py-0.2 rounded text-zinc-600">LIVE SHELL</span>
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-48 text-left">
                      {dnsLogs.length === 0 ? (
                        <p className="text-zinc-600 italic">
                          {language === "cn" ? "等待连通性命令启动... 点击左侧测试按钮运行 ping 测试" : "Waiting for dns diagnostics... Press Test Resolution"}
                        </p>
                      ) : (
                        dnsLogs.map((log, idx) => (
                          <p 
                            key={idx} 
                            className={
                              log.includes("[SUCCESS]") 
                                ? "text-emerald-400 font-bold" 
                                : log.includes("[ICP-CHECK]")
                                ? "text-orange-400"
                                : "text-zinc-300"
                            }
                          >
                            {log}
                          </p>
                        ))
                      )}
                    </div>
                  </div>

                  {dnsVerified && (
                    <div className="mt-4 pt-3 border-t border-zinc-850/60 text-center animate-fade-in">
                      <span className="inline-block rounded bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-sans text-[10px] font-bold text-emerald-400 select-all">
                        {language === "cn" ? `https://${productionDomain} 安全连通！` : `https://${productionDomain} Secured & Live!`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Certificate Display on success */}
        {dnsVerified && (
          <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 p-6 sm:p-8 relative z-10 text-center flex flex-col items-center justify-center animate-fade-in select-none">
            {/* Glowing gold medal icon */}
            <div className="relative h-16 w-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/25">
              <CheckCircle className="h-9 w-9 text-white" />
              <div className="absolute inset-0 bg-white rounded-full opacity-10 animate-ping" />
            </div>

            <h3 className="mt-5 font-sans text-lg sm:text-xl font-black text-amber-400 tracking-tight">
              {language === "cn" ? "🎉 恭喜！您的一人公司独立系统已成功「上市运行」！" : "🎉 Congratulations! Your One-Person System is Officially Live!"}
            </h3>
            <p className="mt-2 font-sans text-xs text-zinc-300 max-w-xl leading-relaxed">
              {language === "cn" 
                ? `域名 ${productionDomain} 已完成合法人脸校验与各省管局终审注册，并匹配生产级 A 记录指向公网容器。备案许可号 ${icpFilingId || "粤ICP备20260701号-1"}。您的一人公司商业帝国正在全面起航！`
                : `Domain ${productionDomain} is verified under Registration License ${icpFilingId || "ICP-2026"}. The production pipeline is active and routing global live traffic.`}
            </p>
            
            {/* Certificate detail lines */}
            <div className="mt-6 w-full max-w-md rounded-2xl border border-zinc-850 bg-zinc-950/60 p-4 font-mono text-[10px] text-zinc-400 space-y-2 text-left">
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span>Registrant Entity</span>
                <span className="text-white font-bold">{registrantName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span>Domain Address</span>
                <span className="text-white font-bold">{productionDomain}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span>ICP Registry ID</span>
                <span className="text-emerald-400 font-bold">{icpFilingId || "粤ICP备20260701号-1"}</span>
              </div>
              <div className="flex justify-between">
                <span>Filing Authority</span>
                <span className="text-white font-bold">{language === "cn" ? `中国工信部（MIIT ${icpProvince}局）` : "MIIT National Registry"}</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
