# Git 自动化部署技能

> 用于 OPC 网站的自动化 Git 推送和 Vercel 部署

---

## 🎯 功能

1. **自动推送代码到 GitHub**
2. **检查 Vercel 部署状态**
3. **验证网站更新**

---

## 🔐 配置 GitHub 认证

### 方式一：使用 GitHub Personal Access Token（推荐）

#### 第 1 步：生成 Token
```
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 填写备注：OPC Auto Deploy
4. 选择权限：
   ✅ repo (Full control of private repositories)
   ✅ workflow (Update GitHub Action workflows)
5. 点击 "Generate token"
6. 复制生成的 token（只显示一次！）
```

#### 第 2 步：配置 Token 到 macOS 密钥链
```bash
# 将 YOUR_TOKEN 替换为实际 token
git credential-osxkeychain erase
host=github.com
protocol=https
^D

git credential-osxkeychain store
host=github.com
protocol=https
username=YANGMING1688
password=YOUR_TOKEN
^D
```

#### 第 3 步：测试推送
```bash
cd /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog
git push origin main
```

---

### 方式二：使用 SSH 密钥

#### 第 1 步：生成 SSH 密钥
```bash
ssh-keygen -t ed25519 -C "yangming@opctool.com"
# 一路回车即可
```

#### 第 2 步：添加公钥到 GitHub
```bash
# 查看公钥内容
cat ~/.ssh/id_ed25519.pub

# 复制输出内容，然后：
# 1. 访问 https://github.com/settings/keys
# 2. 点击 "New SSH key"
# 3. 粘贴公钥内容
# 4. 点击 "Add SSH key"
```

#### 第 3 步：切换远程为 SSH
```bash
cd /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog
git remote set-url origin git@github.com:YANGMING1688/shifei-word.git
git push origin main
```

---

## 📜 自动化部署脚本

### deploy.sh（一键部署）

```bash
#!/bin/bash
# OPC 网站自动化部署脚本

set -e

REPO_DIR="/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
BRANCH="main"

echo "🦞 OPC 网站自动化部署"
echo "===================="

cd "$REPO_DIR"

# 1. 检查状态
echo "📊 检查 Git 状态..."
git status

# 2. 拉取最新代码
echo "📥 拉取远程代码..."
git pull origin $BRANCH || true

# 3. 推送代码
echo "🚀 推送到 GitHub..."
git push origin $BRANCH

# 4. 验证推送
if [ $? -eq 0 ]; then
    echo "✅ 推送成功！"
    echo ""
    echo "📋 下一步："
    echo "1. Vercel 将自动部署（1-2 分钟）"
    echo "2. 访问 https://vercel.com/dashboard 查看状态"
    echo "3. 访问 https://shifei.world 验证更新"
else
    echo "❌ 推送失败，请检查认证配置"
    exit 1
fi
```

### 使用方法
```bash
# 赋予执行权限
chmod +x /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/deploy.sh

# 执行部署
/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/deploy.sh
```

---

## 🤖 Cron 自动化配置

### 每日自动部署任务

```json
{
  "name": "OPC 网站每日自动部署",
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * *",
    "tz": "Asia/Shanghai"
  },
  "payload": {
    "kind": "systemEvent",
    "text": "🦞 OPC 网站每日自动部署任务：\n1. cd /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog\n2. git add -A\n3. git commit -m '🦞 每日自动更新'\n4. git push origin main\n5. 验证 Vercel 部署状态"
  },
  "sessionTarget": "main"
}
```

---

## 📊 Vercel 部署验证

### 检查部署状态
```bash
# 使用 Vercel CLI
npx vercel ls

# 或者访问
https://vercel.com/YANGMING1688/shifei-word
```

### 验证网站更新
```bash
# 检查网站首页
curl -s https://shifei.world | grep -o "<title>.*</title>"

# 检查特定页面
curl -I https://shifei.world
```

---

## 🔧 故障排查

### 问题 1: 推送需要认证
```bash
# 检查是否配置了 credential helper
git config --global credential.helper

# 如果是 osxkeychain，检查密钥链中是否有 GitHub 凭证
# 打开"钥匙串访问"应用，搜索 "github.com"
```

### 问题 2: Token 过期
```bash
# 重新生成 Token 并配置
# 参考上方"方式一"的步骤
```

### 问题 3: SSH 密钥问题
```bash
# 测试 SSH 连接
ssh -T git@github.com

# 如果失败，重新配置 SSH 密钥
```

---

## 📞 快速入口

| 平台 | 链接 |
|------|------|
| GitHub Tokens | https://github.com/settings/tokens |
| GitHub SSH Keys | https://github.com/settings/keys |
| Vercel Dashboard | https://vercel.com/dashboard |
| OPC 网站 | https://shifei.world |

---

*最后更新：2026-04-09*
