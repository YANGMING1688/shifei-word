/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LogoIcon } from "./Logo";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer id="opc-footer" className="bg-zinc-950 text-white mt-16 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between md:gap-12">
          
          {/* Brand section */}
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex items-center justify-center">
                {/* Glow effect backdrops */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl blur-md opacity-25" />
                <div className="absolute inset-0.5 bg-zinc-950 rounded-xl border border-zinc-800" />
                <LogoIcon className="relative h-6 w-6" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-white">
                {language === "cn" ? "OPC 一人公司" : "OPC - One Person Company"}
              </span>
            </div>
            <p className="mt-3 font-sans text-xs text-zinc-400 leading-relaxed">
              {language === "cn" 
                ? "OPC 一人公司是一个将尖端 AI 自动化、全栈快速 MVP 交付与单兵极客杠杆强力结合的“一人公司”产品化实验室。我们致力于让优秀的产品点子在 48 小时内实现“OPC”高能变现，彻底干掉传统外包漫长、臃肿与低效的开发流程。"
                : "OPC is a productized laboratory combining cutting-edge AI automation, rapid MVP releases, and solopreneur leverage. We help builders launch and monetize within 48 hours, fully bypassing slow, bloated agency pipelines."}
            </p>
          </div>

          {/* Guidelines info */}
          <div className="mt-8 md:mt-0 max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h5 className="font-sans text-xs font-bold text-orange-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {language === "cn" ? "OPC契约：零内耗异步协作" : "OPC Covenant: Zero-Meeting Async Collaboration"}
            </h5>
            <p className="mt-1.5 font-sans text-[11px] text-zinc-400 leading-normal select-none">
              {language === "cn"
                ? "我们不组织低效的对齐会，也不参与 PPT 形式的比标。所有的任务进度完全在“控制塔”中进行全天候透明追踪。涉及第三方 API 费用由客户直接代缴（账目独立干净），确保系统底层合规、高效。"
                : "We skip inefficient alignment calls and presentation pitches. All task iterations are transparently monitored in the Control Panel 24/7. Third-party API billings are directly managed by clients, keeping finances completely clean and fully compliant."}
            </p>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="mt-8 border-t border-zinc-850 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-zinc-500">
            {language === "cn"
              ? "© 2026 OPC World (OPC 一人公司). All rights reserved. 备案号已核准。"
              : "© 2026 OPC World. All rights reserved."}
          </p>
          <div className="flex space-x-4 font-mono text-[10px] text-zinc-400">
            <span className="hover:text-white cursor-pointer hover:underline">
              {language === "cn" ? "服务条款 (Terms)" : "Terms of Service"}
            </span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer hover:underline">
              {language === "cn" ? "OPC保密契约 (NDA)" : "NDA & Confidentiality"}
            </span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer hover:underline">
              {language === "cn" ? "产品化订阅政策" : "Subscription Policy"}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
