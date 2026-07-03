/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArchitectProposal, 
  SprintInfo, 
  MonetizationStrategy 
} from "../types";
import { 
  Zap, 
  Layers, 
  Code, 
  Send, 
  Activity, 
  FileText, 
  Clock, 
  HelpCircle, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle,
  TrendingDown
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function AIEstimator() {
  const { language, t } = useLanguage();
  const [idea, setIdea] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [proposal, setProposal] = useState<ArchitectProposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = language === "cn" ? [
    "正在初始化 OPC 核心计算引擎...",
    "正在测定 MVP 临界阀值，削减系统冗余...",
    "正在合成 4 周 OPC 交付脉络与关键里程碑指标...",
    "正在编排 全球最高效的单兵工具链与极简 Serverless 架构...",
    "正在测算 商业变现漏斗与用户终身价值收益系数...",
    "系统架构方案合成完毕！已呈递至 OPC 控制面板。"
  ] : [
    "Initializing OPC core calculation engine...",
    "Calibrating MVP critical threshold & pruning system redundancy...",
    "Synthesizing 4-week OPC delivery timelines and core milestones...",
    "Assembling hyper-efficient single-person tech stacks and serverless layers...",
    "Estimating monetization funnel metrics and LTV coefficients...",
    "Architecture proposal synthesized! Dispatching to your control panel."
  ];

  const handleRunArchitect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    setProposal(null);
    setLoadingStep(0);

    // Incremental loading messages ticker to assure client during fast inference
    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, context, language })
      });

      if (!res.ok) {
        throw new Error(language === "cn" ? "服务端架构模块响应异常，请稍微重试。" : "The server architecture engine responded with an error, please retry.");
      }

      const data = await res.json();
      setProposal(data as ArchitectProposal);
    } catch (err: any) {
      console.error("Architect submission error:", err);
      setError(err?.message || (language === "cn" ? "无法连接到 AI 规划服务，请检查网络后再试。" : "Unable to reach the AI design service, please verify your connection."));
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Simple":
      case "简单":
        return "text-emerald-700 bg-emerald-50 ring-emerald-600/10";
      case "Moderate":
      case "中等":
        return "text-blue-700 bg-blue-50 ring-blue-600/10";
      case "Complex":
      case "复杂":
        return "text-purple-700 bg-purple-50 ring-purple-600/10";
      default:
        return "text-zinc-650 bg-zinc-50 ring-zinc-500/10";
    }
  };

  return (
    <div id="ai-estimator-root" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Intro section */}
      <div className="border-b border-zinc-200 pb-8">
        <h2 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
          {t.estimatorTitle}
        </h2>
        <p className="mt-2 text-xs md:text-sm text-zinc-500 leading-relaxed">
          {t.estimatorDesc}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        
        {/* Left column: Idea form (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-150 pb-4">
            <Send className="h-5 w-5 text-orange-600" />
            <h3 className="font-sans text-sm font-bold text-zinc-900">
              {language === "cn" ? "注入我的业务构想" : "Inject My Business Idea"}
            </h3>
          </div>

          <form onSubmit={handleRunArchitect} className="mt-5 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                {language === "cn" ? "项目一句话描述 (SaaS, AI 自动化, 落地页)" : "Project Description (SaaS, AI Automation, Landing Page)"}
              </label>
              <textarea
                id="estimator-idea-input"
                rows={4}
                placeholder={language === "cn" ? "例如:「为本地中小型宠物店，定制开发一个微信小程序。集成了AI推荐宠物粮算法，还支持用户发布自己的猫咪日常照片，有后台管理控制台。」" : "e.g., 'An intelligent sleep app. Users choose a mood, and the system automatically generates soundscapes. Includes subscription-locked tiers.'"}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-sans text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700">
                {language === "cn" ? "补充上下文 (目标客户群、所需功能等，可选)" : "Additional Context (Target audience, vital integrations, optional)"}
              </label>
              <input
                id="estimator-context-input"
                type="text"
                placeholder={language === "cn" ? "例如: 目标客群主要是新手猫狗家长，需要对接微信支付，希望能在一周内快速验证。" : "e.g., Targets white-collar workers; needs elegant dark theme; Stripe billing."}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 font-sans text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              id="submit-estimator-btn"
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-4 py-3.5 font-sans text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  {language === "cn" ? "AI 测算中..." : "AI Planning..."}
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-white" />
                  {t.estimatorBtn}
                </>
              )}
            </button>
          </form>

          {/* Quick Ideas Sandbox Recommendation */}
          <div className="mt-8 border-t border-zinc-150 pt-5">
            <p className="font-sans text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
              {language === "cn" ? "可以点击快速填入测试示例：" : "Click to inject pre-configured examples:"}
            </p>
            <div className="mt-3 space-y-2">
              <button
                id="preset-idea-1"
                type="button"
                onClick={() => {
                  setIdea(language === "cn" 
                    ? "智能睡眠音频引擎。用户选择当前专注或者是入睡意图，系统自动在网页播放基于其心境生成的 AI 平静音效，可以用邮箱注册，支持微信支付续订。"
                    : "Intelligent focus & sleep audio engine. Users select their current target activity, and the system dynamically plays AI-generated soundscapes. Email signups with billing included.");
                  setContext(language === "cn"
                    ? "针对经常失眠的白领人群，希望能有个极极简优雅的单页暗黑风主题。"
                    : "Targeting hyper-busy tech professionals; needs a clean, sleek dark-themed responsive single-page web application.");
                }}
                className="w-full text-left rounded-lg border border-zinc-100 bg-zinc-50 p-2.5 font-sans text-[11px] text-zinc-600 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer"
              >
                {language === "cn" ? (
                  <>💡 示例一: <strong>智能意图睡眠音频 SaaS</strong></>
                ) : (
                  <>💡 Example 1: <strong>Acoustic Focus SaaS</strong></>
                )}
              </button>

              <button
                id="preset-idea-2"
                type="button"
                onClick={() => {
                  setIdea(language === "cn"
                    ? "跨境电商独立站 AI 邮件营销助手。自动连接店铺 API 提取流失订单，针对没完成付款的订单自动撰写英文挽回邮件并群发邮件，生成统计漏斗报表。"
                    : "AI email marketing workflow assistant for cross-border e-commerce. Automatically hooks into shop APIs, extracts abandoned checkouts, writes recovery emails, and displays analytics.");
                  setContext(language === "cn"
                    ? "主要是北美 Shopify 店主使用，希望能有一个直观的 Trello 协作看板追踪邮件发送记录。"
                    : "Principally utilized by Shopify merchants; requires a simple Trello-like card view tracker for email delivery status.");
                }}
                className="w-full text-left rounded-lg border border-zinc-100 bg-zinc-50 p-2.5 font-sans text-[11px] text-zinc-600 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer"
              >
                {language === "cn" ? (
                  <>💡 示例二: <strong>AI 跨境店铺流失挽回助手</strong></>
                ) : (
                  <>💡 Example 2: <strong>E-Commerce Retargeting AI</strong></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Dynamic Results Panel (7 cols) */}
        <div className="lg:col-span-7 h-full">

          {/* 1. Normal/Empty State */}
          {!loading && !proposal && !error && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center h-[524px] flex flex-col justify-center items-center">
              <FileText className="h-12 w-12 text-zinc-300 stroke-1" />
              <h3 className="mt-4 font-sans text-sm font-semibold text-zinc-900">
                {language === "cn" ? "等待注入蓝图灵感" : "Waiting for Project Inspiration"}
              </h3>
              <p className="mt-1.5 max-w-sm font-sans text-xs text-zinc-500 leading-relaxed">
                {language === "cn" 
                  ? "在左侧控制台填入构思或直接点击“快速注入测试示例”，首席助理会根据 OPC 产品化服务的思维体系进行超高精度拆解。" 
                  : "Input your project idea or select one of the templates. Our Lead Architect will analyze your scope under an ultra-lean OPC lens."}
              </p>
            </div>
          )}

          {/* 2. Loading State */}
          {loading && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center h-[524px] flex flex-col justify-center items-center font-sans">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-20" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Activity className="h-6 w-6 animate-spin" />
                </div>
              </div>
              <h3 className="mt-6 font-sans text-sm md:text-base font-bold text-zinc-900">
                {language === "cn" ? "正在绘制 OPC 一人公司特制架构蓝图" : "Drafting your custom OPC Project Blueprint"}
              </h3>
              <p className="mt-2 max-w-sm font-mono text-[11px] text-orange-600 font-medium">
                {loadingMessages[loadingStep]}
              </p>
              <div className="mt-6 w-48 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-600 h-1.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* 3. Error Case */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center">
              <ShieldAlert className="mx-auto h-12 w-12 text-red-500 animate-bounce" />
              <h3 className="mt-4 font-sans text-sm font-bold text-zinc-900">
                {language === "cn" ? "测算规划模块出现问题" : "An error occurred during calculations"}
              </h3>
              <p className="mt-2 font-sans text-xs text-red-600">{error}</p>
              <button
                id="reset-estimator-error"
                onClick={() => setError(null)}
                className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 font-sans text-xs font-semibold text-white hover:bg-zinc-800 cursor-pointer"
              >
                {language === "cn" ? "返回重新输入" : "Go Back & Re-try"}
              </button>
            </div>
          )}

          {/* 4. Complete Proposal Presentation Card */}
          {proposal && (
            <div className="space-y-6">
              
              {/* Giant App Details Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-orange-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2">
                  <span className="rounded bg-orange-50 px-2 py-0.5 font-mono text-[10px] font-black text-orange-600">
                    {language === "cn" ? "MVP 推荐命名" : "Recommended MVP Name"}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">Target Beachhead: {proposal.targetMarket}</span>
                </div>
                <h3 className="mt-3 font-sans text-xl md:text-2xl font-black text-zinc-900 leading-tight">
                  {proposal.appName}
                </h3>
                <p className="mt-1 font-sans text-xs font-semibold text-orange-600">
                  {proposal.tagline}
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {language === "cn" ? "4周精益核心研发范围 (Core Scope):" : "4-Week Lean Core Scope:"}
                  </p>
                  <p className="mt-1.5 font-sans text-xs text-zinc-600 leading-relaxed">
                    {proposal.mvpCoreScope}
                  </p>
                </div>
              </div>

              {/* 4-Week Sprint Progress Canvas */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
                <h4 className="font-sans text-sm font-bold text-zinc-900 flex items-center gap-1.5 pb-4 border-b border-zinc-100">
                  <Clock className="h-4.5 w-4.5 text-orange-600" />
                  {t.estimatorSprintTitle}
                </h4>

                <div className="mt-6 space-y-6">
                  {proposal.sprints.map((sprint, idx) => (
                    <div key={idx} className="relative pl-6 border-l border-zinc-200">
                      {/* Timeline dot */}
                      <div className="absolute -left-1.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-orange-600 ring-4 ring-white" />
                      
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-orange-600">WEEK {sprint.week}</span>
                          <h5 className="font-sans text-xs font-bold text-zinc-900">{sprint.title}</h5>
                        </div>
                        <span className={`rounded-full px-2 py-0.2 font-mono text-[9px] font-bold ${getDifficultyColor(sprint.difficulty)}`}>
                          {sprint.difficulty}
                        </span>
                      </div>

                      {/* Tasks of Week */}
                      <ul className="mt-3.5 space-y-2 select-none">
                        {sprint.tasks.map((task, j) => (
                          <li key={j} className="flex gap-2 text-xs text-zinc-600 leading-normal">
                            <span className="text-orange-500 font-mono select-none">•</span>
                            <span className="font-sans">{task}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Weekly Deliverable */}
                      <div className="mt-3.5 rounded-lg bg-zinc-50 p-2.5 border border-zinc-150 text-[11px] text-zinc-700">
                        <span className="font-semibold text-zinc-900">
                          {language === "cn" ? "验收交付物:" : "Weekly Deliverable:"}
                        </span> {sprint.deliverable}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack & Monetization Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Tech selection microcard */}
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs">
                  <h4 className="font-sans text-xs font-bold text-zinc-900 flex items-center gap-1.5 pb-3 border-b border-zinc-100">
                    <Code className="h-4 w-4 text-orange-600" />
                    {language === "cn" ? "高速单兵技术选型" : "Solo-Developer Tech Selection"}
                  </h4>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {proposal.techStack.map((tech, i) => (
                      <span key={i} className="rounded bg-zinc-50 border border-zinc-200/60 px-2 py-1 font-mono text-[10px] text-zinc-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 font-sans text-[10px] leading-relaxed text-zinc-500 select-none">
                    {language === "cn" 
                      ? "推荐基于极轻量、Serverless 以及成熟组件库设计，防止在复杂运维中浪费精力，保障 1 周完成上线交付。" 
                      : "Leveraging serverless architectures and component assemblies avoids operational fatigue, keeping your time-to-market under a single week."}
                  </p>
                </div>

                {/* Custom monetization suggestions */}
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs">
                  <h4 className="font-sans text-xs font-bold text-zinc-900 flex items-center gap-1.5 pb-3 border-b border-zinc-100">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    {language === "cn" ? "商业化冷启动定价建议" : "Monetization & Pricing Suggestions"}
                  </h4>
                  <div className="mt-3 space-y-3.5">
                    {proposal.monetizationModels.map((model, i) => (
                      <div key={i} className="text-left border-b border-zinc-50/50 pb-2">
                        <div className="flex justify-between items-baseline">
                          <span className="font-sans text-xs font-bold text-orange-600 leading-none">{model.modelName}</span>
                          <span className="font-mono text-xs font-extrabold text-zinc-900 leading-none">{model.pricingTier}</span>
                        </div>
                        <p className="mt-1 font-sans text-[10px] text-zinc-500 leading-relaxed">
                          {model.fitExplanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* OPC Financial Advantage Card */}
              <div className="rounded-2xl bg-orange-600/5 border border-orange-500/20 p-6">
                <span className="font-mono text-[9px] font-bold text-orange-600 uppercase tracking-widest">
                  {language === "cn" ? "一人公司 效率架构分析结论" : "OPC Architectural Efficiency Conclusion"}
                </span>
                <h4 className="mt-1.5 font-sans text-sm md:text-base font-bold text-zinc-900">
                  {language === "cn" ? "相比雇用传统 5 人外包机构，您的损耗对比：" : "Traditional 5-Person Outsourcing vs. Your OPC Blueprint:"}
                </h4>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-orange-500/10 bg-white p-3 shadow-2xs">
                    <p className="font-sans text-[10px] text-zinc-500">{language === "cn" ? "常规开发费用" : "Agency Pricing (Est)"}</p>
                    <p className="mt-1 font-mono text-xs md:text-sm line-through text-zinc-400 font-medium">¥{proposal.opcValue.agencyCostEstimate.toLocaleString()}</p>
                  </div>

                  <div className="rounded-xl border border-orange-500/10 bg-white p-3 shadow-2xs">
                    <p className="font-sans text-[10px] text-zinc-500">{language === "cn" ? "常规开发耗时" : "Agency Duration (Est)"}</p>
                    <p className="mt-1 font-sans text-xs text-zinc-650 font-semibold">{proposal.opcValue.agencyDurationMonths}{language === "cn" ? " 个月" : " Months"}</p>
                  </div>

                  <div className="rounded-xl border border-orange-500/15 bg-orange-600/10 p-3 shadow-2xs ring-1 ring-orange-500/20">
                    <p className="font-sans text-[10px] text-orange-700 font-medium">{language === "cn" ? "OPC 极速耗时" : "OPC Fast Track"}</p>
                    <p className="mt-1 font-sans text-xs text-orange-600 font-extrabold">{proposal.opcValue.opcDurationWeeks}{language === "cn" ? " 周交付" : " Weeks Delivery"}</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2.5 items-start">
                  <TrendingDown className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-sans text-xs font-bold text-orange-700">
                      {language === "cn" 
                        ? `直接省下约 ${proposal.opcValue.clientSavingsPercent}% 研发预算，并将耗时压缩 4 倍` 
                        : `Saves approximately ${proposal.opcValue.clientSavingsPercent}% development budget and shrinks timeline 4x`}
                    </h5>
                    <p className="mt-1 font-sans text-[11px] text-zinc-650 leading-relaxed">
                      <strong>{language === "cn" ? "一人公司极致提效法门:" : "OPC High-Leverage Counsel:"}</strong> {proposal.opcValue.leveragedToolsAdvice}
                    </p>
                  </div>
                </div>
              </div>

              {/* High-conversion launch button to lock spot directly */}
              <div className="mt-8 pt-6 border-t border-zinc-150 text-center">
                <p className="text-xs text-zinc-500 mb-3">
                  {language === "cn" 
                    ? "💡 想要立即将这份规划落地，化创意为源源不断的被动现金流吗？" 
                    : "💡 Ready to bring this layout to life and capture your market revenue?"}
                </p>
                <button
                  id="estimator-convert-to-lead-btn"
                  onClick={() => {
                    // Transition to landing tab and auto-fill information
                    const event = new CustomEvent("convertBlueprintToLead", {
                      detail: {
                        projectName: proposal.appName,
                        description: `【AI 规划舱生成交付件】\n核心里程碑脉络：\n${proposal.sprints.map(s => `- Week ${s.week}: ${s.title} (${s.deliverable})`).join("\n")}\n建议变现冷启动模式: ${proposal.monetizationModels[0]?.modelName || "订阅制收单"}`
                      }
                    });
                    window.dispatchEvent(event);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-4 font-sans text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-[0.99]"
                >
                  <Zap className="h-4.5 w-4.5 text-orange-200 animate-pulse" />
                  {language === "cn" ? "🚀 一键投递本案并锁定极客排期席位" : "🚀 Lock My Slot & Build This Blueprint"}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
