export type Language = "cn" | "en";

export interface TranslationDictionary {
  // Navigation
  tabAgency: string;
  tabWorkspace: string;
  tabPlanner: string;
  tabPlaybook: string;
  planHeaderBtn: string;
  
  // Hero
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDesc: string;
  heroBtnPlan: string;
  heroBtnPlaybook: string;
  
  // Calculator
  calcTitle: string;
  calcDesc: string;
  calcLabelTeamSize: string;
  calcLabelSalary: string;
  calcLabelAgencies: string;
  calcTraditionalCost: string;
  calcOpcCost: string;
  calcSavings: string;
  calcEfficiencyTitle: string;
  calcEfficiencyValue: string;
  calcTraditionalLabel: string;
  calcOpcLabel: string;
  calcUnitPersons: string;
  calcUnitRmb: string;
  calcUnitMonth: string;

  // Pricing
  pricingTitleBadge: string;
  pricingTitle: string;
  pricingDesc: string;
  pricingTogglePersonal: string;
  pricingToggleCompany: string;
  
  pricingSprintName: string;
  pricingSprintPrice: string;
  pricingSprintPriceCompany: string;
  pricingSprintSub: string;
  pricingSprintDesc: string;
  pricingSprintFeatures: string[];
  pricingSprintFeaturesCompany: string[];
  pricingSprintBtn: string;
  
  pricingMonthName: string;
  pricingMonthPrice: string;
  pricingMonthPriceCompany: string;
  pricingMonthSub: string;
  pricingMonthDesc: string;
  pricingMonthFeatures: string[];
  pricingMonthFeaturesCompany: string[];
  pricingMonthBtn: string;
  pricingRecommend: string;

  pricingAdvisorName: string;
  pricingAdvisorPrice: string;
  pricingAdvisorPriceCompany: string;
  pricingAdvisorSub: string;
  pricingAdvisorDesc: string;
  pricingAdvisorFeatures: string[];
  pricingAdvisorFeaturesCompany: string[];
  pricingAdvisorBtn: string;

  // FAQ
  faqTitleBadge: string;
  faqTitle: string;
  faqsList: { q: string; a: string }[];

  // Workspace / Control Tower
  workspaceBadge: string;
  workspaceTitle: string;
  workspaceDesc: string;
  workspaceSimBtn: string;
  workspaceColTodo: string;
  workspaceColProgress: string;
  workspaceColDelivered: string;
  workspaceSequentialLock: string;
  workspaceEngineSpeed: string;
  workspaceInterferenceZero: string;
  workspaceSimulating: string;
  workspaceSimStep1: string;
  workspaceSimStep2: string;
  workspaceSimStep3: string;
  workspaceSimStep4: string;
  workspaceFeedbackArch: string;
  workspaceTaskTitle1: string;
  workspaceTaskDesc1: string;
  workspaceTaskTitle2: string;
  workspaceTaskDesc2: string;
  workspaceTaskTitle3: string;
  workspaceTaskDesc3: string;
  workspaceTaskTitle4: string;
  workspaceTaskDesc4: string;
  workspaceNewTaskPlaceholder: string;
  workspaceAddTaskBtn: string;
  workspaceTaskActionDev: string;
  workspaceTaskActionDeliver: string;
  workspaceTaskActionArchive: string;

  // AI Planner / Estimator
  plannerTitle: string;
  plannerDesc: string;
  plannerPlaceholder: string;
  plannerSubmitBtn: string;
  plannerLoading0: string;
  plannerLoading1: string;
  plannerLoading2: string;
  plannerLoading3: string;
  plannerLoading4: string;
  plannerLoading5: string;
  plannerDrawingTitle: string;
  plannerResultTitle: string;
  plannerResultDesc: string;
  plannerWeeks: string;
  plannerTechStack: string;
  plannerMonetize: string;
  plannerValueComp: string;
  plannerTraditionalCost: string;
  plannerOpcTime: string;
  plannerSprints: string;

  // Playbook
  playbookTitle: string;
  playbookDesc: string;
  playbookLessonCat: string;
  playbookRuleTitle: string;
  playbookChecklistTitle: string;
  playbookAll: string;
  playbookCatCase: string;
  playbookCatMonetize: string;
  playbookCatOps: string;
  playbookCatBiz: string;

  // Footer
  footerDesc: string;
  footerContractTitle: string;
  footerContractDesc: string;
  footerRights: string;
  footerTerms: string;
  footerNda: string;
  footerSubPolicy: string;

