#!/usr/bin/env python3
"""
SEO 自动优化脚本
功能：
1. 扫描所有 HTML 文件生成 sitemap
2. 优化页面 SEO（title, meta, keywords, 结构化数据）
3. 添加内部链接
4. 提交到搜索引擎
5. 生成 SEO 报告
"""

import os
import re
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime
from urllib.parse import urlparse
import urllib.request
import urllib.error

# 配置
BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")
BASE_URL = "https://shifei.world"
BAIDU_TOKEN = os.getenv("BAIDU_SEO_TOKEN", "YOUR_BAIDU_TOKEN_HERE")
BING_API_KEY = os.getenv("BING_SEO_KEY", "YOUR_BING_KEY_HERE")

# SEO 数据
SEO_DATA = {
    "index": {
        "title": "OPC 一人公司 - AI 龙虾蟹养成日记",
        "description": "OPC 一人公司创业实验，养了只 AI 龙虾蟹。记录一人公司的创业历程，分享 AI 赋能、效率工具、创业心得。",
        "keywords": "一人公司，创业心得，AI 助手，效率工具，自由职业，远程工作，个人品牌，创业日记"
    },
    "articles": {
        "title": "所有文章 - OPC 一人公司",
        "description": "OPC 一人公司所有文章汇总，包含创业日记、AI 优化实验、效率工具分享等内容。",
        "keywords": "文章列表，创业文章，AI 文章，效率工具"
    },
    "about": {
        "title": "关于 - OPC 一人公司",
        "description": "了解 OPC 一人公司项目，AI 龙虾蟹养成计划，以及行上科技的使命。",
        "keywords": "关于 OPC，行上科技，AI 龙虾蟹"
    },
    "founder": {
        "title": "创始人 - 世飞 OPC",
        "description": "世飞 OPC 的创业故事，从大厂到一人公司的转变历程。",
        "keywords": "创始人，世飞，创业故事"
    },
    "company": {
        "title": "公司 - 行上科技",
        "description": "行上科技公司介绍，专注于 AI 工具和效率提升。",
        "keywords": "行上科技，公司介绍，AI 工具"
    },
    "skills": {
        "title": "技能 - OPC 一人公司",
        "description": "OPC 一人公司使用的技能栈，包括 AI 工具、效率方法等。",
        "keywords": "技能栈，AI 工具，效率方法"
    },
    "timeline": {
        "title": "时间线 - OPC 一人公司创业历程",
        "description": "OPC 一人公司创业时间线，记录重要里程碑。",
        "keywords": "时间线，创业历程，里程碑"
    },
    "cross-border-ecommerce": {
        "title": "跨境电商 - OPC 一人公司",
        "description": "跨境电商相关内容，出海机会与挑战。",
        "keywords": "跨境电商，出海，国际贸易"
    },
    "inspiring-article": {
        "title": "励志文章 - OPC 一人公司",
        "description": "激励人心的创业文章，保持前行的动力。",
        "keywords": "励志，创业激励，动力"
    },
    "ai-experiment": {
        "title": "AI 优化实验 - OPC 一人公司",
        "description": "AI 优化实验记录，探索 AI 在创业中的应用。",
        "keywords": "AI 实验，AI 优化，人工智能"
    },
    "week1-review": {
        "title": "第一周复盘 - OPC 一人公司",
        "description": "OPC 一人公司第一周创业复盘，经验总结。",
        "keywords": "周复盘，创业总结，经验教训"
    },
    "status": {
        "title": "状态 - OPC 一人公司",
        "description": "OPC 一人公司当前状态更新。",
        "keywords": "状态，更新"
    },
    "404": {
        "title": "页面未找到 - OPC 一人公司",
        "description": "抱歉，您访问的页面不存在。",
        "keywords": "404，页面未找到"
    }
}

def get_all_html_files():
    """扫描所有 HTML 文件"""
    html_files = []
    for f in BLOG_DIR.glob("*.html"):
        if f.name not in ["day-template.html"]:  # 排除模板
            html_files.append(f)
    return sorted(html_files, key=lambda x: x.name)

def get_file_mtime(filepath):
    """获取文件修改时间"""
    mtime = os.path.getmtime(filepath)
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")

