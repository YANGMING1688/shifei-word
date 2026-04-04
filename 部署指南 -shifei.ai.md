# 🚀 shifei.ai 部署上线完整指南

## 📋 任务目标

将网站部署到互联网，使用域名 **shifei.ai**，让全网可以搜索到。

---

## ✅ 第一步：购买域名 shifei.ai

### 推荐购买平台

| 平台 | 网址 | .ai 域名价格 | 优点 |
|------|------|-------------|------|
| **Namesilo** | namesilo.com | ~$60-80/年 | 便宜、免费隐私保护 |
| **Cloudflare** | cloudflare.com | 成本价 | 管理方便、免费 DNS |
| **阿里云** | wanwang.aliyun.com | ~¥500-700/年 | 中文界面、支付宝 |
| **GoDaddy** | godaddy.com | ~$60-80/年 | 老牌、促销多 |

### 购买步骤（以 Namesilo 为例）

```
1. 访问 namesilo.com
2. 搜索框输入：shifei.ai
3. 点击搜索，查看是否可注册
4. 如果可用，加入购物车
5. 注册/登录账号
6. 填写注册信息（隐私保护免费勾选）
7. 付款（支持支付宝/PayPal/信用卡）
8. 完成购买，获得域名管理权限
```

### ⚠️ 如果 shifei.ai 已被注册

备选域名方案：
- shifei-ai.com
- shifeicreator.com
- shifei-startup.com
- 世飞.ai（中文域名）
- shifei.xyz

---

## ✅ 第二步：创建 GitHub 仓库

### 2.1 注册 GitHub（如已有账号跳过）

```
1. 访问 github.com
2. 点击 "Sign up"
3. 输入邮箱、密码、用户名
4. 验证邮箱
5. 完成注册
```

### 2.2 创建仓库

```
1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. Repository name: shifei-ai（或 shifei.ai）
4. 选择 "Public"
5. 不要勾选 "Initialize this repository with a README"
6. 点击 "Create repository"
```

### 2.3 上传网站代码

在终端执行以下命令：

```bash
# 进入网站目录
cd /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "初始版本 - 世飞 shifei.ai 一人公司创业心得"

# 关联远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/shifei-ai.git

# 重命名分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

---

## ✅ 第三步：部署到 Vercel

### 3.1 注册 Vercel

```
1. 访问 vercel.com
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub"
4. 授权 Vercel 访问你的 GitHub 账号
```

### 3.2 导入项目

```
1. 登录后点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 页面
3. 找到 shifei-ai 仓库
4. 点击 "Import"
```

### 3.3 部署配置

```
1. Framework Preset: 选择 "Other"
2. Root Directory: 保持 "./"
3. Build Command: 留空（静态网站不需要）
4. Output Directory: 留空（默认 public）
5. 点击 "Deploy"
6. 等待部署完成（约 30 秒）
7. 获得临时网址：shifei-ai-xxx.vercel.app
```

### 3.4 测试访问

```
1. 点击 "Visit" 按钮
2. 确认网站正常显示
3. 检查所有链接和功能
```

---

## ✅ 第四步：绑定域名 shifei.ai 到 Vercel

### 4.1 在 Vercel 添加域名

```
1. 进入 Vercel 项目控制台
2. 点击 "Settings" → "Domains"
3. 点击 "Add" 按钮
4. 输入：shifei.ai
5. 点击 "Add"
6. 系统会显示 DNS 配置要求
```

### 4.2 配置 DNS（在域名管理平台）

根据 Vercel 的提示，在域名管理后台添加以下记录：

**记录 1 - A 记录（根域名）**
```
类型：A
名称：@
值：76.76.21.21
TTL: 自动
```

**记录 2 - CNAME 记录（www 子域名）**
```
类型：CNAME
名称：www
值：cname.vercel-dns.com
TTL: 自动
```

### 4.3 在域名平台设置 DNS 的位置

| 平台 | 设置位置 |
|------|---------|
| Namesilo | Domain Manager → DNS Manager |
| Cloudflare | DNS → Records |
| 阿里云 | 控制台 → 域名 → DNS 修改 |
| GoDaddy | My Products → DNS |

### 4.4 等待 DNS 生效

```
• 通常 5-30 分钟生效
• 最长可能需要 24-48 小时
• 可在 Vercel 查看验证状态
• 生效后 Vercel 会自动配置 SSL 证书（免费）
```

### 4.5 验证是否成功

```
1. 浏览器访问：https://shifei.ai
2. 应该看到你的网站
3. 地址栏有绿色锁图标（SSL 正常）
```

---

## ✅ 第五步：提交到搜索引擎（关键！）

### 5.1 Google Search Console

```
1. 访问：search.google.com/search-console
2. 用 Google 账号登录
3. 点击 "添加资源"
4. 选择 "域名" 类型
5. 输入：shifei.ai
6. Vercel 会自动添加 TXT 记录验证，或手动在域名 DNS 添加
7. 验证通过后，点击 "Sitemaps"
8. 提交：sitemap.xml
9. 点击 "URL 检查" → 输入 https://shifei.ai → 请求编入索引
```

**预期时间：3-7 天收录**

### 5.2 百度搜索资源平台

```
1. 访问：ziyan.baidu.com
2. 注册/登录百度账号
3. 点击 "添加网站"
4. 输入：shifei.ai
5. 验证所有权（HTML 文件或 DNS 验证）
6. 验证通过后，点击 "数据提交" → "sitemap"
7. 提交：https://shifei.ai/sitemap.xml
8. 使用 "快速收录" 功能（如有）
```

**预期时间：1-4 周收录**

### 5.3 Bing Webmaster Tools

```
1. 访问：www.bing.com/webmasters
2. 用 Microsoft/Google 账号登录
3. 点击 "Add Site"
4. 输入：https://shifei.ai
5. 验证所有权（复制 meta 标签到网站 <head> 或上传文件）
6. 验证通过后，点击 "Sitemaps"
7. 提交：sitemap.xml
```

**预期时间：3-7 天收录**

---

## ✅ 第六步：加速收录和排名

### 6.1 持续更新内容

```
• 每周至少发布 1-2 篇新文章
• 固定时间更新（如每周一、四）
• 搜索引擎喜欢活跃的网站
```

### 6.2 外部链接建设

```
• 在知乎回答相关问题，引用你的文章
• 在小红书分享创业心得 + 网站链接
• 在微信公众号发布文章 + 阅读原文链接
• 在掘金/简书/CSDN 发布技术文章 + 网站链接
• 加入创业社群，分享你的故事
```

### 6.3 社交媒体推广

```
• Twitter/X：发布创业进展
• 微博：分享创业日记
• 朋友圈：定期更新
• LinkedIn：专业内容分享
```

### 6.4 内容 SEO 优化

```
• 文章标题包含关键词（一人公司、创业、AI）
• 每篇文章 800 字以上
• 使用小标题（H2/H3）分段
• 添加图片和 alt 描述
• 内部链接（文章之间互相引用）
```

---

## ⏱️ 时间预期总览

| 步骤 | 耗时 | 等待时间 |
|------|------|---------|
| 购买域名 | 10 分钟 | - |
| 创建 GitHub | 5 分钟 | - |
| 上传代码 | 5 分钟 | - |
| 部署 Vercel | 5 分钟 | 1 分钟 |
| 绑定域名 | 10 分钟 | 5-60 分钟 |
| Google 收录 | - | 3-7 天 |
| 百度收录 | - | 1-4 周 |
| Bing 收录 | - | 3-7 天 |
| 搜索关键词有排名 | - | 1-3 个月 |

---

## 🔍 如何检查是否成功

### 检查域名解析
```
在终端执行：
ping shifei.ai
nslookup shifei.ai
```

### 检查 Google 收录
```
在 Google 搜索：
site:shifei.ai