  // Auth
  authLogin: string;
  authRegister: string;
  authEmail: string;
  authUsername: string;
  authPassword: string;
  authConfirmPassword: string;
  authNoAccount: string;
  authHaveAccount: string;
  authLoginBtn: string;
  authRegisterBtn: string;
  authLogout: string;
  authWelcome: string;
  authProfile: string;
  authCredits: string;
  authStatus: string;
  authMembership: string;
  authSuccessLogin: string;
  authSuccessRegister: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  cn: {
    tabAgency: "AI 搭建舱",
    tabWorkspace: "控制塔",
    tabPlanner: "智能规划器",
    tabPlaybook: "极客黑匣子",
    planHeaderBtn: "立即自助搭建",
    
    heroBadge: "自智一键搭建系统已上线：告别代建，算力成本更低廉",
    heroTitleLine1: "你的产品创意，无需他人代劳",
    heroTitleLine2: "在平台自助一键部署，享有高能低功耗算力",
    heroDesc: "欢迎来到自智 AI 自助搭建平台。这是一个为追求极致生产力的创作者量身定制的 SaaS 级自助部署平台。客户无需再找人工团队进行昂贵低效的开发。我们直接为您提供全套即插即用的核心 SaaS 模板组件。月租、季度、年租订阅支持算力池扣减与自助打包机制，购买算力额度一键自助部署在独立云容器内，极大降低开发与服务器运维开销，开启真正的极致单兵被动收入帝国。",
    heroBtnPlan: "一键自助生成全栈蓝图",
    heroBtnPlaybook: "查阅 AI 自助部署极客秘籍",
    
    calcTitle: "极致单兵算力杠杆计算器",
    calcDesc: "自助产品化搭建最关键的开销节余，在于彻底干掉了开发团队的人工溢价与服务器高昂空转成本。在平台，我们采用『算力池共享』机制，把自研模板与高性能云端服务器资源进行精细化整合。拉动下方参数，看看自智算力订阅能为您节省多少昂贵的开发与部署开销：",
    calcLabelTeamSize: "原计划雇佣/外包人数",
    calcLabelSalary: "原计划人均月薪资/开发费",
    calcLabelAgencies: "原计划服务器/维护年度预算",
    calcTraditionalCost: "传统自建/代建模式总开销",
    calcOpcCost: "自智 AI 会员版算力订阅",
    calcSavings: "为您省下研发部署开销达",
    calcEfficiencyTitle: "生产力综合杠杆比率",
    calcEfficiencyValue: "节省近 98% 现金流，一键上线效率提升 1000%",
    calcTraditionalLabel: "传统外包/自建团队/独立购买服务器",
    calcOpcLabel: "自智 AI 算力会员自助订阅",
    calcUnitPersons: "人",
    calcUnitRmb: "元",
    calcUnitMonth: "/期",

    pricingTitleBadge: "极低损耗的云算力订阅套餐",
    pricingTitle: "选择最适合您商业验证节奏的自助算力套餐",
    pricingDesc: "没有繁琐合同、更无溢价人工费。我们提供专为独立极客设计的个人会员，以及支持高强度吞吐与团队共享的公司会员，让每一分算力额度都精准跑在业务第一线。",
    pricingTogglePersonal: "个人会员 (Personal)",
    pricingToggleCompany: "公司/企业会员 (Enterprise)",
    
    pricingSprintName: "月度算力会员 (Monthly Pro)",
    pricingSprintPrice: "¥198",
    pricingSprintPriceCompany: "¥498",
    pricingSprintSub: " / 月",
    pricingSprintDesc: "适合快速验证点子的创作者。自助一键打包发布，解锁全套基础 SaaS 组件与标准算力容量。",
    pricingSprintFeatures: [
      "每月 25,000 算力点数 (用于 AI 高速编译、数据库分配及 API 吞吐)",
      "自助一键搭建：无需人工介入，在平台一键自动打包并安全部署 to 容器",
      "全功能直接套用：内置微信登录、海外/国内收单、自动化通知等模板",
      "算力售卖降本：通过池化共享算力，彻底免除自建昂贵主机开销",
      "支持按月随时取消或一键暂停冷冻"
    ],
    pricingSprintFeaturesCompany: [
      "每月 80,000 算力点数 (充沛的企业级算力，支持多租户与高吞吐并发)",
      "自助一键搭建：支持全队多卡槽，自动打包并安全部署到隔离云容器",
      "全功能企业套用：内置微信/支付宝登录、全球多通道收单、企业飞书/微信通知",
      "算力池企业共享：团队成员共享算力额度，极致压低开发与基础设施开销",
      "支持按月随时取消 or 一键暂停冷冻"
    ],
    pricingSprintBtn: "按月订阅并极速部署",
    
    pricingMonthName: "季度至尊会员 (Quarterly Max)",
    pricingMonthPrice: "¥498",
    pricingMonthPriceCompany: "¥1,280",
    pricingMonthSub: " / 季 (立省 ¥96)",
    pricingMonthDesc: "最受高频创作者欢迎的套餐。提供更充裕的算力配额、高优先级编译通道和全栈隔离沙箱。",
    pricingMonthFeatures: [
      "每季度 85,000 算力点数 (进一步摊薄单次编译和请求成本)",
      "自选功能画布：在安全的隔离环境和数据沙箱内自定义装配高级模块",
      "算力点数退回：未消耗完的算力额度支持按比例回退到账号余额或抵扣下期",
      "自智控制塔台：全自主控制面板，24小时在线打包，彻底干掉漫长会签",
      "代码资产移交：支持随时一键打包下载、无缝移交物理代码及本地运行底盘"
    ],
    pricingMonthFeaturesCompany: [
      "每季度 260,000 算力点数 (超大规模算力配额，满足多条产品线并发需求)",
      "专属多租户沙箱：更深层次的计算资源物理隔离与优先级别编译通道",
      "算力回退与转赠：多余算力额度支持团队内划转或抵扣未来计费周期",
      "企业级控制塔：提供可视化管理后台、团队协作权限和资源精细配额控制",
      "离线化资产交付：提供一键物理打包并支持完全离线部署至自建私有服务器"
    ],
    pricingMonthBtn: "立即开通季度至尊权限",
    pricingRecommend: "热门推荐",

    pricingAdvisorName: "年度旗舰会员 (Annual Ultimate)",
    pricingAdvisorPrice: "¥1,680",
    pricingAdvisorPriceCompany: "¥3,980",
    pricingAdvisorSub: " / 年 (立省 ¥696)",
    pricingAdvisorDesc: "为专业独立极客和工作室打造的终极性价比之选。锁定极低算力费率，打造长期被动收入资产。",
    pricingAdvisorFeatures: [
      "每年 400,000 算力点数 (极高性比算力资源，极致压低产品长期维护损耗)",
      "不限次数部署卡槽：支持绑定多个独立本地域名，满足多产品矩阵验证需求",
      "附赠 1v1 极客架构战略咨询：年度专业架构师对口指导，缩短从点子到交付链路",
      "安全行级隔离：数据库全局采用 Row-Level Security 策略，充分确保个人业务私密性"
    ],
    pricingAdvisorFeaturesCompany: [
      "每年 1,200,000 算力点数 (海量算力额度，可完美支撑多个生产级 SaaS 的顺畅运行)",
      "无限自助部署插槽：支持部署无限量项目，并提供自定义多 VPC 绑定与专属网关支持",
      "专属资深企业架构师：1v1 深度架构诊断、专有编译管线优化及持续战略保障",
      "金融级行级隔离：提供更高物理层面的多租户隔离、专属加密密钥管理及全栈合规审计支持"
    ],
    pricingAdvisorBtn: "立即解锁年度旗舰尊享",

    faqTitleBadge: "关于自助搭建与算力会员的常问问题",
    faqTitle: "透明坦诚：解开您对平台自助部署模式的所有顾虑",
    faqsList: [
      {
        q: "为什么我们要客户自己搭建，而不是人工代为搭建？",
        a: "人工代建包含昂贵的时间沟通损耗、高昂的工程师和项目经理雇佣溢价。在平台，我们开发了全套『自智化一键搭建系统』。您只需在后台控制塔输入您的产品蓝图或点子，平台即刻自动合成高规格、高弹性的全栈代码、微信登录、收单及数据库架构。让您在不写代码的情况下，通过极其低廉的自选算力会员套餐完成 100% 独立系统发布，费用仅为传统外包的 1%，效率高出 10 倍。"
      },
      {
        q: "‘算力额度 (Compute Credits)’是如何工作的？它如何帮我降低自建服务器成本？",
        a: "如果自建服务器，即使没有流量，您也得按月支付昂贵的主机和带宽费。在平台，我们采用『算力售卖与资源池共享机制』。您的应用只有在活跃生成、运行和实际发生 API 吞吐时才会扣减算力额度。平台依靠海量集群规模，极大均摊了服务器空转成本，并将这部分节余的开支以极具性价比的算力会员套餐返还给客户，真正实现零门槛拥有全功能独立 SaaS。"
      },
      {
        q: "我没有技术背景，真的能靠自己完成系统搭建与发布吗？",
        a: "完全可以！我们的控制塔将复杂的数据库配置、微信接口和支付系统抽象成了即插即用的模块组件。结合我们的『智能蓝图规划器』，系统会为您自动推荐最简工具链并完成一键后台关联。您只需要在可视化面板上像填空一样配置您自己的微信号和支付密钥，48 小时内自动合成为可在公网独立运行的系统，极速落地商业闭环。"
      },
      {
        q: "代码与数据的所有权归谁？如何交割？",
        a: "所有权百分百属于您！即使是自助搭建，我们提供完整的 GitHub 代码仓库一键同步转让与离线系统包打包。当您想要完全脱离平台自建时，可一键将自动部署的所有代码 and 物理数据库无缝搬迁到您自备的私有服务器中，平台绝不锁死任何资产。"
      }
    ],

    workspaceBadge: "自智自搭建控制塔",
    workspaceTitle: "0 门槛、自助配置、一键极速发布：这就是你的控制面板",
    workspaceDesc: "在这个真实的自助搭建面板上，您可以自由配置新功能卡片，触发自动编译。平台拥有全自动容器编排引擎，相比人工开发，我们的 AI 系统能够根据您的需求，在后台直接生成开箱即用的类型安全 TypeScript 代码并快速打包上线，算力消耗极低、运行效率极高。",
    workspaceSimBtn: "一键模拟“自助一键自动生成与云端打包部署”",
    workspaceColTodo: "自选功能模板库",
    workspaceColProgress: "正在极速编译 / 云端容器打包中",
    workspaceColDelivered: "自主发布成功 / 可在线运行实例",
    workspaceSequentialLock: "平台并发编译锁：保障单轨高效发布",
    workspaceEngineSpeed: "编译打包引擎运行中... 耗电与算力精细控制中",
    workspaceInterferenceZero: "免服务器维护，容器自适应弹性收拢",
    workspaceSimulating: "云端容器正在极速自动化部署中...",
    workspaceSimStep1: "[1/4] 🚀 正在锁定客户自定义参数，初始化独立云卡槽...",
    workspaceSimStep2: "[2/4] ⚙️ AI 编译运行中：正在自动合入全栈无服务器底盘，配置微信扫码和数据库 RLS 行级规则...",
    workspaceSimStep3: "[3/4] 🔒 正在自动绑定 SSL 证书、执行安全审计以及编译完好性检测...",
    workspaceSimStep4: "[4/4] 🌟 自助发布成功！系统已被安全隔离并部署到云端容器中，点击即可预览和移交全部代码仓库。",
    workspaceFeedbackArch: "系统编译交付简报: '报告，您订购的 SaaS 模板已被完美合入容器。微信号直连、Stripe 收单及数据库多租户安全拦截层已完成自智配置，物理代码包已就绪，随时支持一键打包导出。'",
    workspaceTaskTitle1: "一键配置：高转化软件商业落地页（带交互估算器）",
    workspaceTaskDesc1: "自助开通完全响应式的产品介绍页，包含动态成本对比滑块、价格卡片、以及基于估算器的智能架构生成入口。",
    workspaceTaskTitle2: "支付打通：配置 Stripe 定期收单与冷冻回调",
    workspaceTaskDesc2: "在控制台输入 Stripe 密钥。平台自动为您配置 Express 支付路由、用户套餐扣款事件监听以及自助暂停的冷冻契约。",
    workspaceTaskTitle3: "通知触发：微信模板消息与录屏通知绑定",
    workspaceTaskDesc3: "配置您的微信开发者凭证。当您的系统产生新用户交易，触发微信服务号通知，自动将交易凭证投递到您的个人微信中。",
    workspaceTaskTitle4: "数据沙箱：一键开启 PostgreSQL 多租户行级安全隔离",
    workspaceTaskDesc4: "使用一键数据库模板。开启最安全的 PostgreSQL 行级安全规则，保护您客户的信息完全独立并物理隔离在自有库中。",
    workspaceNewTaskPlaceholder: "输入自选功能（例如：绑定个人独立域名，开启支付宝免签通道）...",
    workspaceAddTaskBtn: "将新功能加入自选功能库",
    workspaceTaskActionDev: "一键启动容器编译",
    workspaceTaskActionDeliver: "云端打包发布",
    workspaceTaskActionArchive: "稳定运行并导出离线包",

    plannerTitle: "AI 搭建蓝图规划舱",
    plannerDesc: "有点子想开展变现，不知道该如何挑选 SaaS 模板和预算？输入您的构想，让智能架构规划助理在 10 秒内为您精算出一套“自助搭建路线图”，并自动推荐能最大化利用算力、降低运营成本的工具链堆栈。",
    plannerPlaceholder: "描述你想构建的产品想法（例如：“一个针对小红书创作者的 AI 扩图工具，带微信收费，包含自助一键去背景”...）",
    plannerSubmitBtn: "一键获取全自助搭建蓝图",
    plannerLoading0: "正在检索全球 SaaS 模板库...",
    plannerLoading1: "正在精减非必要人工及重资产冗余，配置算力消耗...",
    plannerLoading2: "正在拼装自智化里程碑及一键自建功能包...",
    plannerLoading3: "正在编排极低成本的 Serverless 云容器自动部署堆栈...",
    plannerLoading4: "正在预算客户运营所需的月度/年度会员式算力配额...",
    plannerLoading5: "自助搭建架构方案精算完毕！已呈递至控制面板。",
    plannerDrawingTitle: "正在绘制特制自助部署蓝图",
    plannerResultTitle: "🎯 你的 AI 自助搭建蓝图已就绪",
    plannerResultDesc: "智能分析师已为您自动过滤高昂外包服务，锁定了最纯粹、能完全靠平台自助在 4 周内完成配置与独立运行的安全闭环链路：",
    plannerWeeks: "周",
    plannerTechStack: "🛠️ 平台推荐高算力效能工具链 (AI Tech Stack)",
    plannerMonetize: "💰 推荐高转化自助变现及算力节余设计",
    plannerValueComp: "⚖️ 会员制算力自助搭建 vs 传统代建高昂开销对比",
    plannerTraditionalCost: "传统人工代建/找外包耗时",
    plannerOpcTime: "一键自助发布耗时",
    plannerSprints: "自主搭建 4 周拼装航线",

    playbookTitle: "独立创作者全球自助搭建与变现内参",
    playbookDesc: "学习全球最顶尖、最赚钱的单兵独立创作者（Solopreneur）如何自己解决搭建、依靠算力销售与自动化极速收割市场被动流。",
    playbookLessonCat: "创作者专属 briefings",
    playbookRuleTitle: "自助搭建与算力套现法则:",
    playbookChecklistTitle: "独立极客 0 代码拼装上线检查表:",
    playbookAll: "全部秘笈",
    playbookCatCase: "名家案例",
    playbookCatMonetize: "赚钱与算力售卖",
    playbookCatOps: "极致自助与降本 Stacks",
    playbookCatBiz: "高转化流量与商业爆发",

    footerDesc: "本平台是一个创新的 AI 自助搭建与云端容器发布平台。我们通过拼装池化算力、精选自研 SaaS 核心模板，帮助全球极客与创作者告别高昂代建，用极低门槛的算力会员方案自主解决 100% 产品落地，彻底终结传统外包。",
    footerContractTitle: "自智承诺：0 人工参与、100% 极速透明",
    footerContractDesc: "我们坚信真正的生产力不依赖冗长开会，而是让客户自己在高能平台上解决搭建。所有算力损耗与编译打包状态完全自主可控。",
    footerRights: "© 2026 AI 自助搭建平台. 保留所有权利。",
    footerTerms: "服务条款",
    footerNda: "数据隔离协议",
    footerSubPolicy: "算力订阅与回购政策",

    // Auth CN
    authLogin: "客户登录",
    authRegister: "注册新账号",
    authEmail: "电子邮箱 或 手机号",
    authUsername: "用户昵称",
    authPassword: "登录密码",
    authConfirmPassword: "确认密码",
    authNoAccount: "还没有账号？立即免费注册",
    authHaveAccount: "已有账号？立即登录",
    authLoginBtn: "安全登录",
    authRegisterBtn: "一键注册并初始化算力",
    authLogout: "退出登录",
    authWelcome: "欢迎回来",
    authProfile: "自智账户中心",
    authCredits: "剩余算力点数",
    authStatus: "卡槽运行状态",
    authMembership: "当前会员等级",
    authSuccessLogin: "登录成功！欢迎回到控制塔。",
    authSuccessRegister: "注册成功！已为您免费初始化 5,000 体验算力点数。"
  },
  en: {
    tabAgency: "AI Build Bay",
    tabWorkspace: "Control Tower",
    tabPlanner: "AI Roadmap Planner",
    tabPlaybook: "Creator Playbook",
    planHeaderBtn: "Build Self-Serve",
    
    heroBadge: "Self-Serve Deployment Active: Say Goodbye to DFY Developers, Compute is Cheaper",
    heroTitleLine1: "Build & Deploy Your Product Ideas",
    heroTitleLine2: "Completely Self-Serve with Flexible Cloud Compute Pricing",
    heroDesc: "Welcome to our AI Self-Serve Build Platform. We are a premier serverless container deployment and SaaS module platform built for maximum creator leverage. Eliminate the need for expensive custom development or bloated agencies. We directly provide complete plug-and-play core SaaS templates. Subscribe to Monthly, Quarterly, or Yearly plans to run everything autonomously with dedicated compute units, lowering your operational overhead to absolute zero.",
    heroBtnPlan: "Generate Full-Stack Blueprint",
    heroBtnPlaybook: "Unlock Solopreneur Deployment Guide",
    
    calcTitle: "Creator Compute Leverage Calculator",
    calcDesc: "The core savings in self-serve development come from bypassing artificial engineering premiums and heavy idle server overhead. On our platform, we pool resources so you only pay for actual compilation and API operations. Adjust the parameters below to see how much budget you save with flexible compute memberships:",
    calcLabelTeamSize: "Planned Custom Hires / Freelancers",
    calcLabelSalary: "Planned Team Average Monthly Fee",
    calcLabelAgencies: "Annual Server/Maintenance Budget",
    calcTraditionalCost: "Estimated Custom Development Cost",
    calcOpcCost: "AI Compute Subscription",
    calcSavings: "Total Operational Budget Saved",
    calcEfficiencyTitle: "Total Leverage Multiplier",
    calcEfficiencyValue: "Saves nearly 98% cash flow, accelerates deployment 10x",
    calcTraditionalLabel: "Traditional Agencies / Hiring / Dedicated VPS",
    calcOpcLabel: "AI Compute Subscription",
    calcUnitPersons: "people",
    calcUnitRmb: "CNY",
    calcUnitMonth: "/cycle",

    pricingTitleBadge: "Flexible Low-Cost Compute Tiers",
    pricingTitle: "Select the Best Compute Plan for Your Self-Serve Journey",
    pricingDesc: "No complex contracts, no manual service marks. Apply scalable cloud memberships, utilize platform credits, and run your SaaS at ultimate micro-budgets.",
    pricingTogglePersonal: "Personal Membership",
    pricingToggleCompany: "Corporate Membership",
    
    pricingSprintName: "Monthly Pro Membership",
    pricingSprintPrice: "¥198",
    pricingSprintPriceCompany: "¥498",
    pricingSprintSub: " / month",
    pricingSprintDesc: "Perfect for builders validating ideas. Deploy yourself in 1-click, unlocking core SaaS templates and standard compute limits.",
    pricingSprintFeatures: [
      "25,000 Compute Credits/mo (Used for AI compiling, DB indexing, and APIs)",
      "Self-Serve Deployment: Zero developers needed, automatic container compilation",
      "Plug-and-Play: Built-in login portals, global payment integrations, & webhook routers",
      "Pooled Hosting: Drastically lowers costs by sharing redundant container bandwidth",
      "Flexible subscription: Pause or cancel instantly with no lock-ins"
    ],
    pricingSprintFeaturesCompany: [
      "80,000 Compute Credits/mo (Dedicated enterprise scale for multi-tenant throughput)",
      "One-click Deployment: Zero manual overhead, secure compile sandbox with dual slots",
      "Enterprise-ready SaaS components: Integrated global payment portals, multi-channel logins, & webhook queues",
      "Pooled Enterprise hosting: Share redundant credits across teams to fully minimize waste",
      "Flexible scaling: Upgrade, pause, or freeze any slot dynamically with zero penalties"
    ],
    pricingSprintBtn: "Subscribe Monthly & Deploy",
    
    pricingMonthName: "Quarterly Max Membership",
    pricingMonthPrice: "¥498",
    pricingMonthPriceCompany: "¥1,280",
    pricingMonthSub: " / quarter (Save ¥96)",
    pricingMonthDesc: "Our most popular package for high-frequency creators. Richer compute quotas, priority compiling queue, and advanced sandboxing.",
    pricingMonthFeatures: [
      "85,000 Compute Credits/quarter (Lowering your per-operation compiling costs)",
      "Self-Serve Canvas: Deploy advanced components with isolated multi-tenant sandboxes",
      "Credit Rollback: Unused compute credits can be recycled to offset billing cycles",
      "Interactive Control Tower: Build on your own time with zero meeting overhead",
      "Complete Source IP: Package and export 100% offline runnable codebases anytime"
    ],
    pricingMonthFeaturesCompany: [
      "260,000 Compute Credits/quarter (Massive scaling designed for high-frequency workflows)",
      "Dedicated Multi-Tenant Sandboxing: Deeper isolation levels and priority cloud compilation",
      "Credit Rollovers & Buybacks: Roll over unused compute credits or convert to account credits",
      "Enterprise Control Tower: Visual administrative portals, designated workspace structures",
      "Source IP ownership: Package and export 100% offline runnable container-ready assets"
    ],
    pricingMonthBtn: "Get Quarterly Max Access",
    pricingRecommend: "RECOMMENDED",

    pricingAdvisorName: "Annual Ultimate Membership",
    pricingAdvisorPrice: "¥1,680",
    pricingAdvisorPriceCompany: "¥3,980",
    pricingAdvisorSub: " / year (Save ¥696)",
    pricingAdvisorDesc: "Ultimate value for professional solopreneurs and indie studios. Lock in the lowest compute rates to build long-term passive income assets.",
    pricingAdvisorFeatures: [
      "400,000 Compute Credits/year (Our absolute lowest rate to slash operational waste)",
      "Unlimited self-serve deployment slots, custom independent domain binding",
      "Included 1v1 Strategic Consulting: Get year-round architectural guidance from Lead Architect",
      "Full Enterprise Isolation: Multi-tenant Row-Level Security for absolute data privacy"
    ],
    pricingAdvisorFeaturesCompany: [
      "1,200,000 Compute Credits/year (Unmatched scale to power multiple production-grade SaaS lines)",
      "Unlimited self-serve slots: Deploy unlimited projects with custom domains, custom VPC bindings",
      "Designated Enterprise Architect: 1v1 dedicated strategic consultations and custom pipeline optimization",
      "Absolute Row-Level Security: Hardened physics isolation layers using standard RLS & safe encryption key stores"
    ],
    pricingAdvisorBtn: "Unlock Annual Ultimate Membership",

    faqTitleBadge: "F.A.Q on Self-Serve Building & Compute Subscriptions",
    faqTitle: "Transparency & Trust: Demystifying the Self-Serve SaaS Infrastructure",
    faqsList: [
      {
        q: "Why should customers build themselves rather than hiring manual developers?",
        a: "Manual development introduces immense time sync lags, communication mismatches, and engineering premium markups. On our platform, we built a fully autonomous one-click compiler. You input your product roadmap, and our platform instantly provisions typed React/TypeScript codes, login routers, payment webhooks, and database schemas. You deploy 100% of the working system yourself at 1% of the cost of a traditional developer."
      },
      {
        q: "How do Compute Credits work, and how does it reduce server costs?",
        a: "If you buy a dedicated server, you pay full monthly rent even with zero traffic. On our platform, we use a pooled resource & compute credit mechanism. Your app only deducts credits when performing active AI compilation, system runtime triggers, or API roundtrips. By sharing scale across thousands of creators, we cut idle waste and return those massive savings to you."
      },
      {
        q: "I don't have a deep tech background. Can I really deploy this myself?",
        a: "Absolutely! Our Control Tower abstracts database schemas, WeChat APIs, and Stripe keys into simple plug-and-play toggle settings. Combined with our AI Roadmap Planner, the system maps your exact toolchain. You simply paste your keys and handles, and your production-ready app is live in 48 hours."
      },
      {
        q: "Who owns the code and database assets?",
        a: "You own them 100%. We provide automatic one-click GitHub repository transfers and local offline code packaging. If you ever decide to leave our platform, you can export and migrate your entire database and code to your own private servers instantly with no vendor lock-in."
      }
    ],

    workspaceBadge: "Control Tower",
    workspaceTitle: "Zero Complexity, Self-Configurable, One-Click Live: Your Dashboard",
    workspaceDesc: "On this interactive console, you can select templates and trigger automatic cloud compiles. Our container orchestration engine reads your specifications, compiles typing-safe TypeScript, and deploys it live in seconds, minimizing compute cost and maximizing runtime speed.",
    workspaceSimBtn: "Simulate 1-Click Container Compile & Live Deployment",
    workspaceColTodo: "Available SaaS Template Modules",
    workspaceColProgress: "Compiling / Compressing Container Assets",
    workspaceColDelivered: "Deployed Successfully / Live Sandbox App",
    workspaceSequentialLock: "Platform Compiler Lock: Ensuring High-Throughput Delivery",
    workspaceEngineSpeed: "Auto-Packager Running... Optimizing power & memory footprint",
    workspaceInterferenceZero: "Zero server maintenance, elastic serverless scale-down",
    workspaceSimulating: "Compiling and packaging cloud container live...",
    workspaceSimStep1: "[1/4] 🚀 Locking configuration parameters and initializing secure card slot...",
    workspaceSimStep2: "[2/4] ⚙️ AI compilation active: merging Express backend, binding login cookies, and checking Postgres schemas...",
    workspaceSimStep3: "[3/4] 🔒 Provisioning SSL certification, executing integrity audit, and securing database row permissions...",
    workspaceSimStep4: "[4/4] 🌟 Self-Serve Deployment Complete! Securely isolated in our cloud container pool, code repo is ready to sync.",
    workspaceFeedbackArch: "System Autopackage Log: 'SaaS templates merged successfully. Auth routes, billing webhooks, and database privacy layers have been fully self-configured. Code assets are packaged and ready to export.'",
    workspaceTaskTitle1: "Configure: High-Conversion Marketing Page with Estimator",
    workspaceTaskDesc1: "Provision a responsive product introduction page equipped with dynamic savings sliders, tier comparison tables, and direct AI roadmap exports.",
    workspaceTaskTitle2: "Billing: Connect Stripe Subscription & Cold Freeze Hooks",
    workspaceTaskDesc2: "Configure your Stripe secret key to automatically map subscription checkout handlers, automatic monthly renewals, and client freeze/resume triggers.",
    workspaceTaskTitle3: "Notifications: Setup WeChat/Discord Event Notification Triggers",
    workspaceTaskDesc3: "Sync developer access credentials. Whenever a customer transactions on your SaaS, trigger instant messaging cards to your admin handles.",
    workspaceTaskTitle4: "PostgreSQL: Activate Multi-Tenant Row-Level Security",
    workspaceTaskDesc4: "Enable secure database tables with Drizzle Postgres RLS. Ensure each client's workspaces, transactional histories, and private keys are strictly isolated.",
    workspaceNewTaskPlaceholder: "Enter desired feature (e.g., Bind custom independent domain, attach Alipay)...",
    workspaceAddTaskBtn: "Add to Available Module Backlog",
    workspaceTaskActionDev: "Trigger Cloud Compilation",
    workspaceTaskActionDeliver: "Container Deploy Live",
    workspaceTaskActionArchive: "Mark Live & Export Offline Code",

    plannerTitle: "SaaS Blueprint Planning Cabin",
    plannerDesc: "Have a business idea but need to calculate compute costs and SaaS stacks? Pitch your vision, and our planner will map out a precise 4-week self-serve building roadmap with optimum low-cost tool recommendations.",
    plannerPlaceholder: "Describe your concept (e.g., 'An AI background remover micro-SaaS with Stripe monthly billing' ...)",
    plannerSubmitBtn: "Generate My Build Roadmap",
    plannerLoading0: "Scanning global SaaS module dictionaries...",
    plannerLoading1: "Optimizing compute budgets and stripping manual developer overhead...",
    plannerLoading2: "Composing self-serve compilation sequences...",
    plannerLoading3: "Mapping ultra-low-cost Serverless database and runtime stacks...",
    plannerLoading4: "Predicting your required monthly scalable credit quota...",
    plannerLoading5: "Self-serve stack configuration ready! Loading dashboard.",
    plannerDrawingTitle: "Mapping Self-Serve Build Blueprint",
    plannerResultTitle: "🎯 Your Self-Serve Building Roadmap is Ready",
    plannerResultDesc: "The AI strategist has configured a lightweight, cost-optimized 4-week assembly sequence for your SaaS to ensure maximum credit efficiency:",
    plannerWeeks: "Wk",
    plannerTechStack: "🛠️ Recommended Cost-Efficient Tooling Stack (AI Tech Stack)",
    plannerMonetize: "💰 Optimized Monetization & Compute Credit Recycling",
    plannerValueComp: "⚖️ Self-Serve Compute Subscription vs Traditional Development Overhead",
    plannerTraditionalCost: "Traditional Outsourced Development",
    plannerOpcTime: "Self-Serve Compile Time",
    plannerSprints: "Self-Serve 4-Week Assembly Roadmap",

    playbookTitle: "Indie Creator's Self-Serve Build Playbook",
    playbookDesc: "Learn how the world's most profitable solopreneurs deploy systems, resell compute capacity, and leverage automation to capture market share alone.",
    playbookLessonCat: "Creator briefing",
    playbookRuleTitle: "Rules of Solopreneur Cashflow Leverage:",
    playbookChecklistTitle: "No-Code High-Throughput Checklist:",
    playbookAll: "All Lessons",
    playbookCatCase: "Case Studies",
    playbookCatMonetize: "Monetization & Credit Sales",
    playbookCatOps: "Self-Serve Ops & Stacks",
    playbookCatBiz: "Creator Traffic & Growth",

    footerDesc: "Our platform is a self-serve AI SaaS generation and container cloud deployment platform. By utilizing pooled compute credits and pre-engineered SaaS blueprints, we enable makers to deploy robust business solutions at the cost of a standard low-cost cloud subscription.",
    footerContractTitle: "Autonomous Commitment: 0% Meeting Noise, 100% Control",
    footerContractDesc: "We believe true builders belong in production. Track compile records, container load, and code transfers live, at any hour.",
    footerRights: "© 2026 AI Build Hub. All rights reserved.",
    footerTerms: "Terms",
    footerNda: "Data Isolation SLA",
    footerSubPolicy: "Credit Recycling Policies",

    // Auth EN
    authLogin: "Customer Login",
    authRegister: "Register Account",
    authEmail: "Email or Phone Number",
    authUsername: "Nickname",
    authPassword: "Password",
    authConfirmPassword: "Confirm Password",
    authNoAccount: "Don't have an account? Sign up free",
    authHaveAccount: "Already have an account? Log in",
    authLoginBtn: "Secure Log In",
    authRegisterBtn: "Sign Up & Initialize Credits",
    authLogout: "Log Out",
    authWelcome: "Welcome Back",
    authProfile: "Account Control Cabin",
    authCredits: "Compute Credits Left",
    authStatus: "Container Status",
    authMembership: "Current Membership",
    authSuccessLogin: "Successfully logged in! Welcome back to the Control Tower.",
    authSuccessRegister: "Account created successfully! Initialized 5,000 free demo credits."
  }
};
