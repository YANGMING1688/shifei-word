/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Zap, ShieldCheck, Clock, Users, ArrowRight, Layers, Code, Play } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { LogoIcon } from "./Logo";

interface HeroProps {
  onStartPlanning: () => void;
  onExplorePlaybook: () => void;
}

export default function Hero({ onStartPlanning, onExplorePlaybook }: HeroProps) {
  const { language, t } = useLanguage();
  
  // Slider states for the Cost comparison calculator
  const [teamSize, setTeamSize] = useState<number>(3); // 1-10 full time developers/PMs
  const [months, setMonths] = useState<number>(4); // Duration in months

  // Constants for calculations
  const AVG_SALARY_CNY = 32000; // Average monthly full salary + benefits + overhead per developer/PM
  const TRADITIONAL_AGENCY_MONTHLY = 85000; // Monthly cost of a middle-tier agency
  
  // Traditional full-time team cost
  const ftCost = teamSize * AVG_SALARY_CNY * months;
  // Traditional custom agency cost 
  const agencyCost = TRADITIONAL_AGENCY_MONTHLY * months;
  // Vanguard OPC subscription price equivalent (usually flat ¥24,800/mo or ¥9,800/sprint)
  const opcCost = 24800 * months;
  
  // Savings calculation
  const ftSavings = ftCost - opcCost;

  return (
    <div id="opc-hero-section" className="relative overflow-hidden bg-zinc-50 pt-16 pb-24 sm:pt-24 lg:pb-32">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.06),transparent_65%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-semibold text-orange-700"
          >
            <LogoIcon className="h-4.5 w-4.5" />
            {t.heroBadge}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-sans text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
          >
            <span className="block text-zinc-900">{t.heroTitleLine1}</span>
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              {t.heroTitleLine2}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl font-sans text-sm text-zinc-600 leading-relaxed"
          >
            {t.heroDesc}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              id="hero-start-planning-btn"
              onClick={onStartPlanning}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 font-sans text-base font-semibold text-white shadow-xl hover:bg-zinc-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {t.heroBtnPlan}
              <ArrowRight className="h-4 w-4 text-orange-500" />
            </button>
            
            <button
              id="hero-explore-playbook-btn"
              onClick={onExplorePlaybook}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-4 font-sans text-base font-semibold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm"
            >
              <Play className="h-4 w-4 text-zinc-500" />
              {t.heroBtnPlaybook}
            </button>
          </motion.div>
        </div>

        {/* 3 Pillars Strategy Section */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Pillar 1 */}
          <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-zinc-900">
              {language === "cn" ? "超音速纯异步（零开会损耗）" : "Supersonic & Async (No Meetings)"}
            </h3>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
              {language === "cn" 
                ? "抛弃一切低效站会和碰头会。在控制塔板上提交您的构想，甚至只需录制一段 2 分钟的 Loom 屏幕演示，首席工程师会在 12 小时内响应并在 48 小时内为您滑行交付成品。" 
                : "Ditch slow daily standups and sync calls. Pin your tasks directly to the Control Tower board with a 2-minute Loom walkthrough. Your lead architect will respond and deploy within 48 hours."}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-zinc-900">
              {language === "cn" ? "透明交付线路（订阅可随时暂停）" : "Transparent Roadmap (Pause Anytime)"}
            </h3>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
              {language === "cn" 
                ? "一口价，没有复杂的合同与追加账单套路。首创灵活的产品化订阅模式。若项目处于推广验证期，可一键“暂停订阅”，剩余天数额度无限期冷冻，不浪费一分钱。" 
                : "Flat-rate pricing with zero hidden fees. Pause your monthly subscription anytime during marketing validation, freezing your balance infinitely so you don't waste a single cent."}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-zinc-900">
              {language === "cn" ? "王牌工程师（首席全栈 1v1 亲自带飞）" : "Elite Architect (Direct 1v1 Delivery)"}
            </h3>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
              {language === "cn" 
                ? "不找廉价外包团队，绝不倒手分包。您对话的既是商业顾问，也是唯一致力于为您打通极致代码交付的首席极客，交付代码符合严苛的 TypeScript 标准。" 
                : "We do not outsource or subcontract. Your direct contact is the very architect writing your production-ready, typed code according to top enterprise standards."}
            </p>
          </div>
        </div>

        {/* Cost Savings Calculator Simulator */}
        <div className="mt-24 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
            
            {/* Control Form */}
            <div className="lg:w-1/2">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                {language === "cn" ? "测算你的“研发内耗”与预算省减" : "Measure Your R&D Overhead & Savings"}
              </h2>
              <p className="mt-3 font-sans text-xs text-zinc-500 leading-relaxed">
                {t.calcDesc}
              </p>

              {/* Slider 1: Team Size */}
              <div className="mt-8">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700">{language === "cn" ? "拟用传统全职研发团队规模:" : "Traditional Developer Headcount:"}</span>
                  <span className="font-mono text-orange-600 font-semibold">{teamSize} {language === "cn" ? "人" : "devs"}</span>
                </div>
                <input
                  id="calc-team-size-slider"
                  type="range"
                  min="1"
                  max="10"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-100 accent-orange-600"
                />
                <div className="mt-1 flex justify-between font-mono text-[9px] text-zinc-400">
                  <span>{language === "cn" ? "1人 (Mini 极简)" : "1 Dev (Minimal Solo)"}</span>
                  <span>{language === "cn" ? "5人 (常规外包团队)" : "5 Devs (Standard Agency)"}</span>
                  <span>{language === "cn" ? "10人 (中型研发编制)" : "10 Devs (Mid-Sized Team)"}</span>
                </div>
              </div>

              {/* Slider 2: Duration */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-700">{language === "cn" ? "项目产品迭代与交付时长:" : "Active Iteration & Development Time:"}</span>
                  <span className="font-mono text-orange-600 font-semibold">{months} {language === "cn" ? "个月" : "months"}</span>
                </div>
                <input
                  id="calc-duration-slider"
                  type="range"
                  min="1"
                  max="12"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-100 accent-orange-600"
                />
                <div className="mt-1 flex justify-between font-mono text-[9px] text-zinc-400">
                  <span>{language === "cn" ? "1 个月 (概念验证)" : "1 Month (Validation)"}</span>
                  <span>{language === "cn" ? "6 个月 (功能拓展)" : "6 Months (Scaling)"}</span>
                  <span>{language === "cn" ? "12 个月 (整年深度合伙)" : "12 Months (Yearly)"}</span>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="mt-10 rounded-2xl bg-zinc-950 p-6 text-white lg:mt-0 lg:w-5/12">
              <span className="font-mono text-[11px] font-bold tracking-wider text-orange-500 uppercase">
                {language === "cn" ? "飞行预算损耗对比" : "Development Budget Comparison"}
              </span>

              {/* Comparison Stats */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <span className="font-sans text-xs text-zinc-400">{language === "cn" ? "自建团队全职开支总额(估)" : "Traditional Team Payroll (Est)"}</span>
                  <span className="font-mono text-sm line-through text-zinc-400">
                    ¥{ftCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <span className="font-sans text-xs text-zinc-400">{language === "cn" ? "传统中端外包机构总报价(估)" : "Middle-Tier Agency Quote (Est)"}</span>
                  <span className="font-mono text-sm line-through text-zinc-400">
                    ¥{agencyCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-xs font-semibold text-orange-400">{language === "cn" ? "OPC 一人公司" : "OPC Flat Rate"}</span>
                    <span className="rounded bg-orange-500/10 px-1.5 py-0.2 font-mono text-[8px] font-bold text-orange-400 ring-1 ring-orange-500/20">{language === "cn" ? "尊享" : "Elite"}</span>
                  </div>
                  <span className="font-mono text-base font-bold text-orange-400">
                    ¥{opcCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Real Saved Budget Banner */}
              <div className="mt-8 rounded-xl bg-orange-600/10 p-4 ring-1 ring-orange-600/20">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-orange-600 font-mono text-[10px] font-bold text-white">
                    {language === "cn" ? "省" : "S"}
                  </div>
                  <span className="font-sans text-xs font-medium text-orange-100">
                    {language === "cn" ? "对比传统自建研发，你省下了：" : "Compared to full payroll, you saved:"}
                  </span>
                </div>
                <p className="mt-2 font-mono text-3xl font-black text-orange-500">
                  ¥{ftSavings.toLocaleString()} CNY
                </p>
                <p className="mt-1 font-mono text-[9px] text-zinc-400 leading-relaxed">
                  {language === "cn" 
                    ? `* 节省比例高达 ${Math.round((ftSavings / ftCost) * 100)}%，您可以将这笔宝贵的资金全额投入到核心买量、产品首发和客户增长等具有爆发式增长杠杆的业务动作上。`
                    : `* Savings of ${Math.round((ftSavings / ftCost) * 100)}%. This allows you to reallocate vital runway directly into marketing, acquisition, and scaling the business core.`}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
