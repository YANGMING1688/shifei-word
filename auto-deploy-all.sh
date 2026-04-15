#!/bin/bash
# OPC 网站全自动部署 + 多平台同步提交
# 使用方式：./auto-deploy-all.sh

set -e

REPO_DIR="/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
BRANCH="main"
SITE="shifei.world"

echo "🦞 OPC 网站全自动部署 + 多平台同步"
echo "======================================"
echo "时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo ""

cd "$REPO_DIR"

# ==================== 第 1 步：Git 推送 ====================
echo "📦 第 1 步：Git 推送代码..."
echo "----------------------------------------"

# 检查是否有更改
if git diff --cached --quiet && git diff HEAD --quiet; then
    echo "✅ 没有新更改，跳过提交"
else
    echo "📝 添加所有更改..."
    git add -A
    
    echo "💾 提交更改..."
    git commit -m "🦞 OPC 网站自动更新：$(date +%Y-%m-%d)" || true
fi

echo "📥 拉取远程代码..."
git pull origin $BRANCH --rebase || true

echo "🚀 推送到 GitHub..."
if git push origin $BRANCH; then
    echo "✅ Git 推送成功！"
else
    echo "❌ Git 推送失败！请检查认证配置"
    echo "📖 解决方案：阅读 GIT_AUTO_DEPLOY.md 配置 GitHub 认证"
    exit 1
fi
echo ""

# ==================== 第 2 步：等待 Vercel 部署 ====================
echo "⏳ 第 2 步：等待 Vercel 自动部署..."
echo "----------------------------------------"
echo "📋 Vercel 将在 1-2 分钟内完成部署"
echo "🌐 查看部署状态：https://vercel.com/dashboard"
echo ""

# ==================== 第 3 步：百度资源平台提交 ====================
echo "🔍 第 3 步：提交到百度搜索资源平台..."
echo "----------------------------------------"
if [ -f "baidu_submit.py" ]; then
    # 检查是否配置了 token
    if grep -q "YOUR_BAIDU_TOKEN_HERE" baidu_submit.py; then
        echo "⚠️  百度 API token 未配置"
        echo "📖 配置方法：编辑 baidu_submit.py，替换 YOUR_BAIDU_TOKEN_HERE"
        echo "🔗 获取 token: https://ziyuan.baidu.com/site/index#/"
    else
        echo "🚀 执行百度提交..."
        python3 baidu_submit.py
    fi
else
    echo "⚠️  baidu_submit.py 不存在"
fi
echo ""

# ==================== 第 4 步：Bing IndexNow 提交 ====================
echo "🌏 第 4 步：提交到 Bing (IndexNow)..."
echo "----------------------------------------"
if [ -f "indexnow_submit.py" ]; then
    echo "🚀 执行 IndexNow 提交..."
    python3 indexnow_submit.py
else
    echo "⚠️  indexnow_submit.py 不存在"
fi
echo ""

# ==================== 第 5 步：验证部署 ====================
echo "✅ 第 5 步：验证网站部署..."
echo "----------------------------------------"
echo "🌐 测试网站访问..."
if curl -s --head "https://$SITE" | head -1 | grep -q "200"; then
    echo "✅ 网站访问正常：https://$SITE"
else
    echo "⚠️  网站访问可能有问题，请稍后检查"
fi

echo ""
echo "📊 检查最新提交..."
git log --oneline -1

echo ""
echo "======================================"
echo "🎉 部署完成！"
echo "======================================"
echo ""
echo "📋 后续验证步骤："
echo "1. 🌐 访问 https://$SITE 查看网站更新（强制刷新：Cmd+Shift+R）"
echo "2. 📊 Vercel 部署：https://vercel.com/dashboard"
echo "3. 🔍 百度收录：https://ziyuan.baidu.com/（等待 7-15 天）"
echo "4. 🌏 Bing 收录：https://www.bing.com/webmasters/（等待 3-7 天）"
echo "5. 🔎 Google 收录：https://search.google.com/search-console/"
echo ""
echo "🦞 OPC 一人公司 - AI 龙虾蟹自主运营"
echo "======================================"
