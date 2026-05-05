#!/bin/bash
# 搜索引擎 URL 提交脚本
# 生成 URL 列表并推送到各搜索引擎

set -e

BLOG_DIR="/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
SITE_URL="https://shifei.world"

echo "============================================================"
echo "搜索引擎 URL 提交工具"
echo "============================================================"

cd "$BLOG_DIR"

# 生成 URL 列表
echo ""
echo "📋 生成 URL 列表..."

> urls.txt
for file in *.html; do
    # 跳过模板和错误页面
    if [[ "$file" == "day-template.html" ]] || [[ "$file" == "404.html" ]]; then
        continue
    fi
    
    # 处理首页
    if [[ "$file" == "index.html" ]]; then
        echo "$SITE_URL/" >> urls.txt
    else
        echo "$SITE_URL/$file" >> urls.txt
    fi
done

URL_COUNT=$(wc -l < urls.txt)
echo "✅ 已生成 $URL_COUNT 个 URL"

# 显示 URL 列表
echo ""
echo "URL 列表:"
cat urls.txt | head -10
echo "... (共 $URL_COUNT 个)"

# 生成 IndexNow key 文件
echo ""
echo "🔑 生成 IndexNow key 文件..."
INDEXNOW_KEY="indexnow_$(date +%Y%m%d_%H%M%S)"
echo "$INDEXNOW_KEY" > "$INDEXNOW_KEY.txt"
echo "✅ Key 文件已生成：$INDEXNOW_KEY.txt"
echo "   请上传到网站根目录：https://shifei.world/$INDEXNOW_KEY.txt"

# 百度推送提示
echo ""
echo "🔍 百度搜索资源平台提交:"
echo "   1. 访问：https://ziyuan.baidu.com/site/index"
echo "   2. 选择网站 shifei.world"
echo "   3. 链接提交 → sitemap → 输入：https://shifei.world/sitemap.xml"
echo ""
echo "   或使用 API 推送:"
echo "   curl -H 'Content-Type:text/plain' --data-binary @urls.txt \\"
echo "     'http://data.zz.baidu.com/urls?site=shifei.world&token=YOUR_TOKEN'"

# Bing 提交提示
echo ""
echo "🔍 Bing Webmaster Tools 提交:"
echo "   1. 访问：https://www.bing.com/webmasters"
echo "   2. 选择网站 shifei.world"
echo "   3. Sitemaps → Submit a Sitemap → https://shifei.world/sitemap.xml"

# Google 提交提示
echo ""
echo "🔍 Google Search Console 提交:"
echo "   1. 访问：https://search.google.com/search-console"
echo "   2. 选择网站 shifei.world"
echo "   3. Sitemaps → 输入 sitemap.xml → 提交"

echo ""
echo "============================================================"
echo "✅ URL 列表已准备就绪"
echo "============================================================"
echo ""
echo "下一步操作:"
echo "1. 将 sitemap.xml 和 urls.txt 部署到网站根目录"
echo "2. 将 $INDEXNOW_KEY.txt 上传到网站根目录"
echo "3. 在各搜索引擎平台提交 sitemap"
echo ""
