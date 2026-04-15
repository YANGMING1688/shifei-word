#!/bin/bash
# OPC 网站自动化部署脚本（简化版）
# 使用方式：./deploy.sh

set -e

REPO_DIR="/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
BRANCH="main"

echo "🦞 OPC 网站自动化部署"
echo "===================="
echo ""

cd "$REPO_DIR"

# 1. 添加所有更改
echo "📝 添加所有更改..."
git add -A

# 2. 提交（如果有更改）
if ! git diff --cached --quiet; then
    echo "💾 提交更改..."
    git commit -m "🦞 OPC 网站自动更新：$(date +%Y-%m-%d)"
else
    echo "✅ 没有新更改"
fi

# 3. 拉取最新代码
echo "📥 拉取远程代码..."
git pull origin $BRANCH --rebase || true

# 4. 推送代码
echo "🚀 推送到 GitHub..."
if git push origin $BRANCH; then
    echo "✅ 推送成功！"
    echo ""
    echo "📋 下一步："
    echo "1. ⏳ Vercel 自动部署中（1-2 分钟）"
    echo "2. 🌐 https://vercel.com/dashboard 查看状态"
    echo "3. ✅ https://shifei.world 验证更新（Cmd+Shift+R）"
    echo ""
    echo "🦞 OPC 一人公司 - AI 龙虾蟹自主运营"
else
    echo "❌ 推送失败！请检查 GitHub 认证"
    exit 1
fi
