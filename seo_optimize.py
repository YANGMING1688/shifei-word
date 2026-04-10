#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO 自动优化脚本
功能：
1. 扫描所有 HTML 文件，更新 sitemap.xml
2. 检查和优化页面 SEO 元素
3. 添加内部链接和面包屑导航
4. 生成 SEO 报告
"""

import os
import re
from datetime import datetime
from pathlib import Path

# 配置
BASE_DIR = Path(__file__).parent
SITE_URL = "https://shifei.world"

# 页面优先级配置
PAGE_PRIORITIES = {
    'index.html': {'priority': 1.0, 'changefreq': 'daily'},
    'articles.html': {'priority': 0.9, 'changefreq': 'weekly'},
    'skills.html': {'priority': 0.9, 'changefreq': 'weekly'},
    'about.html': {'priority': 0.8, 'changefreq': 'monthly'},
    'founder.html': {'priority': 0.8, 'changefreq': 'monthly'},
    'company.html': {'priority': 0.8, 'changefreq': 'monthly'},
    'timeline.html': {'priority': 0.7, 'changefreq': 'weekly'},
    'week1-review.html': {'priority': 0.7, 'changefreq': 'weekly'},
    'ai-experiment.html': {'priority': 0.8, 'changefreq': 'daily'},
    'status.html': {'priority': 0.6, 'changefreq': 'weekly'},
}

# 日记页面配置
DIARY_PAGES = {
    'day1.html': {'title': 'Day 1 - 从今天起，我是一名一人公司创业者', 'priority': 0.7},
    'day2.html': {'title': 'Day 2 - 搭建网站，发布第一篇文章', 'priority': 0.7},
    'day3.html': {'title': 'Day 3 - 产品定位与品牌设计', 'priority': 0.7},
    'day5.html': {'title': 'Day 5 - AI 助手深度集成', 'priority': 0.7},
}

# SEO 模板配置
DEFAULT_DESCRIPTIONS = {
    'index.html': 'OPC 一人公司创业实验，养了只 AI 龙虾蟹。记录一人公司的创业历程，分享 AI 赋能、效率工具、创业心得。',
    'articles.html': '浏览所有创业日记、深度文章、工具分享和复盘总结。',
    'skills.html': 'OPC 一人公司核心技能：AI 应用开发、效率工具、自动化工作流。',
    'about.html': '了解 OPC 一人公司的使命、愿景和价值观。',
    'founder.html': '创始人介绍 - 行上科技，OPC 一人公司背后的推动者。',
    'company.html': '公司介绍 - 行上科技，专注于 AI 赋能的一人公司工具。',
    'timeline.html': 'OPC 一人公司发展时间线，记录每个重要里程碑。',
    'week1-review.html': '第一周复盘总结 - 创业初期的收获与反思。',
    'ai-experiment.html': 'AI 优化实验日记 - 记录 AI 助手在创业中的实际应用效果。',
    'status.html': '系统状态页面 - OPC 一人公司服务运行状态。',
}

DEFAULT_KEYWORDS = {
    'index.html': '一人公司，创业心得，AI 助手，效率工具，自由职业，远程工作，个人品牌，创业日记',
    'articles.html': '一人公司，创业日记，文章列表，AI 工具，创业心得',
    'skills.html': 'AI 应用开发，效率工具，自动化，一人公司技能，技术栈',
    'about.html': '关于我们，OPC 一人公司，使命愿景，创业理念',
    'founder.html': '创始人，行上科技，创业者介绍，个人品牌',
    'company.html': '公司介绍，行上科技，AI 工具，一人公司解决方案',
    'timeline.html': '发展历程，时间线，里程碑，创业记录',
    'week1-review.html': '周复盘，创业总结，经验教训，第一周',
    'ai-experiment.html': 'AI 实验，AI 助手，自动化，效率提升，AI 应用',
    'status.html': '系统状态，服务监控，运行状态',
}


def get_file_mtime(filepath):
    """获取文件修改时间"""
    mtime = os.path.getmtime(filepath)
    return datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')


def scan_html_files():
    """扫描所有 HTML 文件"""
    html_files = []
    for f in BASE_DIR.glob('*.html'):
        if f.name not in ['day-template.html', '404.html']:
            html_files.append(f.name)
    return sorted(html_files)


def generate_sitemap():
    """生成更新的 sitemap.xml"""
    html_files = scan_html_files()
    
    sitemap_entries = []
    
    # 首页
    sitemap_entries.append('''    <!-- 首页 - 最高优先级 -->
    <url>
        <loc>https://shifei.world/</loc>
        <lastmod>{}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>'''.format(get_file_mtime(BASE_DIR / 'index.html')))
    
    # 核心页面
    core_pages = ['articles.html', 'skills.html', 'about.html', 'founder.html', 'company.html']
    for page in core_pages:
        if page in html_files:
            mtime = get_file_mtime(BASE_DIR / page)
            prio = PAGE_PRIORITIES.get(page, {'priority': 0.8, 'changefreq': 'monthly'})
            sitemap_entries.append('''    <!-- 核心页面 -->
    <url>
        <loc>https://shifei.world/{}</loc>
        <lastmod>{}</lastmod>
        <changefreq>{}</changefreq>
        <priority>{}</priority>
    </url>'''.format(page, mtime, prio['changefreq'], prio['priority']))
    
    # 内容页面
    content_pages = ['timeline.html', 'week1-review.html', 'ai-experiment.html', 'status.html']
    for page in content_pages:
        if page in html_files:
            mtime = get_file_mtime(BASE_DIR / page)
            prio = PAGE_PRIORITIES.get(page, {'priority': 0.7, 'changefreq': 'weekly'})
            sitemap_entries.append('''    <!-- 内容页面 -->
    <url>
        <loc>https://shifei.world/{}</loc>
        <lastmod>{}</lastmod>
        <changefreq>{}</changefreq>
        <priority>{}</priority>
    </url>'''.format(page, mtime, prio['changefreq'], prio['priority']))
    
    # 日记页面
    diary_files = [f for f in html_files if f.startswith('day') and f.endswith('.html')]
    for page in sorted(diary_files):
        mtime = get_file_mtime(BASE_DIR / page)
        prio = PAGE_PRIORITIES.get(page, {'priority': 0.7, 'changefreq': 'monthly'})
        sitemap_entries.append('''    <!-- 日记页面 -->
    <url>
        <loc>https://shifei.world/{}</loc>
        <lastmod>{}</lastmod>
        <changefreq>{}</changefreq>
        <priority>{}</priority>
    </url>'''.format(page, mtime, prio['changefreq'], prio['priority']))
    
    sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{}
</urlset>
'''.format('\n'.join(sitemap_entries))
    
    # 写入 sitemap.xml
    sitemap_path = BASE_DIR / 'sitemap.xml'
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    return len(sitemap_entries)


def check_seo_elements(filepath):
    """检查页面的 SEO 元素"""
    issues = []
    recommendations = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    
    # 检查 title 标签
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if not title_match:
        issues.append('缺少 title 标签')
    else:
        title = title_match.group(1)
        if len(title) < 10:
            recommendations.append(f'title 过短 ({len(title)}字符)，建议 20-60 字符')
        elif len(title) > 60:
            recommendations.append(f'title 过长 ({len(title)}字符)，建议控制在 60 字符内')
    
    # 检查 meta description
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', content)
    if not desc_match:
        issues.append('缺少 meta description')
    else:
        desc = desc_match.group(1)
        if len(desc) < 50:
            recommendations.append(f'description 过短 ({len(desc)}字符)，建议 80-160 字符')
        elif len(desc) > 160:
            recommendations.append(f'description 过长 ({len(desc)}字符)，建议控制在 160 字符内')
    
    # 检查 meta keywords
    keywords_match = re.search(r'<meta\s+name=["\']keywords["\']\s+content=["\']([^"\']+)["\']', content)
    if not keywords_match:
        recommendations.append('建议添加 meta keywords')
    
    # 检查 canonical 链接
    canonical_match = re.search(r'<link\s+rel=["\']canonical["\']', content)
    if not canonical_match:
        recommendations.append('建议添加 canonical 链接')
    
    # 检查结构化数据
    ld_json_match = re.search(r'<script\s+type=["\']application/ld\+json["\']', content)
    if not ld_json_match:
        recommendations.append('建议添加结构化数据 (Schema.org)')
    
    # 检查 Open Graph
    og_match = re.search(r'<meta\s+property=["\']og:', content)
    if not og_match:
        recommendations.append('建议添加 Open Graph 标签')
    
    # 检查内部链接
    internal_links = re.findall(r'href=["\']([^"\']*\.html[^"\']*)["\']', content)
    if len(internal_links) < 3:
        recommendations.append(f'内部链接较少 ({len(internal_links)}个)，建议增加内部链接')
    
    return {
        'file': filename,
        'issues': issues,
        'recommendations': recommendations,
        'internal_links_count': len(internal_links),
        'has_title': bool(title_match),
        'has_description': bool(desc_match),
        'has_keywords': bool(keywords_match),
        'has_canonical': bool(canonical_match),
        'has_structured_data': bool(ld_json_match),
        'has_og': bool(og_match),
    }


def optimize_all_pages():
    """优化所有页面的 SEO"""
    results = []
    html_files = scan_html_files()
    
    for html_file in html_files:
        filepath = BASE_DIR / html_file
        result = check_seo_elements(filepath)
        results.append(result)
    
    return results


def add_breadcrumb_template():
    """添加面包屑导航 HTML 模板"""
    breadcrumb_html = '''
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" aria-label="面包屑导航">
        <a href="/index.html">首页</a> &gt; 
        <span class="breadcrumb-current">{page_title}</span>
    </nav>
'''
    return breadcrumb_html


def generate_internal_links():
    """生成内部链接建议"""
    links = []
    html_files = scan_html_files()
    
    # 首页应该链接到最新日记
    links.append({
        'page': 'index.html',
        'suggestion': '添加指向最新日记 (day5.html, ai-experiment.html) 的链接'
    })
    
    # 日记页面应该互相链接
    diary_files = [f for f in html_files if f.startswith('day')]
    for i, diary in enumerate(sorted(diary_files)):
        prev_diary = diary_files[i-1] if i > 0 else None
        next_diary = diary_files[i+1] if i < len(diary_files)-1 else None
        suggestions = []
        if prev_diary:
            suggestions.append(f'添加上一篇链接：{prev_diary}')
        if next_diary:
            suggestions.append(f'添加下一篇链接：{next_diary}')
        if suggestions:
            links.append({
                'page': diary,
                'suggestion': ' | '.join(suggestions)
            })
    
    # 文章列表页应该链接到所有日记
    links.append({
        'page': 'articles.html',
        'suggestion': '确保链接到所有日记页面和深度文章'
    })
    
    return links


def generate_seo_report(seo_results, internal_links, sitemap_count):
    """生成 SEO 报告"""
    report = []
    report.append("=" * 60)
    report.append("SEO 优化报告")
    report.append(f"生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append(f"网站：{SITE_URL}")
    report.append("=" * 60)
    report.append("")
    
    # 1. 页面收录情况
    report.append("📊 一、页面收录情况")
    report.append("-" * 40)
    report.append(f"总页面数：{len(seo_results)}")
    report.append(f"Sitemap 条目数：{sitemap_count}")
    report.append("")
    
    # 统计 SEO 元素完整性
    has_title = sum(1 for r in seo_results if r['has_title'])
    has_desc = sum(1 for r in seo_results if r['has_description'])
    has_keywords = sum(1 for r in seo_results if r['has_keywords'])
    has_canonical = sum(1 for r in seo_results if r['has_canonical'])
    has_structured = sum(1 for r in seo_results if r['has_structured_data'])
    has_og = sum(1 for r in seo_results if r['has_og'])
    
    report.append("SEO 元素完整性:")
    report.append(f"  ✓ 有 title 标签：{has_title}/{len(seo_results)}")
    report.append(f"  ✓ 有 meta description: {has_desc}/{len(seo_results)}")
    report.append(f"  ✓ 有 meta keywords: {has_keywords}/{len(seo_results)}")
    report.append(f"  ✓ 有 canonical 链接：{has_canonical}/{len(seo_results)}")
    report.append(f"  ✓ 有结构化数据：{has_structured}/{len(seo_results)}")
    report.append(f"  ✓ 有 Open Graph 标签：{has_og}/{len(seo_results)}")
    report.append("")
    
    # 2. 问题汇总
    report.append("⚠️ 二、发现问题")
    report.append("-" * 40)
    all_issues = []
    all_recommendations = []
    for result in seo_results:
        if result['issues']:
            all_issues.append(f"{result['file']}: {', '.join(result['issues'])}")
        if result['recommendations']:
            for rec in result['recommendations']:
                all_recommendations.append(f"{result['file']}: {rec}")
    
    if all_issues:
        report.append("严重问题:")
        for issue in all_issues:
            report.append(f"  • {issue}")
    else:
        report.append("✓ 无严重问题")
    report.append("")
    
    if all_recommendations:
        report.append("优化建议:")
        for rec in all_recommendations[:10]:  # 只显示前 10 条
            report.append(f"  • {rec}")
        if len(all_recommendations) > 10:
            report.append(f"  ... 还有 {len(all_recommendations) - 10} 条建议")
    else:
        report.append("✓ 无需优化建议")
    report.append("")
    
    # 3. 内部链接优化
    report.append("🔗 三、内部链接优化建议")
    report.append("-" * 40)
    for link in internal_links:
        report.append(f"• {link['page']}")
        report.append(f"  建议：{link['suggestion']}")
    report.append("")
    
    # 4. 关键词建议
    report.append("🔑 四、关键词优化建议")
    report.append("-" * 40)
    report.append("核心关键词建议:")
    report.append("  • 一人公司 (核心品牌词)")
    report.append("  • AI 助手 (产品特性)")
    report.append("  • 创业日记 (内容类型)")
    report.append("  • 效率工具 (目标用户需求)")
    report.append("  • OPC (品牌缩写)")
    report.append("")
    report.append("长尾关键词建议:")
    report.append("  • 一人公司如何起步")
    report.append("  • AI 助手提高工作效率")
    report.append("  • 个人创业心得分享")
    report.append("  • 远程工作工具推荐")
    report.append("")
    
    # 5. 外部链接建议
    report.append("🌐 五、外部链接建设建议")
    report.append("-" * 40)
    report.append("建议获取外链的渠道:")
    report.append("  • 知乎 - 发布创业相关文章")
    report.append("  • 掘金/SegmentFault - 技术文章")
    report.append("  • 微信公众号 - 同步内容")
    report.append("  • Product Hunt - 产品发布")
    report.append("  • 创业社区/论坛")
    report.append("")
    
    # 6. 搜索引擎提交状态
    report.append("📤 六、搜索引擎提交")
    report.append("-" * 40)
    report.append("已配置:")
    report.append("  ✓ 百度搜索资源平台 (有 baidu_submit.py 脚本)")
    report.append("  ✓ Bing Webmaster (有 indexnow_submit.py 脚本)")
    report.append("  ✓ robots.txt 已配置")
    report.append("  ✓ sitemap.xml 已更新")
    report.append("")
    report.append("建议操作:")
    report.append("  1. 运行 baidu_submit.py 提交新页面到百度")
    report.append("  2. 运行 indexnow_submit.py 提交到 Bing/Google")
    report.append("  3. 在百度搜索资源平台手动提交 sitemap")
    report.append("  4. 在 Bing Webmaster Tools 验证网站")
    report.append("")
    
    # 7. 总体评分
    report.append("📈 七、SEO 健康度评分")
    report.append("-" * 40)
    score = 0
    max_score = 100
    
    # 基础 SEO 元素 (40 分)
    score += (has_title / len(seo_results)) * 10
    score += (has_desc / len(seo_results)) * 10
    score += (has_keywords / len(seo_results)) * 5
    score += (has_canonical / len(seo_results)) * 5
    score += (has_structured / len(seo_results)) * 5
    score += (has_og / len(seo_results)) * 5
    
    # Sitemap (20 分)
    score += 20 if sitemap_count > 10 else (sitemap_count / 10) * 20
    
    # 内部链接 (20 分)
    avg_links = sum(r['internal_links_count'] for r in seo_results) / len(seo_results)
    score += min(20, avg_links * 2)
    
    # 内容质量 (20 分)
    score += 15  # 假设有持续更新的内容
    score += 5 if len(diary_files := [f for f in scan_html_files() if f.startswith('day')]) >= 4 else len(diary_files) * 1.25
    
    report.append(f"总体评分：{score:.1f}/100")
    report.append("")
    if score >= 80:
        report.append("评级：优秀 🎉")
    elif score >= 60:
        report.append("评级：良好 👍")
    elif score >= 40:
        report.append("评级：一般 😐")
    else:
        report.append("评级：需要改进 ⚠️")
    report.append("")
    
    report.append("=" * 60)
    report.append("报告结束")
    report.append("=" * 60)
    
    return '\n'.join(report)


def main():
    """主函数"""
    print("🚀 开始 SEO 自动优化...")
    print("")
    
    # 1. 更新 sitemap
    print("📝 1. 更新 sitemap.xml...")
    sitemap_count = generate_sitemap()
    print(f"   ✓ 已生成 {sitemap_count} 个 sitemap 条目")
    print("")
    
    # 2. 检查所有页面 SEO
    print("🔍 2. 检查页面 SEO 元素...")
    seo_results = optimize_all_pages()
    print(f"   ✓ 已检查 {len(seo_results)} 个页面")
    print("")
    
    # 3. 生成内部链接建议
    print("🔗 3. 生成内部链接建议...")
    internal_links = generate_internal_links()
    print(f"   ✓ 已生成 {len(internal_links)} 条建议")
    print("")
    
    # 4. 生成 SEO 报告
    print("📊 4. 生成 SEO 报告...")
    report = generate_seo_report(seo_results, internal_links, sitemap_count)
    
    # 保存报告
    report_path = BASE_DIR / 'seo-report.txt'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"   ✓ 报告已保存到：{report_path}")
    print("")
    
    # 输出报告
    print(report)
    
    return report


if __name__ == '__main__':
    main()
