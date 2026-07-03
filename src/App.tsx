/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Playbook from "./components/Playbook";
import WorkspaceHub from "./components/WorkspaceHub";
import AIEstimator from "./components/AIEstimator";
import LeadCapture from "./components/LeadCapture";
import Footer from "./components/Footer";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

import { 
  Zap, 
  HelpCircle, 
  Clock, 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>("agency");
  const [pricingMode, setPricingMode] = useState<"personal" | "company">("personal");
  const { language, t } = useLanguage();

  const handleSelectPlan = (tier: string) => {
    const el = document.getElementById("opc-conversion-lead-funnel");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    
    // Trigger set value on the input element
    setTimeout(() => {
      const selectEl = document.getElementById("form-selected-tier") as HTMLSelectElement;
      if (selectEl) {
        selectEl.value = tier;
        // Dispatch synthetic change event to trigger state updates in LeadCapture
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 150);
  };

  React.useEffect(() => {
    const handleConvertTab = () => {
      setActiveTab("agency");
    };
    window.addEventListener("convertBlueprintToLead", handleConvertTab);
    return () => window.removeEventListener("convertBlueprintToLead", handleConvertTab);
  }, []);

  return (
    <div id="applet-viewport" className="min-h-screen bg-slate-50 font-sans text-zinc-900 flex flex-col justify-between">
      
      {/* Dynamic Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Core View Router */}
      <main className="flex-grow">
        {activeTab === "agency" && (
          <div id="tabview-landing-agency">
            {/* Landing Hero Screen with Reactive headcount comparison slide */}
            <Hero 
              onStartPlanning={() => handleSelectPlan("monthly")} 
              onExplorePlaybook={() => setActiveTab("playbook")} 
            />

            {/* Productized Pricing Section */}
            <section id="opc-pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-zinc-50 border-t border-zinc-200">
              <div className="text-center max-w-3xl mx-auto">
                <span className="font-mono text-[10px] font-bold text-orange-600 tracking-widest uppercase">
                  {t.pricingTitleBadge}
                </span>
                <h2 className="mt-3 font-sans text-3xl font-extrabold text-zinc-900 sm:text-4xl">
                  {t.pricingTitle}
                </h2>
                <p className="mt-4 font-sans text-sm text-zinc-600">
                  {t.pricingDesc}
                </p>

                {/* Sleek pricing toggle for Personal vs. Corporate */}
                <div className="mt-8 inline-flex items-center gap-1 p-1 bg-zinc-200/60 border border-zinc-300 rounded-2xl shadow-2xs">
                  <button
                    id="toggle-pricing-personal"
                    onClick={() => setPricingMode("personal")}
                    className={`px-5 py-2.5 font-sans text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 ${
                      pricingMode === "personal"
                        ? "bg-white text-zinc-900 shadow-xs scale-[1.02]"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {t.pricingTogglePersonal}
                  </button>
                  <button
                    id="toggle-pricing-company"
                    onClick={() => setPricingMode("company")}
                    className={`px-5 py-2.5 font-sans text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 ${
                      pricingMode === "company"
                        ? "bg-white text-zinc-900 shadow-xs scale-[1.02]"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {t.pricingToggleCompany}
                  </button>
                </div>
              </div>

              {/* Plans 3-Grid Display */}
              <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
                
                {/* Plan 1: Weekly Sprint */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-zinc-350 transition-all">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded font-mono">
                      {t.pricingSprintName}
                    </span>
                    <h3 className="mt-3 font-sans text-2xl font-black text-zinc-900">
                      {pricingMode === "personal" ? t.pricingSprintPrice : t.pricingSprintPriceCompany}
                    </h3>
                    <p className="font-sans text-[10px] text-zinc-500 mt-1">{t.pricingSprintSub}</p>
                    
                    <p className="mt-4 font-sans text-xs text-zinc-600 leading-normal border-t border-zinc-100 pt-4">
                      {t.pricingSprintDesc}
                    </p>

                    {/* Features list */}
                    <ul className="mt-6 space-y-3">
                      {(pricingMode === "personal" ? t.pricingSprintFeatures : t.pricingSprintFeaturesCompany).map((feat, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-zinc-600">
                          <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      id="select-sprint-btn"
                      onClick={() => handleSelectPlan("sprint")}
                      className="w-full text-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 py-3.5 font-sans text-xs font-semibold text-zinc-800 shadow-3xs cursor-pointer transition-colors"
                    >
                      {t.pricingSprintBtn}
                    </button>
                  </div>
                </div>

                {/* Plan 2: Monthly Retainer - Premium High Conversion Flagship */}
                <div className="rounded-2xl border-2 border-orange-500 bg-white p-6 shadow-md shadow-orange-500/5 flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1 transition-all">
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-orange-500 px-3 py-1 font-mono text-[9px] font-bold text-white tracking-widest uppercase">
                    {t.pricingRecommend}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded font-mono">
                      {t.pricingMonthName}
                    </span>
                    <h3 className="mt-3 font-sans text-3xl font-black text-zinc-900">
                      {pricingMode === "personal" ? t.pricingMonthPrice : t.pricingMonthPriceCompany}{" "}
                      <span className="font-sans text-xs font-normal text-zinc-400">{t.pricingMonthSub}</span>
                    </h3>

                    <p className="mt-4 font-sans text-xs text-zinc-600 leading-normal border-t border-zinc-100 pt-4">
                      {t.pricingMonthDesc}
                    </p>

                    {/* Features list */}
                    <ul className="mt-6 space-y-3">
                      {(pricingMode === "personal" ? t.pricingMonthFeatures : t.pricingMonthFeaturesCompany).map((feat, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-zinc-600">
                          <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <strong>{feat}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      id="select-subscription-btn"
                      onClick={() => handleSelectPlan("monthly")}
                      className="w-full text-center rounded-xl bg-zinc-900 hover:bg-zinc-850 py-3.5 font-sans text-xs font-semibold text-white shadow-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      {t.pricingMonthBtn}
                      <ArrowRight className="h-4 w-4 text-orange-400" />
                    </button>
                  </div>
                </div>

                {/* Plan 3: Architectural Advisor */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-zinc-350 transition-all">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded font-mono">
                      {t.pricingAdvisorName}
                    </span>
                    <h3 className="mt-3 font-sans text-2xl font-black text-zinc-900">
                      {pricingMode === "personal" ? t.pricingAdvisorPrice : t.pricingAdvisorPriceCompany}
                    </h3>
                    <p className="font-sans text-[10px] text-zinc-500 mt-1">{t.pricingAdvisorSub}</p>

                    <p className="mt-4 font-sans text-xs text-zinc-600 leading-normal border-t border-zinc-100 pt-4">
                      {t.pricingAdvisorDesc}
                    </p>

                    {/* Features list */}
                    <ul className="mt-6 space-y-3">
                      {(pricingMode === "personal" ? t.pricingAdvisorFeatures : t.pricingAdvisorFeaturesCompany).map((feat, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-zinc-600">
                          <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      id="select-advisor-btn"
                      onClick={() => handleSelectPlan("advisor")}
                      className="w-full text-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 py-3.5 font-sans text-xs font-semibold text-zinc-800 shadow-3xs cursor-pointer transition-colors"
                    >
                      {t.pricingAdvisorBtn}
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* Interactive Lead Capture & Conversion Funnel */}
            <LeadCapture />

            {/* Q&A / FAQ Section for conversion polish */}
            <section id="vanguard-faqs" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-200">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-sans text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  {t.faqTitleBadge}
                </span>
                <h3 className="mt-2 font-sans text-2xl font-black text-zinc-900">
                  {t.faqTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {t.faqsList.map((faq, index) => (
                  <div key={index} className="rounded-2xl border border-zinc-150 bg-white p-6 shadow-2xs hover:shadow-sm transition-shadow">
                    <h4 className="font-sans text-sm font-bold text-zinc-900 flex items-start gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="mt-3 font-sans text-xs text-zinc-600 leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {activeTab === "workspace" && <WorkspaceHub />}
        {activeTab === "planner" && <AIEstimator />}
        {activeTab === "playbook" && <Playbook />}
      </main>

      {/* Auth Modal Overlay */}
      <AuthModal />

      {/* Polish footer */}
      <Footer />
    </div>
  );
}
