#!/bin/bash
# 百度资源平台 - 快速推送脚本
# 使用方法：./baidu_push_quick.sh YOUR_TOKEN

SITE="shifei.world"
SITEMAP_FILE="sitemap.xml"
OUTPUT_FILE="urls.txt"

echo "🦞 百度资源平台 - 快速推送脚本"
echo "================================"

# 检查参数
if [ -z "$1" ]; then
    echo ""
    echo "❌ 请提供 token 参数"
    echo ""
    echo "使用方法："
    echo "  ./baidu_push_quick.sh YOUR_TOKEN"
    echo ""
    echo "获取 token："
    echo "1. 访问 https://ziyuan.baidu.com/site/index#/"
    echo "2. 验证网站：shifei.world"
    echo "3. 搜索服务 → 普通收录 → 资源提交 → API 提交"
    echo "4. 复制 token= 后面的字符串"
    echo ""
    exit 1
fi

TOKEN="$1"

echo ""
echo "📄 解析 sitemap.xml..."

# 提取 sitemap 中的所有 URL
python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('$SITEMAP_FILE')
ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = [url.text for url in tree.findall('ns:url/ns:loc', ns)]
print('\n'.join(urls))
" > "$OUTPUT_FILE"

URL_COUNT=$(wc -l < "$OUTPUT_FILE")
echo "✅ 找到 $URL_COUNT 个 URL"

echo ""
echo "🚀 推送到百度..."
echo "目标域名：$SITE"
echo "Token: ${TOKEN:0:10}..."

# 执行推送
RESPONSE=$(curl -s -H 'Content-Type:text/plain' --data-binary @"$OUTPUT_FILE" "http://data.zz.baidu.com/urls?site=$SITE&token=$TOKEN")

echo ""
echo "📊 推送结果:"
echo "$RESPONSE" | python3 -m json.tool

echo ""
echo "================================"
echo "💡 提示："
echo "1. 访问 https://ziyuan.baidu.com/ 查看收录状态"
echo "2. 等待 7-15 天查看百度收录结果"
echo ""

# 清理临时文件
rm -f "$OUTPUT_FILE"
