/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Zap, Layers, Activity, User, LogOut, Coins, ShieldCheck, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, setIsAuthModalOpen, setAuthModalTab, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabs = [
    { id: "agency", label: t.tabAgency },
    { id: "workspace", label: t.tabWorkspace },
    { id: "planner", label: t.tabPlanner },
    { id: "playbook", label: t.tabPlaybook }
  ];

  return (
    <header id="opc-header" className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="cursor-pointer" onClick={() => setActiveTab("agency")}>
          <Logo />
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              id={`nav-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3.5 py-2 font-sans text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Live Metrics Badge & Language Selector */}
        <div className="flex items-center gap-3">
          {/* Language Selector Segment */}
          <div className="flex items-center gap-0.5 rounded-lg bg-zinc-100 p-0.5 border border-zinc-200">
            <button
              id="lang-toggle-cn"
              onClick={() => setLanguage("cn")}
              className={`px-2 py-1 font-sans text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                language === "cn"
                  ? "bg-white text-zinc-950 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              中文
            </button>
            <button
              id="lang-toggle-en"
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 font-sans text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                language === "en"
                  ? "bg-white text-zinc-950 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              EN
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-600/10">
            <Activity className="h-3 w-3 animate-pulse" />
            <span className="font-mono text-[10px] font-medium">
              {language === "cn" ? "当前活跃负载: 2/3 满载" : "Active Load: 2/3 Capacity"}
            </span>
          </div>

          {/* User Account Authentication Dropdown / Buttons */}
          {user ? (
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors text-zinc-800 font-sans text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <div className="h-5 w-5 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-[10px]">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.username}</span>
                <ChevronDown className={`h-3 w-3 text-zinc-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div id="user-profile-dropdown" className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-150 bg-white p-3 shadow-xl z-25 font-sans">
                    <div className="border-b border-zinc-100 pb-2 mb-2">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{t.authProfile}</p>
                      <p className="text-xs font-bold text-zinc-900 mt-0.5 truncate">{user.username}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{user.emailOrPhone}</p>
                    </div>
                    
                    <div className="space-y-1.5 mb-2">
                      <div className="flex items-center justify-between text-[11px] text-zinc-600 bg-zinc-50 px-2 py-1 rounded-md">
                        <span className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-amber-500" />
                          {t.authCredits}
                        </span>
                        <span className="font-mono font-bold text-zinc-900">{user.computeCredits.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-600 bg-zinc-50 px-2 py-1 rounded-md">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-orange-500" />
                          {t.authMembership}
                        </span>
                        <span className="font-sans font-bold text-zinc-800 uppercase text-[9px] bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded">
                          {user.membership === "none" 
                            ? (language === "cn" ? "体验卡" : "Free Tier") 
                            : user.membership}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      id="btn-logout"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-transparent hover:border-red-100"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      {t.authLogout}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="btn-login-trigger"
                onClick={() => {
                  setAuthModalTab("login");
                  setIsAuthModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                {language === "cn" ? "客户登录" : "Log In"}
              </button>
              <button
                id="btn-register-trigger"
                onClick={() => {
                  setAuthModalTab("register");
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                {language === "cn" ? "注册" : "Sign Up"}
              </button>
            </div>
          )}
          
          <button 
            id="mobile-quick-action"
            onClick={() => setActiveTab("planner")}
            className="rounded-lg bg-orange-600 px-3.5 py-1.5 font-sans text-xs font-semibold text-white hover:bg-orange-700 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            {t.planHeaderBtn}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs (visible only on small screens) */}
      <div className="md:hidden border-t border-zinc-100 bg-white/95 px-4 py-2">
        <div className="grid grid-cols-2 gap-1.5">
          {tabs.map((tab) => (
            <button
              id={`nav-tab-mobile-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-center rounded-md px-2.5 py-1.5 font-sans text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 bg-zinc-50 hover:bg-zinc-100"
              }`}
            >
              {tab.label.split(" (")[0]} {/* truncate brackets for compact mobile layout */}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
