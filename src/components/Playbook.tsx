/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, DollarSign, Activity, Settings, ClipboardList, CheckCircle, ChevronRight, HelpCircle, Play } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface PlaybookLesson {
  id: string;
  title: string;
  category: "business-model" | "operations" | "monetization" | "case-studies";
  brief: string;
  content: string;
  takeaways: string[];
  checklist: string[];
}

export default function Playbook() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedLesson, setSelectedLesson] = useState<string>("designjoy");

  const lessons: PlaybookLesson[] = language === "cn" ? [
    {
      id: "designjoy",
      title: "Designjoy 估值秘密：年营收 150 万美金的单兵商业模式",
      category: "case-studies",
      brief: "解析 Brett Williams 如何独力支撑 30 多家活跃客户的超级设计订阅，并最终取得财务自由。",
      content: `### 核心运营模型
Designjoy 是世界上最著名的 **一人设计机构 (One Person Design Agency)**。Brett 几乎不雇佣开发人员，不租办公室，所有的沟通全部通过 **Trello**（工单板）和 **Loom**（录屏视频）异步处理，从不开会。

### 赚钱逻辑
* **订阅定金制（Subscription Retainer）**: 采用每月 $4,995 美元的固定订阅。
* **按需即买即暂停**: 客户如果当期没有需求，可以随时“暂停”订阅，剩余预算可以留存到下月继续消耗，复购率与客户粘性极强。
* **单一并发处理锁 (Sequential Pipeline)**: 虽然可以提交无数个需求，但是任何时刻 Brett **只处理 Trello 板上的第一个任务**。完成并通过后，客户才允许解锁排队中的下一个任务。利用并发锁保护自己绝对不会因为大量需求而超载。`,
      takeaways: [
        "异步大于同步：每一次开会都是对一人公司产能的极度损耗。直接用2分钟 Loom 代替40分钟对齐会。",
        "队列限制保安全：不允许客户提多进程任务，一次只专注做一件事，把交付周期压缩至48小时。",
        "超预估粘性：客户习惯并信任把一人公司作为后备生产力，类似于买云端服务器，即插即用。"
      ],
      checklist: [
        "配置一个专属的公开看板（Trello、Notion 或自定义门户），作为全局唯一沟通载体",
        "配置条文明确、通俗的免会议服务条款（Terms of Service），说明不接听即时电话",
        "设定标准的周度/月度付款卡片，通过自动续费（如 Stripe / 微信商家代扣）获取经常性预算"
      ]
    },
    {
      id: "productized-dev",
      title: "产品化软件开发 (Productized Dev) 服务定价设计",
      category: "monetization",
      brief: "摆脱‘按工时估算报价’的传统做项目思路，转化为像售卖软件组件那样的明确、无扯皮一口价交付包。",
      content: `### 为什么‘按时间收费’是独立开发者的噩梦？
传统外包往往根据“人天”、“人月”或者里程碑（Milestones）去对齐，其核心弊端是：**利益处于天然对抗中**。你技术越好、开发越快，反而收费越低；客户则想在有限预算里不断塞入额外的隐形功能（Scope Creep）。

### 产品化交付三大计费结构：
1. **周级冲刺包 (Weekly Launch Sprint)**: 
   * **适合**: 快速搭建 SaaS MVP 原型、小程序或单页高转化落地站。
   * **价格**: ¥7,800 - ¥15,800 / 单周期。
   * **产出**: 5天交底，不打折扣地输出高阶可用版本，帮助客户拿去给天使投资人或第一批用户体验。
2. **月度深度专属定制 (Monthly Solo Engine)**:
   * **适合**: 需要持续集成、AI 工作流集成或系统长期迭代维护的项目。
   * **价格**: 固定 ¥19,800 - ¥35,000 / 月。
   * **特点**: 随时暂停，没有长期合同，支持双倍速度（加收50%）独占交付通道。
3. **高阶咨询板 (Architect Advisory)**:
   * **价格**: 定价 ¥1,500 / 小时，或专为大厂提供周度架构设计案（¥5,000 / 案）。不写代码，只做选型与 API 链路设计。`,
      takeaways: [
        "变工时为交付物：不要和客户讨论你写了几个小时代码，而要展示代码解决了什么用户闭环。",
        "一键暂停特权：将‘不可抗退款撕逼’化解为‘您可以随时在后台一键暂停，已收费用永不失效’。",
        "全网极简结算：通过微信、支付宝周期协议扣款或 Stripe Links 直接下单，无需经过超长繁琐的法务流程。"
      ],
      checklist: [
        "拒绝撰写超过 1 页的手画定制合同草案，只用单张产品规格清单签字确认",
        "设定不退款但支持随时‘一键暂停冷冻’（Pause Subscription）政策",
        "拒绝免费需求对齐，必须先下单支付定金，才会将任务锁移入设计分析列"
      ]
    },
    {
      id: "async-ops",
      title: "一人公司（OPC）极其强大的自动化工具栈与杠杆",
      category: "operations",
      brief: "揭秘现代 Solopreneur 如何借用最先进的底层技术套件、Boilerplates 以及 AI 助手，做到‘一人匹敌五人’。",
      content: `### 一人公司的极低摩擦技术大底座
要能做到 48 小时完成一个复杂功能的输出，你不能从零开始建构底层协议（如校验、授权层、通知队列）。
必须用行业里经过高强度校验的“脚手架与通用模块组件架子”：

* **代码生成器**: Cursor / Copilot + 核心多模型（Gemini 等），自动完成琐碎的 TypeScript 类型声明、CSS 排布、高频 REST Controller 脚手架结构。
* **通用 SaaS 启动模板 (Boilerplates)**: 如 ShipFast React、Next.js 快速框架。出厂预装 Stripe、安全授权（NextAuth）、邮件通知、数据库 schema、SEO 配置。省下 3 天重复配置工作。
* **低代码后端通道**: 彻底放弃自己从零编写数据库连接、多表聚合、多权限、复杂后台控制。直接使用现代云原生套件（如 **Firebase** / Supabase）。它们开箱即提供实时订阅功能与开箱即用的控制面板页面。`,
      takeaways: [
        "拒绝重复造轮子：any需要手动写 50 遍以上的注册/配置逻辑，直接买开源的模版替换。",
        "不要自己建运维服务器：一人公司应全面拥抱 Serverless 和 Headless API 托管平台，消除硬件运维。监控成本降为零。",
        "AI 辅助审阅代码：通过在本地脚本里预设 Linter 与构建自检工具，绝不把低级类型或打包拼错留给部署环境报错。"
      ],
      checklist: [
        "选定一个属于自己的高复用 React 完整 boilerplate 代码库",
        "配置好常用的 API 通道（通知、授权、付款）测试密钥，存入便笺作为模板随时瞬移配置",
        "搭建 CI/CD 自动化流水线，支持主干分支代码合并后 2 分钟在 preview 预发布更新"
      ]
    },
    {
      id: "marketing-loop",
      title: "一人公司获客模型：建立你的冷启动信任飞轮",
      category: "business-model",
      brief: "没有销售部门、没有预算，一人公司如何让高质量的客户主动上门排队付定金？",
      content: `### 1. Build In Public (公开研发过程)
这是全球 solopreneur 共同的获客大本营：
* **去哪发**: 在 X (Twitter)、小红书、掘金、即刻、V2EX 坚持更新。
* **发什么**: 真实写出在做什么，开发进度、踩坑细节、甚至是由于漏写一行代码导致的宕机事故、真实的周营收收入折线图。
* **精髓**: 真实、毫无掩饰的工程细节、人性的真诚是抵抗冰冷外包公司的最强武器。客户是在和 **具体、有才华的活人** 签订阅，而不是冷酷的公司协议。

### 2. 免费开源‘捕鱼工具’ (Side Project Marketing)
* **策略**: 开发一个极度精美、5分钟就写完的单页有趣小工具。比如：‘公司节省成本计算器’、‘API 用量分析器’、‘简历语法一键抛光站’。
* **引流机制**: 工具下挂一个极致显眼的横幅，指向你的‘一人开发工坊’。给用户带来了实实在在的实用价值，建立心智。

### 3. 品质外显与高溢价
* 不要打价格战，低端客户最容易扯皮且会吃掉你所有的个人精力。保持高定价，只招收认同精益、敏捷、专业价值的高含金量客户合伙。`,
      takeaways: [
        "真实性最贵：公开过程不是炫耀，而是展现一人公司的透明、敏捷。每一个关注者都是你的潜在推广官。",
        "通过免费副产品聚粉：好玩实用的轻级产品在开源平台能自然引发高频自发分享。",
        "坚决对低端价格战说不：你宁可用 ¥25,000服务 1 个高质量闭环客户，也不玩 ¥2,500折磨你的 10 个客户。"
      ],
      checklist: [
        "在个人社交主页置顶一张简明扼要的产品化服务明细、案例与一键下单链接",
        "每周雷打不动撰写并发布一期业务研发踩坑总结或架构观察日记",
        "设计一个免费引流副产品放置到 landing 最底端"
      ]
    }
  ] : [
    {
      id: "designjoy",
      title: "The Designjoy Playbook: Inside a $1.5M/Year Solo Business Model",
      category: "case-studies",
      brief: "Deconstruct how Brett Williams manages 30+ active enterprise design subscriptions alone without ever scheduling a meeting.",
      content: `### Core Operational Protocol
Designjoy is the poster child of the **One-Person Agency** movement. Brett has no employees, no office, and routes 100% of communication asynchronously through **Trello** (task queues) and **Loom** (video recordings). He never schedules synchronous alignment meetings.

### Monetization Design
* **Subscription Retainer Model**: Clients subscribe at a flat rate of $4,995/month.
* **Pause-and-Resume Mechanics**: If clients have no active design needs, they can pause their billing and save remaining days for later. This boosts retention and client lifetime value.
* **Sequential Backlog Pipeline**: While clients can submit infinite requests, Brett **only works on the single task at the top of their queue**. The next task is unlocked only after the current one is approved. This bottleneck keeps him safe from burnout.`,
      takeaways: [
        "Asynchronous over Synchronous: Meetings are a toxic drain on solo developers. Swap a 40-minute Zoom for a 2-minute Loom.",
        "The Single-Pipeline Lock: Enforce a sequential queue; work on exactly one active item at a time to keep delivery cycles under 48 hours.",
        "Infrastructure Mindset: Clients treat your service like on-demand server utilities—plug, play, and pay retainers with zero friction."
      ],
      checklist: [
        "Deploy a dedicated public dashboard (Trello/Notion) as the single source of truth for all customer requests.",
        "Draft clean, jargon-free Terms of Service specifying that voice/video calls are not provided.",
        "Configure Stripe or automated recurring card billing to handle monthly subscription retainers."
      ]
    },
    {
      id: "productized-dev",
      title: "The Productized Dev: Crafting High-Ticket Solo Packages",
      category: "monetization",
      brief: "Shift from hourly contracts to productized deliverables. Sell development like software modules with zero pricing friction.",
      content: `### Why Hourly Billing is a Solopreneur's Trap
Traditional freelancing charges by hours or days. The core issue is **misaligned incentives**: the faster and better you are, the less money you make. Meanwhile, clients are incentivized to sneak in extra hidden features (Scope Creep).

### The 3 High-Ticket Productized Deliverables
1. **Weekly Launch Sprint**:
   * **Best For**: Rapid prototypes, SaaS MVPs, high-converting launch landers.
   * **Price**: $1,200 - $2,500 per sprint cycle.
   * **Outcome**: A polished, ready-to-use release in 5 days to secure early beta testers or investor attention.
2. **Monthly Solo Engine**:
   * **Best For**: Continuous features, complex AI integrations, and long-term project iteration.
   * **Price**: Flat rate of $3,500 - $6,000 / Month.
   * **Features**: Pause anytime, no long-term contracts, double velocity queue options.
3. **Architect Advisory**:
   * **Price**: $250 / Hour, or weekly system design proposals at $1,000 / Plan. No coding; just tech-stack selection and API routing maps.`,
      takeaways: [
        "Deliverables over Hours: Never argue about how many hours you code; show the working client flow that solves a business bottleneck.",
        "The Pause Privilege: Resolve refund disputes gracefully with a strict 'Pause anytime—your credit never expires' policy.",
        "One-Click Checkouts: Utilize Stripe Payment Links or direct wire invoices to bypass sluggish corporate legal procedures."
      ],
      checklist: [
        "Replace multi-page customized contract drafts with a simple 1-page Product Specification document.",
        "Establish a strict 'Pause & Freeze Subscription' protocol instead of offering cash refunds.",
        "Never work for free; require upfront retainer payments before queueing any client tasks."
      ]
    },
    {
      id: "async-ops",
      title: "OPC Tooling: Ultimate Tech Stacks for Solo Developers",
      category: "operations",
      brief: "Unveil how modern solopreneurs leverage modern boilerplates, serverless architectures, and AI assistants to outperform traditional agencies.",
      content: `### High-Velocity, Zero-Friction Solo Infrastructure
To ship a complex feature in under 48 hours, you cannot waste time writing authentication, styling configs, database migrations, or email queues from scratch. 
You must employ a pre-engineered, highly optimized scaffolding framework:

* **AI Co-pilots**: Leverage Cursor / Copilot and large multi-modal models (like Gemini) to automate TypeScript boilerplate, Tailwind layouts, and REST controllers.
* **SaaS Boilerplates**: Utilize robust starters (like ShipFast or similar Next.js setups). These ship with built-in Stripe billing, auth schemas (NextAuth/Clerk), mail utilities, and SEO. Saving you 3-4 days of config.
* **Headless Backends**: Completely stop hand-crafting low-level server connections. Embrace modern cloud suites like **Firebase** or Supabase, providing real-time data persistence and database managers instantly.`,
      takeaways: [
        "Stop Rebuilding Boilerplates: If you've configured signup pages or payment hooks 50 times, buy or maintain a solid boilerplate codebase.",
        "Ditch Server Maintenance: Fully embrace Serverless hosting and managed headless APIs to reduce your DevOps overhead to absolute zero.",
        "AI Linting & Testing: Run pre-configured linters and test builds locally so typos and bundle bugs are caught before reaching production."
      ],
      checklist: [
        "Standardize on a single React boilerplate codebase for all rapid prototyping.",
        "Keep production and sandbox API keys (Stripe, Mailgun, Firebase) secured in a reusable notes layout.",
        "Configure a 2-minute CI/CD pipeline that builds and deploys preview links automatically upon Git push."
      ]
    },
    {
      id: "marketing-loop",
      title: "Solo Marketing: Launching Your Organic Trust Flywheel",
      category: "business-model",
      brief: "Learn how to establish steady inbound lead flows with zero marketing budgets and zero outbound cold calling.",
      content: `### 1. Build In Public
The ultimate organic growth strategy for solopreneurs worldwide:
* **Where to Share**: Maintain updates on X (Twitter), LinkedIn, IndieHackers, and local developer communities.
* **What to Share**: Progress reports, tech-stack decisions, errors (such as crashes due to a typo), and transparent revenue charts.
* **The Magic**: Humanity and radical transparency are your greatest weapons against faceless agencies. Clients hire **real, talented individuals**, not corporate machines.

### 2. Side-Project Marketing (Utility Fishing)
* **The Strategy**: Launch small, highly polished, free utilities that take 5 minutes to build. (e.g., 'Cost Savings Calculator', 'API Analyzer', 'Markdown Formatter').
* **The Funnel**: Place a highly visible banner on your free utility leading directly to your 'Solo Studio'. Users who get instant value will trust your capabilities.

### 3. Avoid Price Under-Cutting
Never participate in low-ticket price wars. Budget clients are highly high-maintenance and will drain your creative focus. Keep prices high and partner with clients who appreciate speed, autonomy, and premium solo craft.`,
      takeaways: [
        "Radical Transparency: Building in public is not boasting; it proves your agility, craft, and personal integrity to potential clients.",
        "Side-Projects Gather Leads: Lightweight, practical widgets organically drive developer recommendations and free referrals.",
        "Pricing as a Filter: You are far better off charging $3,500 to one high-value client than $350 to ten demanding ones."
      ],
      checklist: [
        "Pin a crystal-clear breakdown of your service packages, case studies, and payment links on your social profiles.",
        "Commit to writing a weekly recap of your product discoveries, tech learnings, or solo architecture reviews.",
        "Deploy a simple, interactive calculator or diagnostic widget on your landing page to capture organic intent."
      ]
    }
  ];

  const categories = language === "cn" ? [
    { id: "all", label: "全部秘籍" },
    { id: "case-studies", label: "名家案例" },
    { id: "monetization", label: "赚钱与定价" },
    { id: "operations", label: "极致运营杠杆" },
    { id: "business-model", label: "商业爆发力" }
  ] : [
    { id: "all", label: "All Insights" },
    { id: "case-studies", label: "Case Studies" },
    { id: "monetization", label: "Pricing & Billing" },
    { id: "operations", label: "Operational Leverage" },
    { id: "business-model", label: "Growth Flywheel" }
  ];

  const filteredLessons = lessons.filter(
    (l) => activeCategory === "all" || l.category === activeCategory
  );

  const selectedLessonData = lessons.find((l) => l.id === selectedLesson) || lessons[0];

  return (
    <div id="playbook-tab-container" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Playbook Header */}
      <div className="border-b border-zinc-200 pb-8">
        <h2 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
          {language === "cn" ? "一人公司（OPC）全球化运营与赚钱内参" : "One Person Company (OPC) Global Operating Playbook"}
        </h2>
        <p className="mt-2 text-xs md:text-sm text-zinc-500 leading-relaxed">
          {language === "cn" 
            ? "学习全球最顶尖、最赚钱的 1-Person Agency 运转模式。这里没有枯燥的学术理论，全部是高杠杆落地公式、真实案例剖析和可被完全复印的高溢价定价表。" 
            : "Learn from the world's most profitable 1-person businesses. No boring academic theory; just pure high-leverage formulas, real case deconstructions, and copyable high-ticket pricing sheets."}
        </p>
      </div>

      {/* Categories Toolbar */}
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            id={`playbook-cat-${cat.id}`}
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              // Auto select first lesson of the new category
              const firstInCat = lessons.find((l) => cat.id === "all" || l.category === cat.id);
              if (firstInCat) setSelectedLesson(firstInCat.id);
            }}
            className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold cursor-pointer border ${
              activeCategory === cat.id
                ? "bg-orange-600 border-orange-600 text-white"
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Directory vs Selected Lesson Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Directory List (4 columns) */}
        <div className="lg:col-span-4 space-y-3">
          <p className="font-sans text-[11px] font-bold text-zinc-400 tracking-wider uppercase px-1">
            {language === "cn" ? "小节目录" : "Insights Index"}
          </p>
          <div className="space-y-1">
            {filteredLessons.map((lesson) => (
              <button
                id={`playbook-lesson-btn-${lesson.id}`}
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson.id)}
                className={`w-full text-left rounded-xl p-3.5 transition-all cursor-pointer border ${
                  selectedLesson === lesson.id
                    ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-block rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                    selectedLesson === lesson.id
                      ? "bg-orange-600 text-white"
                      : "bg-orange-50 text-orange-600"
                  }`}>
                    {lesson.category === "case-studies" 
                      ? (language === "cn" ? "案例" : "Case") 
                      : lesson.category === "monetization" 
                      ? (language === "cn" ? "收款" : "Billing") 
                      : lesson.category === "operations" 
                      ? (language === "cn" ? "技术" : "Tech") 
                      : (language === "cn" ? "营销" : "Growth")}
                  </span>
                </div>
                <h4 className="mt-2 text-xs font-bold leading-snug line-clamp-2">
                  {lesson.title}
                </h4>
                <p className={`mt-1 text-[11px] line-clamp-2 ${
                  selectedLesson === lesson.id ? "text-zinc-300" : "text-zinc-500"
                }`}>
                  {lesson.brief}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Elaborated Lesson Sheet (8 columns) */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Category tag */}
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-orange-600 ring-1 ring-orange-500/10">
                  {selectedLessonData.category.toUpperCase()}
                </span>
                <span className="text-zinc-400 font-mono text-xs">
                  {language === "cn" ? "• Vanguard 精选内参" : "• Curated Vanguard Playbook"}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-4 font-sans text-xl md:text-2xl font-black tracking-tight text-zinc-900 leading-tight">
                {selectedLessonData.title}
              </h3>

              {/* Parsed content mock Markdown renderer */}
              <div className="mt-6 font-sans text-xs md:text-sm text-zinc-650 leading-relaxed space-y-4">
                {selectedLessonData.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("### ")) {
                    return (
                      <h4 key={i} className="pt-2 font-sans text-xs md:text-sm font-bold text-zinc-900 border-l-2 border-orange-600 pl-3 uppercase tracking-wide">
                        {para.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (para.startsWith("* ")) {
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-2 select-none">
                        {para.split("\n").map((li, j) => (
                          <li key={j} className="text-xs md:text-sm">
                            {li.replace("* ", "")}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>

              {/* Core takeaways */}
              <div className="mt-8 rounded-xl bg-zinc-50 p-5 ring-1 ring-zinc-100">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-orange-600 rotate-90" />
                  <span className="font-sans text-xs font-bold text-zinc-900">
                    {language === "cn" ? "核心盈利与提效法则:" : "Core Leverage & Profit Rules:"}
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {selectedLessonData.takeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed">
                      <span className="font-mono text-orange-600 font-bold">{idx + 1}.</span>
                      <p>{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Checklist */}
            <div className="mt-8 border-t border-zinc-100 pt-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-zinc-500" />
                <span className="font-sans text-xs font-bold text-zinc-900">
                  {language === "cn" ? "一人实操冷启动检查表:" : "Solo Cold-Start Action Checklist:"}
                </span>
              </div>
              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedLessonData.checklist.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 rounded-lg border border-zinc-100 bg-white p-3 shadow-2xs">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-xs text-zinc-600 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