def extract_page_info(html_file):
    """从 HTML 文件中提取页面信息"""
    try:
        content = html_file.read_text(encoding="utf-8")
        
        # 提取 title
        title_match = re.search(r'<title>([^<]+)</title>', content)
        title = title_match.group(1) if title_match else ""
        
        # 提取 description
        desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', content)
        if not desc_match:
            desc_match = re.search(r'<meta[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']description["\']', content)
        description = desc_match.group(1) if desc_match else ""
        
        # 提取 keywords
        kw_match = re.search(r'<meta[^>]*name=["\']keywords["\'][^>]*content=["\']([^"\']+)["\']', content)
        if not kw_match:
            kw_match = re.search(r'<meta[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']keywords["\']', content)
        keywords = kw_match.group(1) if kw_match else ""
        
        return {
            "title": title,
            "description": description,
            "keywords": keywords,
            "has_schema": '"@type"' in content,
            "has_og": 'property="og:' in content,
            "has_canonical": 'rel="canonical"' in content
        }
    except Exception as e:
        print(f"  ⚠️ 读取 {html_file.name} 失败：{e}")
        return None

def generate_sitemap():
    """生成 sitemap.xml"""
    print("\n📝 生成 sitemap.xml...")
    
    html_files = get_all_html_files()
    urls = []
    
    for html_file in html_files:
        rel_path = html_file.name
        if rel_path == "index.html":
            url = f"{BASE_URL}/"
        else:
            url = f"{BASE_URL}/{rel_path}"
        
        lastmod = get_file_mtime(html_file)
        
        # 根据页面类型设置优先级
        priority = "0.7"
        changefreq = "monthly"
        
        if rel_path == "index.html":
            priority = "1.0"
            changefreq = "daily"
        elif rel_path in ["articles.html", "skills.html", "timeline.html"]:
            priority = "0.9"
            changefreq = "weekly"
        elif rel_path.startswith("day") or rel_path == "ai-experiment.html":
            priority = "0.8"
            changefreq = "weekly"
        elif rel_path in ["about.html", "founder.html", "company.html"]:
            priority = "0.8"
            changefreq = "monthly"
        
        urls.append({
            "loc": url,
            "lastmod": lastmod,
            "changefreq": changefreq,
            "priority": priority
        })
    
    # 生成 XML
    xml_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''
    
    for url in sorted(urls, key=lambda x: x["loc"]):
        xml_content += f'''    <url>
        <loc>{url["loc"]}</loc>
        <lastmod>{url["lastmod"]}</lastmod>
        <changefreq>{url["changefreq"]}</changefreq>
        <priority>{url["priority"]}</priority>
    </url>
'''
    
    xml_content += "</urlset>\n"
    
    # 写入文件
    sitemap_path = BLOG_DIR / "sitemap.xml"
    sitemap_path.write_text(xml_content, encoding="utf-8")
    print(f"  ✅ 生成 {len(urls)} 个 URL 到 sitemap.xml")
    
    return urls

def optimize_page_seo(html_file):
    """优化单个页面的 SEO"""
    print(f"\n🔍 优化 {html_file.name}...")
    
    try:
        content = html_file.read_text(encoding="utf-8")
        original_content = content
        page_name = html_file.stem
        
        # 获取 SEO 数据
        seo_info = SEO_DATA.get(page_name, {})
        
        # 1. 优化 title
        if seo_info.get("title"):
            title_pattern = r'<title>[^<]*</title>'
            new_title = f'<title>{seo_info["title"]}</title>'
            if re.search(title_pattern, content):
                content = re.sub(title_pattern, new_title, content)
                print(f"  ✅ 更新 title")
        
        # 2. 优化 description
        if seo_info.get("description"):
            desc_pattern = r'<meta[^>]*name=["\']description["\'][^>]*>'
            new_desc = f'    <meta name="description" content="{seo_info["description"]}">'
            if re.search(desc_pattern, content):
                content = re.sub(desc_pattern, new_desc, content)
                print(f"  ✅ 更新 meta description")
        
        # 3. 优化 keywords
        if seo_info.get("keywords"):
            kw_pattern = r'<meta[^>]*name=["\']keywords["\'][^>]*>'
            new_kw = f'    <meta name="keywords" content="{seo_info["keywords"]}">'
            if re.search(kw_pattern, content):
                content = re.sub(kw_pattern, new_kw, content)
                print(f"  ✅ 更新 meta keywords")
        
        # 4. 检查结构化数据
        if '"@type"' not in content:
            print(f"  ⚠️ 缺少结构化数据，建议添加")
        
        # 5. 检查 Open Graph
        if 'property="og:' not in content:
            print(f"  ⚠️ 缺少 Open Graph 标签")
        
        # 保存更改
        if content != original_content:
            html_file.write_text(content, encoding="utf-8")
            print(f"  ✅ 保存更改")
        else:
            print(f"  ✓ 无需更改")
            
    except Exception as e:
        print(f"  ⚠️ 优化失败：{e}")

def add_internal_links():
    """添加内部链接优化"""
    print("\n🔗 添加内部链接...")
    
    # 读取 index.html
    index_file = BLOG_DIR / "index.html"
    if not index_file.exists():
        print("  ⚠️ index.html 不存在")
        return
    
    content = index_file.read_text(encoding="utf-8")
    
    # 检查是否有最新日记链接
    diary_files = sorted([f for f in BLOG_DIR.glob("day*.html") if f.name != "day-template.html"],
                         key=lambda x: int(re.search(r'\d+', x.name).group()) if re.search(r'\d+', x.name) else 0)
    
    if diary_files:
        latest_diary = diary_files[-1]
        print(f"  ✅ 最新日记：{latest_diary.name}")
        # 这里可以添加逻辑在首页添加最新日记链接
    
    print("  ✅ 内部链接检查完成")

def submit_to_search_engines(urls):
    """提交到搜索引擎"""
    print("\n🚀 提交到搜索引擎...")
    
    url_list = [u["loc"] for u in urls]
    
    # 百度提交
    print("\n  百度资源平台:")
    if BAIDU_TOKEN == "YOUR_BAIDU_TOKEN_HERE":
        print("  ⚠️ 未配置 BAIDU_TOKEN，跳过提交")
        print("  💡 请在 https://ziyuan.baidu.com 获取 token 并设置环境变量 BAIDU_SEO_TOKEN")
    else:
        try:
            api_url = f"http://data.zz.baidu.com/urls?site={BASE_URL.replace('https://', '')}&token={BAIDU_TOKEN}"
            data = "\n".join(url_list).encode('utf-8')
            req = urllib.request.Request(api_url, data=data, headers={"Content-Type": "text/plain"}, method="POST")
            response = urllib.request.urlopen(req, timeout=10)
            result = json.loads(response.read().decode('utf-8'))
            print(f"  ✅ 百度提交成功：{result.get('success', 0)} 个 URL")
        except Exception as e:
            print(f"  ⚠️ 百度提交失败：{e}")
    
    # Bing 提交
    print("\n  Bing Webmaster Tools:")
    if BING_API_KEY == "YOUR_BING_KEY_HERE":
        print("  ⚠️ 未配置 BING_API_KEY，跳过提交")
        print("  💡 请在 https://www.bing.com/webmasters 获取 API Key")
    else:
        try:
            # Bing 使用 sitemap 提交
            sitemap_url = f"{BASE_URL}/sitemap.xml"
            api_url = f"https://ssl.bing.com/webmaster/api.svc/json/SubmitSitemap?apikey={BING_API_KEY}"
            data = json.dumps({"siteUrl": BASE_URL, "sitemapUrl": sitemap_url}).encode('utf-8')
            req = urllib.request.Request(api_url, data=data, headers={"Content-Type": "application/json"}, method="POST")
            response = urllib.request.urlopen(req, timeout=10)
            print(f"  ✅ Bing Sitemap 提交成功")
        except Exception as e:
            print(f"  ⚠️ Bing 提交失败：{e}")

def generate_seo_report(urls):
    """生成 SEO 报告"""
    print("\n📊 生成 SEO 报告...\n")
    
    report = []
    report.append("=" * 60)
    report.append("SEO 优化报告")
    report.append(f"生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append(f"网站：{BASE_URL}")
    report.append("=" * 60)
    
    # 1. 页面收录情况
    report.append("\n📄 页面收录情况")
    report.append("-" * 40)
    report.append(f"总页面数：{len(urls)}")
    
    diary_count = sum(1 for u in urls if "/day" in u["loc"])
    article_count = sum(1 for u in urls if "/articles" in u["loc"])
    other_count = len(urls) - diary_count - article_count
    
    report.append(f"日记页面：{diary_count}")
    report.append(f"文章列表：{article_count}")
    report.append(f"其他页面：{other_count}")
    
    # 2. SEO 质量检查
    report.append("\n🔍 SEO 质量检查")
    report.append("-" * 40)
    
    html_files = get_all_html_files()
    pages_with_schema = 0
    pages_with_og = 0
    pages_with_canonical = 0
    
    for html_file in html_files:
        info = extract_page_info(html_file)
        if info:
            if info["has_schema"]:
                pages_with_schema += 1
            if info["has_og"]:
                pages_with_og += 1
            if info["has_canonical"]:
                pages_with_canonical += 1
    
    report.append(f"有结构化数据的页面：{pages_with_schema}/{len(html_files)}")
    report.append(f"有 Open Graph 的页面：{pages_with_og}/{len(html_files)}")
    report.append(f"有 canonical 标签的页面：{pages_with_canonical}/{len(html_files)}")
    
    # 3. Sitemap 检查
    report.append("\n🗺️ Sitemap 检查")
    report.append("-" * 40)
    sitemap_file = BLOG_DIR / "sitemap.xml"
    if sitemap_file.exists():
        report.append(f"✅ sitemap.xml 存在")
        report.append(f"URL 数量：{len(urls)}")
        report.append(f"Sitemap URL: {BASE_URL}/sitemap.xml")
    else:
        report.append(f"❌ sitemap.xml 不存在")
    
    # 4. robots.txt 检查
    report.append("\n🤖 robots.txt 检查")
    report.append("-" * 40)
    robots_file = BLOG_DIR / "robots.txt"
    if robots_file.exists():
        report.append(f"✅ robots.txt 存在")
        content = robots_file.read_text(encoding="utf-8")
        if "Sitemap:" in content:
            report.append(f"✅ 包含 Sitemap 引用")
        else:
            report.append(f"⚠️ 缺少 Sitemap 引用")
    else:
        report.append(f"❌ robots.txt 不存在")
    
    # 5. 优化建议
    report.append("\n💡 优化建议")
    report.append("-" * 40)
    
    if pages_with_schema < len(html_files):
        report.append(f"• 为 {len(html_files) - pages_with_schema} 个页面添加结构化数据")
    
    if pages_with_og < len(html_files):
        report.append(f"• 为 {len(html_files) - pages_with_og} 个页面添加 Open Graph 标签")
    
    if pages_with_canonical < len(html_files):
        report.append(f"• 为 {len(html_files) - pages_with_canonical} 个页面添加 canonical 标签")
    
    if BAIDU_TOKEN == "YOUR_BAIDU_TOKEN_HERE":
        report.append("• 配置百度搜索资源平台 API Token")
    
    if BING_API_KEY == "YOUR_BING_KEY_HERE":
        report.append("• 配置 Bing Webmaster Tools API Key")
    
    report.append("• 定期更新 sitemap.xml（建议每次发布新内容后）")
    report.append("• 监控搜索引擎收录情况")
    report.append("• 优化页面加载速度")
    report.append("• 增加高质量外部链接")
    
    report.append("\n" + "=" * 60)
    
    # 输出报告
    report_text = "\n".join(report)
    print(report_text)
    
    # 保存到文件
    report_file = BLOG_DIR / "SEO_REPORT.md"
    report_file.write_text(report_text, encoding="utf-8")
    print(f"\n✅ 报告已保存到：{report_file}")
    
    return report_text

def main():
    """主函数"""
    print("=" * 60)
    print("SEO 自动优化脚本")
    print(f"工作目录：{BLOG_DIR}")
    print("=" * 60)
    
    # 1. 生成 sitemap
    urls = generate_sitemap()
    
    # 2. 优化页面 SEO
    print("\n🎯 优化页面 SEO...")
    html_files = get_all_html_files()
    for html_file in html_files:
        optimize_page_seo(html_file)
    
    # 3. 添加内部链接
    add_internal_links()
    
    # 4. 提交到搜索引擎
    submit_to_search_engines(urls)
    
    # 5. 生成 SEO 报告
    generate_seo_report(urls)
    
    print("\n✅ SEO 优化完成！")

if __name__ == "__main__":
    main()
