#!/bin/bash

# 🦞 OPC 网站自动同步脚本
# 用途：自动提交并部署网站更新
# 使用：./auto-sync.sh "更新说明"

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
WEBSITE_DIR="/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
DEPLOY_MSG="${1:-🦞 OPC 网站自动更新}"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}🦞 OPC 网站自动同步${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# 进入网站目录
cd "$WEBSITE_DIR"

# 检查 Git 状态
echo -e "${YELLOW}📊 检查文件变更...${NC}"
git status --short

# 添加所有变更
echo -e "${YELLOW}📝 添加文件变更...${NC}"
git add -A

# 检查是否有变更
if git diff --staged --quiet; then
    echo -e "${GREEN}✅ 没有新的变更${NC}"
    exit 0
fi

# 提交变更
echo -e "${YELLOW}💾 提交变更...${NC}"
git commit -m "$DEPLOY_MSG"

# 推送到 GitHub（触发 Vercel 自动部署）
echo -e "${YELLOW}🚀 推送到 GitHub...${NC}"
git push origin main

# 完成
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ 同步完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}📱 Vercel 正在自动部署...${NC}"
echo -e "查看部署进度：https://vercel.com/dashboard"
echo ""
echo -e "${YELLOW}⏱️  预计 1-2 分钟后生效${NC}"
echo ""
