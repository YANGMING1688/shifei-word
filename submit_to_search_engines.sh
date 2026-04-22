#!/bin/bash
#
# 搜索引擎提交脚本
# 提交 sitemap 到百度和 Bing
#

SITE="shifei.world"
SITEMAP_URL="https://shifei.world/sitemap.xml"

echo "============================================================"
echo "🚀 搜索引擎提交工具"
echo "============================================================"
echo ""
echo "网站：$SITE"
echo "Sitemap: $SITEMAP_URL"
echo ""

# 百度搜索资源平台提交
echo "📝 百度搜索资源平台提交"
echo "-----------------------------------------------------------"
echo "请按以下步骤手动提交："
echo ""
echo "1. 访问：https://ziyuan.baidu.com/"
echo "2. 登录并选择网站：$SITE"
echo "3. 进入「资源提交」→「sitemap 提交」"
echo "4. 输入 sitemap 地址：$SITEMAP_URL"
echo "5. 点击提交"
echo ""
echo "或者使用 API 提交（需要 token）："
echo ""
echo "curl -H 'Content-Type:text/plain' --data-binary @urls.txt \"http://data.zz.baidu.com/urls?site=$SITE&token=YOUR_TOKEN\""
echo ""
echo "urls.txt 文件格式（每行一个 URL）："
echo "https://shifei.world/"
echo "https://shifei.world/day1.html"
echo "https://shifei.world/day2.html"
echo "..."
echo ""

# Bing Webmaster Tools 提交
echo "📝 Bing Webmaster Tools 提交"
echo "-----------------------------------------------------------"
echo "请按以下步骤手动提交："
echo ""
echo "1. 访问：https://www.bing.com/webmasters"
echo "2. 登录并选择网站：$SITE"
echo "3. 进入「Sitemaps」"
echo "4. 点击「Submit a Sitemap」"
echo "5. 输入：$SITEMAP_URL"
echo "6. 点击提交"
echo ""

# Google Search Console 提交
echo "📝 Google Search Console 提交（可选）"
echo "-----------------------------------------------------------"
echo "请按以下步骤手动提交："
echo ""
echo "1. 访问：https://search.google.com/search-console"
echo "2. 登录并选择网站：$SITE"
echo "3. 进入「Sitemaps」"
echo "4. 输入：sitemap.xml"
echo "5. 点击提交"
echo ""

# 生成 URL 列表文件
echo "📄 生成 URL 列表文件..."
cd /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog

# 从 sitemap 提取 URL 列表
grep "<loc>" sitemap.xml | sed 's/.*<loc>//;s/<\/loc>.*//' > urls_for_submission.txt
URL_COUNT=$(wc -l < urls_for_submission.txt)

echo "✅ 生成 urls_for_submission.txt，包含 $URL_COUNT 个 URL"
echo ""
echo "文件位置：/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/urls_for_submission.txt"
echo ""

# 显示收录查询方法
echo "📈 收录查询方法"
echo "============================================================"
echo ""
echo "百度收录查询："
echo "  访问：https://www.baidu.com/s?wd=site:$SITE"
echo "  或直接搜索：site:$SITE"
echo ""
echo "Bing 收录查询："
echo "  访问：https://www.bing.com/search?q=site:$SITE"
echo "  或直接搜索：site:$SITE"
echo ""
echo "Google 收录查询："
echo "  访问：https://www.google.com/search?q=site:$SITE"
echo "  或直接搜索：site:$SITE"
echo ""

echo "============================================================"
echo "✅ 提交指南生成完成！"
echo "============================================================"
echo ""
echo "下一步操作："
echo "1. 使用百度资源平台提交 sitemap 或 API 推送"
echo "2. 使用 Bing Webmaster Tools 提交 sitemap"
echo "3. 24-48 小时后检查收录情况"
echo ""
