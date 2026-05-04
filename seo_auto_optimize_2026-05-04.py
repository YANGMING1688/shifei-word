#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO 自动优化脚本 - 2026-05-04
功能：
1. 更新 sitemap.xml
2. 优化页面 SEO（title, meta description, keywords, 结构化数据）
3. 内部链接优化
4. 生成 SEO 报告
"""

import os
import re
import json
from datetime import datetime
from pathlib import Path

WEBSITE_DIR = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
BASE_URL = "https://shifei.world"

# 页面配置
PAGE_CONFIG = {
    "index.html": {
        "title": "OPC 一人公司 - AI 龙虾蟹养成日记 | 记录创业历程与 AI 赋能",
        "description": "OPC 一人公司创业实验，养了只 AI 龙虾蟹。记录一人公司的创业历程，分享 AI 赋能、效率工具、创业心得。探索 AI 时代的新型创业模式，实现工作与生活的完美平衡。",
        "keywords": "一人公司，创业心得，AI 助手，效率工具，自由职业，远程工作，个人品牌，创业日记，AI 赋能，自动化运营",
        "priority": "1.0",
        "changefreq": "daily"
    },
    "articles.html": {
        "title": "文章列表 - OPC 一人公司创业文章与 AI 心得",
        "description": "浏览 OPC 一人公司的所有文章，包括创业心得、AI 工具使用、效率提升方法和一人公司运营经验。",
        "keywords": "文章列表，创业文章，AI 文章，效率工具，一人公司运营，创业心得",
        "priority": "0.9",
        "changefreq": "weekly"
    },
    "timeline.html": {
        "title": "创业时间线 - OPC 一人公司发展历程",
        "description": "查看 OPC 一人公司的完整创业时间线，从第 1 天到最新的创业日记，记录每一步成长与突破。",
        "keywords": "创业时间线，创业历程，发展历史，成长记录，创业日记",
        "priority": "0.9",
        "changefreq": "weekly"
    },
    "skills.html": {
        "title": "核心技能 - OPC 一人公司 AI 能力展示",
        "description": "了解 OPC 一人公司的核心 AI 技能，包括内容创作、数据分析、自动化运营等 41 个核心能力。",
        "keywords": "AI 技能，核心能力，自动化，内容创作，数据分析",
        "priority": "0.9",
        "changefreq": "weekly"
    },
    "about.html": {
        "title": "关于我们 - OPC 一人公司与行上科技",
        "description": "了解 OPC 一人公司背后的行上科技，我们的使命、愿景和核心价值观。",
        "keywords": "关于我们，行上科技，公司使命，愿景，价值观",
        "priority": "0.7",
        "changefreq": "monthly"
    },
    "founder.html": {
        "title": "创始人 - 世飞 OPC 的创业故事",
        "description": "了解 OPC 一人公司创始人的创业故事、经验和理念。",
        "keywords": "创始人，创业故事，世飞，创业者背景",
        "priority": "0.7",
        "changefreq": "monthly"
    },
    "company.html": {
        "title": "公司介绍 - 行上科技与 OPC 一人公司",
        "description": "行上科技公司介绍，OPC 一人公司的业务模式和发展历程。",
        "keywords": "公司介绍，行上科技，业务模式，发展历程",
        "priority": "0.7",
        "changefreq": "monthly"
    },
    "cross-border-ecommerce.html": {
        "title": "跨境电商 - OPC 一人公司的出海战略",
        "description": "了解 OPC 一人公司在跨境电商领域的布局和出海战略。",
        "keywords": "跨境电商，出海战略，国际市场，电商运营",
        "priority": "0.7",
        "changefreq": "monthly"
    },
    "ai-experiment.html": {
        "title": "AI 优化实验 - 一人公司自动化探索",
        "description": "OPC 一人公司的 AI 优化实验记录，探索 AI 如何赋能一人公司运营。",
        "keywords": "AI 实验，自动化探索，AI 赋能，效率提升",
        "priority": "0.7",
        "changefreq": "monthly"
    },
    "inspiring-article.html": {
        "title": "励志文章 - 创业灵感与动力",
        "description": "OPC 一人公司的励志文章集合，为创业者提供灵感和动力。",
        "keywords": "励志文章，创业灵感，动力，激励",
        "priority": "0.7",
        "changefreq": "monthly"
    },
    "status.html": {
        "title": "服务状态 - OPC 一人公司系统运行状态",
        "description": "查看 OPC 一人公司各系统的运行状态和服务可用性。",
        "keywords": "服务状态，系统监控，可用性，运行状态",
        "priority": "0.7",
        "changefreq": "monthly"
    },
    "week1-review.html": {
        "title": "第一周回顾 - OPC 创业实验总结",
        "description": "OPC 一人公司创业实验第一周的完整回顾与总结。",
        "keywords": "周回顾，创业总结，第一周，经验总结",
        "priority": "0.7",
        "changefreq": "monthly"
    }
}

# 日记页面配置模板
DIARY_CONFIG_TEMPLATE = {
    "priority": "0.8",
    "changefreq": "weekly"
}

def get_file_mtime(filepath):
    """获取文件修改时间"""
    mtime = os.path.getmtime(filepath)
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")

def scan_html_files():
    """扫描所有 HTML 文件"""
    html_files = []
    for f in os.listdir(WEBSITE_DIR):
        if f.endswith(".html") and f not in ["day-template.html", "404.html"]:
            html_files.append(f)
    return sorted(html_files)

def generate_sitemap():
    """生成 sitemap.xml"""
    html_files = scan_html_files()
    
    sitemap_entries = []
    
    for filename in html_files:
        filepath = os.path.join(WEBSITE_DIR, filename)
        lastmod = get_file_mtime(filepath)
        
        # 获取页面配置
        if filename in PAGE_CONFIG:
            config = PAGE_CONFIG[filename]
            priority = config.get("priority", "0.5")
            changefreq = config.get("changefreq", "monthly")
        elif filename.startswith("day") and filename.endswith(".html"):
            # 日记页面
            config = DIARY_CONFIG_TEMPLATE
            priority = config.get("priority", "0.8")
            changefreq = config.get("changefreq", "weekly")
        else:
            priority = "0.5"
            changefreq = "monthly"
        
        # 构建 URL
        if filename == "index.html":
            loc = BASE_URL + "/"
        else:
            loc = f"{BASE_URL}/{filename}"
        
        entry = f"""<url>