如果看到你的页面 = 已收录 ✅
```

### 检查百度收录
```
在百度 搜索：
site:shifei.ai

如果看到你的页面 = 已收录 ✅
```

### 检查网站可访问性
```
直接访问：
https://shifei.ai
https://www.shifei.ai

两个都应该正常打开
```

---

## 📞 常见问题

### Q1: 域名显示已被注册怎么办？
```
A: 尝试备选域名：
   • shifei-ai.com
   • shifeicreator.com
   • shifei-startup.com
   • 世飞.ai
```

### Q2: DNS 一直不生效？
```
A: 
   • 等待 24-48 小时
   • 检查 DNS 记录是否正确
   • 清除本地 DNS 缓存（终端：sudo dscacheutil -flushcache）
   • 联系域名客服
```

### Q3: 长时间不被搜索引擎收录？
```
A:
   • 检查 robots.txt 是否允许爬虫
   • 确认 sitemap.xml 格式正确
   • 持续更新内容（至少每周 1 篇）
   • 增加外部链接（社交媒体、友链）
   • 使用搜索引擎的"主动推送"功能
```

### Q4: Vercel 部署失败？
```
A:
   • 检查 GitHub 仓库是否公开
   • 确认 index.html 在根目录
   • 查看 Vercel 部署日志
   • 重新触发部署
```

---

## 📊 上线检查清单

- [ ] 域名 shifei.ai 已购买
- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已部署
- [ ] 域名已绑定到 Vercel
- [ ] DNS 已生效（访问 shifei.ai 正常）
- [ ] SSL 证书已生效（https 正常）
- [ ] Google Search Console 已提交
- [ ] 百度搜索资源平台已提交
- [ ] Bing Webmaster Tools 已提交
- [ ] sitemap.xml 可正常访问
- [ ] robots.txt 可正常访问

---

## 🎯 下一步行动

**现在需要我帮你执行：**

1. **检查域名是否可注册** - 我可以搜索确认
2. **执行 git 命令上传代码** - 直接帮你推送
3. **生成更多 SEO 优化内容** - 添加更多文章
4. **创建社交媒体推广文案** - 帮你宣传

告诉我从哪一步开始！🚀

---

**祝 shifei.ai 早日上线，被全网搜索到！** 🎉

*一人公司，从被世界看见开始*
