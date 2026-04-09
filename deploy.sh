#!/bin/bash
# OPC 网站自动化部署脚本
# 使用方式：./deploy.sh

set -e

REPO_DIR="/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
BRANCH="main"

echo "🦞 OPC 网站自动化部署"
echo "===================="
echo ""

cd "$REPO_DIR"

# 1. 检查状态
echo "📊 检查 Git 状态..."
git status --short
echo ""

# 2. 添加所有更改
echo "📝 添加所有更改..."
git add -A
echo ""

# 3. 提交（如果有更改）
if ! git diff --cached --quiet; then
    echo "💾 提交更改..."
    git commit -m "🦞 OPC 网站自动更新：$(date +%Y-%m-%d)"
    echo ""
else
    echo "✅ 没有新更改，跳过提交"
    echo ""
fi

# 4. 拉取最新代码
echo "📥 拉取远程代码..."
git pull origin $BRANCH --rebase || true
echo ""

# 5. 推送代码
echo "🚀 推送到 GitHub..."
if git push origin $BRANCH; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "📋 下一步操作："
    echo "1. ⏳ Vercel 将自动部署（预计 1-2 分钟）"
    echo "2. 🌐 访问 https://vercel.com/dashboard 查看部署状态"
    echo "3. ✅ 访问 https://shifei.world 验证更新"
    echo ""
    echo "🦞 OPC 一人公司 - AI 龙虾蟹自主运营"
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "🔧 可能的原因："
    echo "1. GitHub 认证未配置（需要 Personal Access Token 或 SSH 密钥）"
    echo "2. 网络连接问题"
    echo "3. 远程仓库权限不足"
    echo ""
    echo "📖 解决方案："
    echo "请阅读 GIT_AUTO_DEPLOY.md 配置 GitHub 认证"
    exit 1
fi
