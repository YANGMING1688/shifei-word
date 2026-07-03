/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

// Lazy initialize client per guide
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("Warning: GEMINI_API_KEY is not defined. AI Architect features will return styled fallback insights.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FOR_SAFETY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API for the AI Project Architect / Quote Planner
app.post("/api/architect", async (req, res) => {
  try {
    const { idea, context, language } = req.body;
    if (!idea) {
      return res.status(400).json({ error: "Idea description is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Mocked high-value JSON fallback in case key is missing so the app doesn't crash
      console.log("GEMINI_API_KEY missing - returning simulated high-fidelity response");
      return res.json(getSimulatedResponse(idea, context, language));
    }

    const ai = getGeminiClient();
    const isCn = language === "cn";
    
    const systemInstruction = `You are the Lead Principal Engineer and Chief AI Architect at OPC (OPC 一人公司) One Person Company Studio.
An entrepreneur wishes to design their business idea and wants you to map out a high-velocity, high-end OPC development blueprint and timeline.
Break down their project idea into a productized service schema. Formulate a 4-week Sprint roadmap (week 1-4 with weekly deliverables mapped as high-efficiency milestones), direct high-efficiency tech stack recommendation, monetization models (specifically tailored), and detail the financial value of getting it built by a hyper-efficient 1-person company (OPC) using advanced AI leverage instead of hiring a slow, bloated software agency.
Represent tasks literally (clean and developer-friendly).

${isCn ? `CRITICAL RULE: Since the user selected CHINESE, you MUST output all fields (appName, tagline, targetMarket, mvpCoreScope, sprints.title, sprints.tasks, sprints.deliverable, monetizationModels.modelName, monetizationModels.fitExplanation, opcValue.leveragedToolsAdvice) in pure, clear, and professional Chinese. You are STRICTLY FORBIDDEN from including any English terms or English translations inside parentheses (e.g. do NOT write things like "产品化订阅 (Productized Subscription)", write "产品化订阅制" instead). All general business or organizational terms must be fully translated to Chinese. Only the names of standard engineering technologies/libraries (like React, Tailwind CSS, Express, Supabase) may remain in their original English format.` : 'Write all explanation texts in English.'}`;

    const userPrompt = `Idea description: "${idea}".
Secondary context: "${context || "None provided"}".
Language: ${isCn ? "Chinese (No English in output explanations/parentheses)" : "English"}.

Formulate a high-caliber execution proposal matching the defined JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { 
              type: Type.STRING,
              description: "A clever, literal, and clean name for their app idea."
            },
            tagline: { 
              type: Type.STRING,
              description: "An elegant, punchy tagline explaining the unique selling proposition."
            },
            targetMarket: { 
              type: Type.STRING, 
              description: "Specific niche or beachhead market for this MVP."
            },
            mvpCoreScope: { 
              type: Type.STRING,
              description: "What exact killer feature is included in the 4-week MVP, keeping scope strictly tiny but fully functional."
            },
            sprints: {
              type: Type.ARRAY,
              description: "4-week sprint execution mapping.",
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: "Sprint objective/title." },
                  tasks: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "3-4 concrete development tasks for this week."
                  },
                  deliverable: { type: Type.STRING, description: "What can the client play with or inspect at the end of the week." },
                  difficulty: { 
                    type: Type.STRING, 
                    enum: ["Simple", "Moderate", "Complex"] 
                  }
                },
                required: ["week", "title", "tasks", "deliverable", "difficulty"]
              }
            },
            techStack: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Max 5 robust, modern technologies (e.g., Supabase, React + Tailwind, Express, Gemini, Vercel) that give the highest dev velocity."
            },
            monetizationModels: {
              type: Type.ARRAY,
              description: "How this solopreneur can make money from this product. Suggest exactly 2 models.",
              items: {
                type: Type.OBJECT,
                properties: {
                  modelName: { type: Type.STRING, description: "e.g., Monthly Subscription retainer, usage-based credits, productized fixed-fee" },
                  pricingTier: { type: Type.STRING, description: "Suggested launch prices (e.g., ¥199/mo or $49/mo)." },
                  fitExplanation: { type: Type.STRING, description: "Briefly explain why this makes sense." }
                },
                required: ["modelName", "pricingTier", "fitExplanation"]
              }
            },
            opcValue: {
              type: Type.OBJECT,
              properties: {
                agencyCostEstimate: { 
                  type: Type.NUMBER, 
                  description: "Bloated 5-person agency quote estimate in CNY (e.g., between 80000 and 150000)." 
                },
                agencyDurationMonths: { 
                  type: Type.NUMBER, 
                  description: " BLOATED agency duration (e.g., always 3 to 6 months)." 
                },
                opcDurationWeeks: { 
                  type: Type.NUMBER, 
                  description: "With OPC, this MVP will be completed in this many weeks (always 4)." 
                },
                clientSavingsPercent: { 
                  type: Type.NUMBER, 
                  description: "Direct cost discount calculation. Show their savings percentage (always 70% to 80%)." 
                },
                leveragedToolsAdvice: { 
                  type: Type.STRING, 
                  description: "List of high-leverage tools (e.g., cursor, boilerplates, AI triggers) that allow a single OPC designer-developer to match an entire 5-person agency." 
                }
              },
              required: ["agencyCostEstimate", "agencyDurationMonths", "opcDurationWeeks", "clientSavingsPercent", "leveragedToolsAdvice"]
            }
          },
          required: [
            "appName",
            "tagline",
            "targetMarket",
            "mvpCoreScope",
            "sprints",
            "techStack",
            "monetizationModels",
            "opcValue"
          ]
        }
      }
    });

    const bodyText = response.text || "{}";
    const data = JSON.parse(bodyText.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini API error in server:", error);
    return res.status(500).json({ error: error.message || "Failed to process project architect schema." });
  }
});

// REST API for the AI Workspace Developer assistant
app.post("/api/workspace-ai", async (req, res) => {
  try {
    const { title, description, language } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Task title and description are required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log("GEMINI_API_KEY missing - returning simulated dev response");
      return res.json({
        summary: language === "cn" 
          ? `【算力舱本地直连模式】已完成功能 "${title}" 的极速编译与自动化验证。系统无干扰流转一切正常，您可以正常体验看板和进行需求修改。`
          : `[Local Sandbox Mode] Deployed task "${title}" successfully. Live preview is updated and ready to be integrated.`,
        code: `// Built automatically by OPC Solo-Developer Engine\nexport function handleTask() {\n  console.log("Task '${title}' executed successfully.");\n}`,
        tips: language === "cn" ? "提示：在设置中配好您的 Gemini API 密钥可以启用全自动化智能代码解析生成服务。" : "Tip: Configure your Gemini API key in the Secrets panel to activate automated full-fidelity code generation."
      });
    }

    const ai = getGeminiClient();
    const isCn = language === "cn";

    const systemInstruction = `You are the Lead Principal Engineer and AI Full-Stack Developer at OPC One Person Company.
The client has submitted a task/feature request. You must implement it with extreme focus, and now write a comprehensive Developer Delivery and Code Walkthrough.
Format the response as a JSON object containing three fields:
- summary: A clear and elegant explanation of how the feature was engineered and validated.
- code: A beautiful, copyable code snippet (TypeScript, React, Node.js, or HTML/CSS) that implements the core business logic of this task. Include brief helpful comments inside the code.
- tips: A 1-2 sentence high-level, practical architectural advice for deploying or scaling this specific feature.

Do not use markdown wrappers inside the JSON string properties. Everything inside the JSON properties must be pure strings.
${isCn ? "CRITICAL RULE: All textual explanations in summary and tips MUST be in Chinese. Technologies and code comments can use English as appropriate." : "Write all texts in English."}`;

    const userPrompt = `Task Title: "${title}"
Task Description: "${description}"

Generate the complete JSON developer delivery note.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A summary of how this task was built." },
            code: { type: Type.STRING, description: "The core TypeScript/React/Node.js code implementation." },
            tips: { type: Type.STRING, description: "Engineering tips for this feature." }
          },
          required: ["summary", "code", "tips"]
        }
      }
    });

    const bodyText = response.text || "{}";
    const data = JSON.parse(bodyText.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini API error in workspace developer:", error);
    return res.status(500).json({ error: error.message || "Failed to process task." });
  }
});

// Setup Vite server-side integration per instructions
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OPC Control Tower Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

// High-fidelity local database mock for quick backup when key is missing or system offline
function getSimulatedResponse(idea: string, context: string, language?: string): any {
  const words = idea.slice(0, 15) + (idea.length > 15 ? "..." : "");
  const isEn = language === "en";

  if (isEn) {
    return {
      appName: "Silo " + (idea.split(" ")[0] || "Next"),
      tagline: "High-velocity validation engine powered by AI and solo architecture",
      targetMarket: "Founders and independent development teams seeking lean launches",
      mvpCoreScope: `For the requested idea "${words}", focus on a 4-week core closed-loop MVP including responsive client view, secure database schema, and automated service API.`,
      sprints: [
        {
          week: 1,
          title: "System Blueprint, Database Schema & UI Skeleton",
          tasks: [
            "Design database entity schemas and relations",
            "Build high-fidelity responsive Tailwind consumer board",
            "Setup Express and Vite API pipeline and authentication"
          ],
          deliverable: "Interactive frontend prototype with fully connected database middleware",
          difficulty: "Simple"
        },
        {
          week: 2,
          title: "Core Functional Workflows & Logic Pipeline",
          tasks: [
            "Develop core algorithm controller or API ingestion pipeline",
            "Integrate third-party user authorization and local persistence layers",
            "Implement user settings, preferences, and basic event notification rules"
          ],
          deliverable: "Operational business data model supporting full state transition from console",
          difficulty: "Moderate"
        },
        {
          week: 3,
          title: "Integrations, Secure Billing Hooks & Client Workspace",
          tasks: [
            "Write third-party automation integration hooks to push events to external boards",
            "Implement mock billing checkout flow and feature gates",
            "Enhance workspace board with dynamic task backlog and state transitions"
          ],
          deliverable: "End-to-end service workspace supporting fully functional mock payments and feature flows",
          difficulty: "Complex"
        },
        {
          week: 4,
          title: "Deployment Configuration, Hardening & Analytics Dashboard",
          tasks: [
            "Perform thorough latency, load, and security vulnerability audits",
            "Create automated migration scripts and prepare production server configurations",
            "Construct admin stats analytics dashboard containing telemetry and usage graphs"
          ],
          deliverable: "Full cloud-native production deployment package with a 1-page operator manual",
          difficulty: "Moderate"
        }
      ],
      techStack: ["React 19", "Vite", "Tailwind CSS", "Express Server", "Gemini AI"],
      monetizationModels: [
        {
          modelName: "Productized Retainer",
          pricingTier: "¥3,500 / mo",
          fitExplanation: "Allows clients to queue unlimited development requests. Highly affordable with zero management overhead."
        },
        {
          modelName: "Hyperspeed Sprint Package",
          pricingTier: "¥9,800 / week",
          fitExplanation: "Designed for validating early-stage MVPs. High-fidelity delivery in under 5 working days."
        }
      ],
      opcValue: {
        agencyCostEstimate: 95000,
        agencyDurationMonths: 4,
        opcDurationWeeks: 4,
        clientSavingsPercent: 78,
        leveragedToolsAdvice: "Using AI-driven autocomplete, battle-tested boilerplates, and async workflow boards, OPC completely eliminates meeting noise and redundant coordination, converting agency overhead into massive product speed and budget savings."
      }
    };
  }

  return {
    appName: "Silo " + (idea.split(" ")[0] || "Next"),
    tagline: "由人工智能与单兵架构驱动的高速落地业务引擎",
    targetMarket: "追求精益落地、快速验证市场的创始人与独立开发者团队",
    mvpCoreScope: `针对所提需求 “${words}”，4周内聚焦研发核心最小可行性闭环，包含响应式客户端、数据安全模型与自动化服务接口。`,
    sprints: [
      {
        week: 1,
        title: "系统蓝图、数据库设计与界面骨架",
        tasks: [
          "设计完备的数据存储实体及关联架构表结构",
          "构建高保真的 Tailwind 响应式客户看板与核心控制页面",
          "搭建 Express + Vite 前后端管道与安全校验控制台"
        ],
        deliverable: "交互式前端原型与可连通的基础数据库中间件",
        difficulty: "Simple"
      },
      {
        week: 2,
        title: "关键业务功能模型与底层引擎对接",
        tasks: [
          "开发适配该想法的核心算法控制器或人工智能数据接入通道",
          "集成第三方身份授权与本地持久化层结构",
          "实现用户基础设置与偏好存储，搭建第一版任务通知逻辑"
        ],
        deliverable: "具备可操作性的业务数据模型，支持在控制台完成核心流转",
        difficulty: "Moderate"
      },
      {
        week: 3,
        title: "外部系统集成、支付通道与客户工作区",
        tasks: [
          "编写第三方自动化对接模块，将数据推送给外部协同平台",
          "植入可切换的模拟支付确认及订阅授权锁",
          "完善看板交互，实现客户提交需求、进度追踪与实时状态卡片"
        ],
        deliverable: "支持业务交互的端到端服务系统，包括虚拟订阅支付闭环",
        difficulty: "Complex"
      },
      {
        week: 4,
        title: "部署流配置、安全测试与自动化集成",
        tasks: [
          "执行整体系统的深度可用性与高抗压延迟测试",
          "编写一键迁移脚本，开启服务端高性能托管配置",
          "搭建后台运营看板（包含收益分析、流转指标与用量追踪）"
        ],
        deliverable: "支持生产上线的完整云端应用程序，附带一人开箱即用的运维手册",
        difficulty: "Moderate"
      }
    ],
    techStack: ["React 19", "Vite", "Tailwind CSS", "Express Server", "Gemini AI"],
    monetizationModels: [
      {
        modelName: "产品化订阅制",
        pricingTier: "¥3,500 / 月",
        fitExplanation: "允许客户提交不限量的微型开发需求，一次处理一个任务。为企业提供比全职雇用便宜 80% 且无需管理成本的专属研发管道。"
      },
      {
        modelName: "高能冲刺包",
        pricingTier: "¥9,800 / 单周冲刺",
        fitExplanation: "用于快速从 0 到 1 爆发式产出核心最小可行产品。五天以内完美交付一个高保真模块或原型，切中高频验证痛点。"
      }
    ],
    opcValue: {
      agencyCostEstimate: 95000,
      agencyDurationMonths: 4,
      opcDurationWeeks: 4,
      clientSavingsPercent: 78,
      leveragedToolsAdvice: "凭借人工智能双语架构自动补全、通用模板状态机模块、以及 1 对 1 零干扰异步工单看板。一人公司在无会议拖沓、无多层沟通折损的情况下，直接把传统多岗交叉扯皮的时间榨干为 0，从而实现 80% 的成本结余馈赠给创始合伙人。"
    }
  };
}

startServer();