<loc>{loc}</loc>
<lastmod>{lastmod}</lastmod>
<changefreq>{changefreq}</changefreq>
<priority>{priority}</priority>
</url>"""
        sitemap_entries.append(entry)
    
    # 生成 sitemap
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(sitemap_entries)}
</urlset>"""
    
    # 写入文件
    sitemap_path = os.path.join(WEBSITE_DIR, "sitemap.xml")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(sitemap)
    
    return len(sitemap_entries)

def check_seo_elements(filepath):
    """检查页面的 SEO 元素"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    issues = []
    suggestions = []
    
    # 检查 title
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    if not title_match:
        issues.append("缺少 title 标签")
        suggestions.append("添加描述性的 title 标签（50-60 字符）")
    else:
        title = title_match.group(1)
        if len(title) < 30:
            suggestions.append(f"title 过短（{len(title)}字符），建议 50-60 字符")
        elif len(title) > 70:
            suggestions.append(f"title 过长（{len(title)}字符），建议 50-60 字符")
    
    # 检查 meta description
    desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', content, re.IGNORECASE)
    if not desc_match:
        issues.append("缺少 meta description")
        suggestions.append("添加 meta description（150-160 字符）")
    else:
        desc = desc_match.group(1)
        if len(desc) < 100:
            suggestions.append(f"description 过短（{len(desc)}字符），建议 150-160 字符")
        elif len(desc) > 200:
            suggestions.append(f"description 过长（{len(desc)}字符），建议 150-160 字符")
    
    # 检查 meta keywords
    keywords_match = re.search(r'<meta[^>]*name=["\']keywords["\'][^>]*content=["\']([^"\']*)["\']', content, re.IGNORECASE)
    if not keywords_match:
        suggestions.append("考虑添加 meta keywords（虽然对 Google 不重要，但对百度仍有用）")
    
    # 检查 canonical
    canonical_match = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*>', content, re.IGNORECASE)
    if not canonical_match:
        suggestions.append("添加 canonical 标签以避免重复内容问题")
    
    # 检查结构化数据
    schema_match = re.search(r'<script[^>]*type=["\']application/ld\+json["\']', content, re.IGNORECASE)
    if not schema_match:
        suggestions.append("添加 Schema.org 结构化数据（Article 或 BlogPosting）")
    
    # 检查 Open Graph
    og_title = re.search(r'<meta[^>]*property=["\']og:title["\']', content, re.IGNORECASE)
    og_desc = re.search(r'<meta[^>]*property=["\']og:description["\']', content, re.IGNORECASE)
    og_image = re.search(r'<meta[^>]*property=["\']og:image["\']', content, re.IGNORECASE)
    
    if not og_title:
        suggestions.append("添加 Open Graph title 以优化社交媒体分享")
    if not og_desc:
        suggestions.append("添加 Open Graph description")
    if not og_image:
        suggestions.append("添加 Open Graph image")
    
    # 检查 H1 标签
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE)
    if not h1_match:
        suggestions.append("添加 H1 标签（每页一个）")
    
    # 检查图片 alt 属性
    images_without_alt = re.findall(r'<img[^>]*>', content, re.IGNORECASE)
    images_missing_alt = [img for img in images_without_alt if 'alt=' not in img.lower()]
    if images_missing_alt:
        suggestions.append(f"{len(images_missing_alt)} 张图片缺少 alt 属性")
    
    # 检查内部链接数量
    internal_links = re.findall(r'href=["\'](?:/|\.\/|https://shifei\.world/)[^"\']*\.html', content, re.IGNORECASE)
    if len(internal_links) < 3:
        suggestions.append(f"内部链接较少（{len(internal_links)}个），建议添加更多相关页面链接")
    
    return {
        "issues": issues,
        "suggestions": suggestions,
        "internal_links_count": len(internal_links),
        "has_title": bool(title_match),
        "has_description": bool(desc_match),
        "has_keywords": bool(keywords_match),
        "has_canonical": bool(canonical_match),
        "has_schema": bool(schema_match),
        "has_og": bool(og_title and og_desc and og_image),
        "has_h1": bool(h1_match)
    }

def optimize_all_pages():
    """优化所有页面的 SEO"""
    html_files = scan_html_files()
    results = {}
    
    for filename in html_files:
        filepath = os.path.join(WEBSITE_DIR, filename)
        seo_check = check_seo_elements(filepath)
        results[filename] = seo_check
    
    return results

def add_internal_links():
    """添加内部链接优化"""
    html_files = scan_html_files()
    
    # 获取所有日记页面
    diary_pages = [f for f in html_files if f.startswith("day") and f.endswith(".html")]
    diary_pages.sort(key=lambda x: int(re.search(r'day(\d+)', x).group(1)) if re.search(r'day(\d+)', x) else 0)
    
    # 获取最新日记
    latest_diary = diary_pages[-1] if diary_pages else None
    
    # 获取所有页面的链接信息
    link_stats = {}
    
    for filename in html_files:
        filepath = os.path.join(WEBSITE_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # 统计现有内部链接
        internal_links = re.findall(r'href=["\']([^"\']*\.html)["\']', content, re.IGNORECASE)
        link_stats[filename] = {
            "count": len(internal_links),
            "links": list(set(internal_links))
        }
    
    return link_stats

def generate_seo_report(seo_results, link_stats, sitemap_count):
    """生成 SEO 报告"""
    report = []
    report.append("=" * 80)
    report.append("SEO 优化报告 - OPC 一人公司 (shifei.world)")
    report.append(f"生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append("=" * 80)
    report.append("")
    
    # 1. 页面收录情况
    report.append("📊 一、页面收录情况")
    report.append("-" * 40)
    report.append(f"✓ Sitemap 页面总数：{sitemap_count}")
    report.append(f"✓ HTML 文件总数：{len(seo_results)}")
    report.append(f"✓ 日记页面数量：{len([f for f in seo_results if f.startswith('day')])}")
    report.append(f"✓ 静态页面数量：{len([f for f in seo_results if not f.startswith('day')])}")
    report.append("")
    
    # 2. SEO 元素检查统计
    report.append("📋 二、SEO 元素检查统计")
    report.append("-" * 40)
    
    has_title = sum(1 for r in seo_results.values() if r.get("has_title"))
    has_desc = sum(1 for r in seo_results.values() if r.get("has_description"))
    has_keywords = sum(1 for r in seo_results.values() if r.get("has_keywords"))
    has_canonical = sum(1 for r in seo_results.values() if r.get("has_canonical"))
    has_schema = sum(1 for r in seo_results.values() if r.get("has_schema"))
    has_og = sum(1 for r in seo_results.values() if r.get("has_og"))
    has_h1 = sum(1 for r in seo_results.values() if r.get("has_h1"))
    
    total = len(seo_results)
    
    report.append(f"✓ Title 标签：{has_title}/{total} ({has_title*100//total}%)")
    report.append(f"✓ Meta Description：{has_desc}/{total} ({has_desc*100//total}%)")
    report.append(f"✓ Meta Keywords：{has_keywords}/{total} ({has_keywords*100//total}%)")
    report.append(f"✓ Canonical 标签：{has_canonical}/{total} ({has_canonical*100//total}%)")
    report.append(f"✓ 结构化数据：{has_schema}/{total} ({has_schema*100//total}%)")
    report.append(f"✓ Open Graph：{has_og}/{total} ({has_og*100//total}%)")
    report.append(f"✓ H1 标签：{has_h1}/{total} ({has_h1*100//total}%)")
    report.append("")
    
    # 3. 内部链接统计
    report.append("🔗 三、内部链接统计")
    report.append("-" * 40)
    
    total_links = sum(s["count"] for s in link_stats.values())
    avg_links = total_links // len(link_stats) if link_stats else 0
    min_links = min(s["count"] for s in link_stats.values()) if link_stats else 0
    max_links = max(s["count"] for s in link_stats.values()) if link_stats else 0
    
    report.append(f"• 内部链接总数：{total_links}")
    report.append(f"• 平均每页链接数：{avg_links}")
    report.append(f"• 最少链接页面：{min_links} 个")
    report.append(f"• 最多链接页面：{max_links} 个")
    report.append("")
    
    # 4. 问题页面列表
    report.append("⚠️  四、需要优化的页面")
    report.append("-" * 40)
    
    problem_pages = []
    for filename, seo in seo_results.items():
        if seo["suggestions"]:
            problem_pages.append((filename, len(seo["suggestions"])))
    
    problem_pages.sort(key=lambda x: x[1], reverse=True)
    
    for filename, count in problem_pages[:10]:
        report.append(f"• {filename} ({count} 条建议)")
    
    if not problem_pages:
        report.append("✓ 所有页面 SEO 状态良好")
    report.append("")
    
    # 5. 优化建议
    report.append("💡 五、优化建议")
    report.append("-" * 40)
    
    all_suggestions = []
    for seo in seo_results.values():
        all_suggestions.extend(seo["suggestions"])
    
    # 统计建议频率
    suggestion_count = {}
    for s in all_suggestions:
        suggestion_count[s] = suggestion_count.get(s, 0) + 1
    
    sorted_suggestions = sorted(suggestion_count.items(), key=lambda x: x[1], reverse=True)
    
    for suggestion, count in sorted_suggestions[:10]:
        report.append(f"• {suggestion} ({count} 页)")
    report.append("")
    
    # 6. 外部链接检查
    report.append("🌐 六、外部链接统计")
    report.append("-" * 40)
    
    external_domains = set()
    for filename in seo_results.keys():
        filepath = os.path.join(WEBSITE_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # 查找外部链接
        external_links = re.findall(r'href=["\']https?://([^"\']*\.html|[^"\']*)["\']', content, re.IGNORECASE)
        for link in external_links:
            if "shifei.world" not in link:
                domain = link.split("/")[0] if "/" in link else link
                external_domains.add(domain)
    
    report.append(f"• 外部链接域名数量：{len(external_domains)}")
    if external_domains:
        report.append(f"• 外部域名列表：{', '.join(list(external_domains)[:10])}")
    report.append("")
    
    # 7. 关键字密度分析（抽样）
    report.append("🔑 七、关键词分析（抽样）")
    report.append("-" * 40)
    
    sample_pages = ["index.html", "day26.html", "articles.html"]
    keywords_found = {}
    
    for page in sample_pages:
        if page in seo_results:
            filepath = os.path.join(WEBSITE_DIR, page)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # 提取 keywords
            keywords_match = re.search(r'<meta[^>]*name=["\']keywords["\'][^>]*content=["\']([^"\']*)["\']', content, re.IGNORECASE)
            if keywords_match:
                keywords = keywords_match.group(1).split(",")
                for kw in keywords:
                    kw = kw.strip()
                    if kw:
                        keywords_found[kw] = keywords_found.get(kw, 0) + 1
    
    report.append("高频关键词：")
    sorted_keywords = sorted(keywords_found.items(), key=lambda x: x[1], reverse=True)
    for kw, count in sorted_keywords[:15]:
        report.append(f"  - {kw} ({count} 页)")
    report.append("")
    
    # 8. 总结
    report.append("📈 八、总结")
    report.append("-" * 40)
    
    seo_score = (has_title + has_desc + has_canonical + has_schema + has_og + has_h1) * 100 // (total * 6)
    
    report.append(f"SEO 健康度评分：{seo_score}/100")
    
    if seo_score >= 90:
        report.append("评级：优秀 ✓")
    elif seo_score >= 70:
        report.append("评级：良好 ✓")
    elif seo_score >= 50:
        report.append("评级：中等 ⚠️")
    else:
        report.append("评级：需要改进 ⚠️")
    
    report.append("")
    report.append("下一步行动建议：")
    report.append("1. 提交更新后的 sitemap.xml 到搜索引擎")
    report.append("2. 根据优化建议逐个改进页面")
    report.append("3. 增加高质量外部链接")
    report.append("4. 定期监控搜索引擎收录情况")
    report.append("")
    report.append("=" * 80)
    report.append("报告生成完成")
    report.append("=" * 80)
    
    return "\n".join(report)

def main():
    """主函数"""
    print("开始 SEO 自动优化...")
    print("")
    
    # 1. 生成 sitemap
    print("1. 正在更新 sitemap.xml...")
    sitemap_count = generate_sitemap()
    print(f"   ✓ Sitemap 已更新，包含 {sitemap_count} 个页面")
    print("")
    
    # 2. 检查所有页面 SEO
    print("2. 正在检查所有页面 SEO 元素...")
    seo_results = optimize_all_pages()
    print(f"   ✓ 已检查 {len(seo_results)} 个页面")
    print("")
    
    # 3. 分析内部链接
    print("3. 正在分析内部链接...")
    link_stats = add_internal_links()
    print(f"   ✓ 已分析 {len(link_stats)} 个页面的链接")
    print("")
    
    # 4. 生成报告
    print("4. 正在生成 SEO 报告...")
    report = generate_seo_report(seo_results, link_stats, sitemap_count)
    
    # 保存报告
    report_path = os.path.join(WEBSITE_DIR, "seo", f"SEO_AUTO_OPTIMIZATION_REPORT_{datetime.now().strftime('%Y-%m-%d')}.md")
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
    
    print(f"   ✓ 报告已保存：{report_path}")
    print("")
    
    # 输出报告
    print(report)
    
    return report

if __name__ == "__main__":
    main()
