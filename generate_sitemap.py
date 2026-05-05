#!/usr/bin/env python3
"""
SEO 自动优化工具 - 生成 sitemap.xml 并分析 SEO 状态
"""

import os
import re
from datetime import datetime
from pathlib import Path

BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")
BASE_URL = "https://shifei.world"

# 页面优先级配置
PAGE_PRIORITIES = {
    "index.html": {"priority": 1.0, "changefreq": "daily"},
    "articles.html": {"priority": 0.9, "changefreq": "weekly"},
    "timeline.html": {"priority": 0.9, "changefreq": "weekly"},
    "skills.html": {"priority": 0.9, "changefreq": "weekly"},
}

# 日记页面优先级
DIARY_PRIORITY = {"priority": 0.8, "changefreq": "weekly"}

# 其他页面优先级
OTHER_PRIORITY = {"priority": 0.7, "changefreq": "monthly"}

def get_file_mtime(filepath):
    """获取文件修改时间"""
    mtime = os.path.getmtime(filepath)
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")

def extract_seo_info(filepath):
    """从 HTML 文件中提取 SEO 信息"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 提取 title
        title_match = re.search(r'<title>([^<]+)</title>', content)
        title = title_match.group(1).strip() if title_match else "Missing"
        
        # 提取 meta description
        desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', content)
        if not desc_match:
            desc_match = re.search(r'<meta[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']description["\']', content)
        description = desc_match.group(1).strip() if desc_match else "Missing"
        
        # 提取 keywords
        keywords_match = re.search(r'<meta[^>]*name=["\']keywords["\'][^>]*content=["\']([^"\']+)["\']', content)
        if not keywords_match:
            keywords_match = re.search(r'<meta[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']keywords["\']', content)
        keywords = keywords_match.group(1).strip() if keywords_match else "Missing"
        
        # 检查 canonical
        has_canonical = 'rel="canonical"' in content
        
        # 检查 Open Graph
        has_og = 'property="og:' in content or "property='og:" in content
        
        # 检查结构化数据
        has_schema = 'application/ld+json' in content
        
        # 检查面包屑
        has_breadcrumb = 'breadcrumb' in content.lower()
        
        # 检查内部链接
        has_internal_links = 'internal-link' in content or '上一篇' in content or '下一篇' in content
        
        return {
            "title": title,
            "description": description,
            "keywords": keywords,
            "has_canonical": has_canonical,
            "has_og": has_og,
            "has_schema": has_schema,
            "has_breadcrumb": has_breadcrumb,
            "has_internal_links": has_internal_links,
            "title_length": len(title),
            "desc_length": len(description),
        }
    except Exception as e:
        return {"error": str(e)}

def generate_sitemap():
    """生成 sitemap.xml"""
    urls = []
    
    # 扫描所有 HTML 文件（排除 components 目录和模板）
    html_files = []
    for html_file in BLOG_DIR.glob("*.html"):
        if html_file.name not in ["day-template.html", "404.html"]:
            html_files.append(html_file)
    
    for html_file in sorted(html_files):
        filename = html_file.name
        mtime = get_file_mtime(html_file)
        
        # 确定优先级
        if filename in PAGE_PRIORITIES:
            config = PAGE_PRIORITIES[filename]
        elif filename.startswith("day") and filename.endswith(".html"):
            config = DIARY_PRIORITY
        else:
            config = OTHER_PRIORITY
        
        # 构建 URL
        if filename == "index.html":
            loc = BASE_URL + "/"
        else:
            loc = f"{BASE_URL}/{filename}"
        
        urls.append({
            "loc": loc,
            "lastmod": mtime,
            "changefreq": config["changefreq"],
            "priority": config["priority"],
        })
    
    # 生成 XML
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    
    for url in urls:
        xml_lines.append("<url>")
        xml_lines.append(f"<loc>{url['loc']}</loc>")
        xml_lines.append(f"<lastmod>{url['lastmod']}</lastmod>")
        xml_lines.append(f"<changefreq>{url['changefreq']}</changefreq>")
        xml_lines.append(f"<priority>{url['priority']}</priority>")
        xml_lines.append("</url>")
    
    xml_lines.append("</urlset>")
    
    # 写入文件
    sitemap_path = BLOG_DIR / "sitemap.xml"
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(xml_lines))
    
    return urls

def analyze_seo():
    """分析所有页面的 SEO 状态"""
    results = []
    
    html_files = []
    for html_file in BLOG_DIR.glob("*.html"):
        if html_file.name not in ["day-template.html", "404.html"]:
            html_files.append(html_file)
    
    for html_file in sorted(html_files):
        seo_info = extract_seo_info(html_file)
        seo_info["filename"] = html_file.name
        seo_info["mtime"] = get_file_mtime(html_file)
        results.append(seo_info)
    
    return results

def main():
    print("=" * 60)
    print("SEO 自动优化工具")
    print("=" * 60)
    
    # 生成 sitemap
    print("\n📄 生成 sitemap.xml...")
    urls = generate_sitemap()
    print(f"✅ 已生成 sitemap.xml，包含 {len(urls)} 个 URL")
    
    # 分析 SEO
    print("\n🔍 分析页面 SEO 状态...")
    seo_results = analyze_seo()
    
    # 统计
    total = len(seo_results)
    with_title = sum(1 for r in seo_results if r.get("title") != "Missing")
    with_desc = sum(1 for r in seo_results if r.get("description") != "Missing")
    with_keywords = sum(1 for r in seo_results if r.get("keywords") != "Missing")
    with_canonical = sum(1 for r in seo_results if r.get("has_canonical"))
    with_og = sum(1 for r in seo_results if r.get("has_og"))
    with_schema = sum(1 for r in seo_results if r.get("has_schema"))
    with_breadcrumb = sum(1 for r in seo_results if r.get("has_breadcrumb"))
    with_internal_links = sum(1 for r in seo_results if r.get("has_internal_links"))
    
    print(f"\n📊 SEO 分析摘要:")
    print(f"   总页面数：{total}")
    print(f"   ✓ 有 Title: {with_title}/{total}")
    print(f"   ✓ 有 Description: {with_desc}/{total}")
    print(f"   ✓ 有 Keywords: {with_keywords}/{total}")
    print(f"   ✓ 有 Canonical: {with_canonical}/{total}")
    print(f"   ✓ 有 Open Graph: {with_og}/{total}")
    print(f"   ✓ 有结构化数据：{with_schema}/{total}")
    print(f"   ✓ 有面包屑导航：{with_breadcrumb}/{total}")
    print(f"   ✓ 有内部链接：{with_internal_links}/{total}")
    
    # 输出详细报告
    report_path = BLOG_DIR / "seo" / "seo_analysis_report.md"
    report_path.parent.mkdir(exist_ok=True)
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# SEO 分析报告\n\n")
        f.write(f"生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write("## 摘要\n\n")
        f.write(f"- 总页面数：{total}\n")
        f.write(f"- Title 完整率：{with_title}/{total} ({with_title/total*100:.1f}%)\n")
        f.write(f"- Description 完整率：{with_desc}/{total} ({with_desc/total*100:.1f}%)\n")
        f.write(f"- Keywords 完整率：{with_keywords}/{total} ({with_keywords/total*100:.1f}%)\n")
        f.write(f"- Canonical 覆盖率：{with_canonical}/{total} ({with_canonical/total*100:.1f}%)\n")
        f.write(f"- Open Graph 覆盖率：{with_og}/{total} ({with_og/total*100:.1f}%)\n")
        f.write(f"- 结构化数据覆盖率：{with_schema}/{total} ({with_schema/total*100:.1f}%)\n")
        f.write(f"- 面包屑导航覆盖率：{with_breadcrumb}/{total} ({with_breadcrumb/total*100:.1f}%)\n")
        f.write(f"- 内部链接覆盖率：{with_internal_links}/{total} ({with_internal_links/total*100:.1f}%)\n\n")
        
        f.write("## 详细分析\n\n")
        f.write("| 页面 | Title | Description | Keywords | Canonical | OG | Schema | 面包屑 | 内链 |\n")
        f.write("|------|-------|-------------|----------|-----------|-----|--------|--------|------|\n")
        
        for r in seo_results:
            filename = r["filename"]
            title_status = "✓" if r.get("title") != "Missing" else "✗"
            desc_status = "✓" if r.get("description") != "Missing" else "✗"
            kw_status = "✓" if r.get("keywords") != "Missing" else "✗"
            canon_status = "✓" if r.get("has_canonical") else "✗"
            og_status = "✓" if r.get("has_og") else "✗"
            schema_status = "✓" if r.get("has_schema") else "✗"
            breadcrumb_status = "✓" if r.get("has_breadcrumb") else "✗"
            internal_status = "✓" if r.get("has_internal_links") else "✗"
            
            f.write(f"| {filename} | {title_status} | {desc_status} | {kw_status} | {canon_status} | {og_status} | {schema_status} | {breadcrumb_status} | {internal_status} |\n")
        
        f.write("\n## 优化建议\n\n")
        f.write("1. **搜索引擎提交**: 将 sitemap.xml 提交到百度搜索资源平台和 Bing Webmaster Tools\n")
        f.write("2. **IndexNow 协议**: 配置 IndexNow 自动推送新页面\n")
        f.write("3. **内部链接**: 确保所有日记页面都有上一篇/下一篇链接\n")
        f.write("4. **图片优化**: 为所有图片添加 alt 属性\n")
        f.write("5. **加载速度**: 考虑启用 CDN 和资源压缩\n")
    
    print(f"\n📋 详细报告已保存至：{report_path}")
    print("\n✅ SEO 分析完成！")

if __name__ == "__main__":
    main()
