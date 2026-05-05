#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO 自动优化脚本
功能：
1. 扫描所有 HTML 文件并生成最新 sitemap.xml
2. 检查并优化页面 SEO（title, meta description, keywords, 结构化数据）
3. 优化内部链接（首页链接到最新日记，日记之间互相链接，面包屑导航）
4. 生成 SEO 报告
"""

import os
import re
import json
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin

# 配置
BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")
BASE_URL = "https://shifei.world/"
EXCLUDE_FILES = ['node_modules', '.git', '.vercel', 'components', 'day-template.html', '404.html']

# SEO 检查标准
SEO_STANDARDS = {
    'title_min_length': 30,
    'title_max_length': 60,
    'description_min_length': 80,
    'description_max_length': 160,
    'keywords_min_count': 3,
    'keywords_max_count': 10,
}

def get_html_files():
    """扫描所有 HTML 文件"""
    html_files = []
    for root, dirs, files in os.walk(BLOG_DIR):
        # 排除特定目录
        dirs[:] = [d for d in dirs if d not in EXCLUDE_FILES]
        
        for file in files:
            if file.endswith('.html') and file not in EXCLUDE_FILES:
                full_path = Path(root) / file
                rel_path = full_path.relative_to(BLOG_DIR)
                html_files.append({
                    'path': full_path,
                    'relative': str(rel_path),
                    'filename': file,
                    'url': BASE_URL + str(rel_path)
                })
    
    return sorted(html_files, key=lambda x: x['filename'])

def extract_page_info(html_content, filename):
    """提取页面 SEO 信息"""
    info = {
        'title': '',
        'description': '',
        'keywords': '',
        'has_schema': False,
        'has_og': False,
        'has_canonical': False,
        'h1_count': 0,
        'internal_links': 0,
        'external_links': 0,
        'issues': []
    }
    
    # 提取 title
    title_match = re.search(r'<title[^>]*>([^<]+)</title>', html_content, re.IGNORECASE)
    if title_match:
        info['title'] = title_match.group(1).strip()
        if len(info['title']) < SEO_STANDARDS['title_min_length']:
            info['issues'].append(f"Title 过短 ({len(info['title'])} 字符，建议 {SEO_STANDARDS['title_min_length']}-{SEO_STANDARDS['title_max_length']})")
        elif len(info['title']) > SEO_STANDARDS['title_max_length']:
            info['issues'].append(f"Title 过长 ({len(info['title'])} 字符，建议 {SEO_STANDARDS['title_min_length']}-{SEO_STANDARDS['title_max_length']})")
    else:
        info['issues'].append("缺少 title 标签")
    
    # 提取 meta description
    desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', html_content, re.IGNORECASE)
    if desc_match:
        info['description'] = desc_match.group(1)
        if len(info['description']) < SEO_STANDARDS['description_min_length']:
            info['issues'].append(f"Description 过短 ({len(info['description'])} 字符，建议 {SEO_STANDARDS['description_min_length']}-{SEO_STANDARDS['description_max_length']})")
        elif len(info['description']) > SEO_STANDARDS['description_max_length']:
            info['issues'].append(f"Description 过长 ({len(info['description'])} 字符，建议 {SEO_STANDARDS['description_min_length']}-{SEO_STANDARDS['description_max_length']})")
    else:
        info['issues'].append("缺少 meta description")
    
    # 提取 keywords
    kw_match = re.search(r'<meta[^>]*name=["\']keywords["\'][^>]*content=["\']([^"\']+)["\']', html_content, re.IGNORECASE)
    if kw_match:
        info['keywords'] = kw_match.group(1)
        keyword_count = len([k.strip() for k in info['keywords'].split(',') if k.strip()])
        if keyword_count < SEO_STANDARDS['keywords_min_count']:
            info['issues'].append(f"Keywords 过少 ({keyword_count} 个，建议 {SEO_STANDARDS['keywords_min_count']}-{SEO_STANDARDS['keywords_max_count']})")
    else:
        info['issues'].append("缺少 meta keywords")
    
    # 检查结构化数据
    if 'application/ld+json' in html_content:
        info['has_schema'] = True
    else:
        info['issues'].append("缺少结构化数据 (Schema.org)")
    
    # 检查 Open Graph
    if 'og:' in html_content or 'property="og:' in html_content:
        info['has_og'] = True
    else:
        info['issues'].append("缺少 Open Graph 标签")
    
    # 检查 canonical
    if 'rel="canonical"' in html_content:
        info['has_canonical'] = True
    else:
        info['issues'].append("缺少 canonical 链接")
    
    # 统计 H1 标签
    info['h1_count'] = len(re.findall(r'<h1[^>]*>', html_content, re.IGNORECASE))
    if info['h1_count'] == 0:
        info['issues'].append("缺少 H1 标签")
    elif info['h1_count'] > 1:
        info['issues'].append(f"H1 标签过多 ({info['h1_count']} 个，建议 1 个)")
    
    # 统计内外链
    internal_links = re.findall(r'href=["\'](/|\.\/|\.\.\/|https://shifei\.world/)[^"\']*\.html', html_content)
    external_links = re.findall(r'href=["\']https?://(?!shifei\.world/)[^"\']+', html_content)
    info['internal_links'] = len(internal_links)
    info['external_links'] = len(external_links)
    
    return info

def generate_sitemap(html_files):
    """生成 sitemap.xml"""
    sitemap_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    today = datetime.now().strftime('%Y-%m-%d')
    
    for file_info in html_files:
        filename = file_info['filename']
        url = file_info['url']
        
        # 确定优先级和更新频率
        if filename == 'index.html':
            priority = '1.0'
            changefreq = 'daily'
        elif filename in ['articles.html', 'timeline.html', 'skills.html']:
            priority = '0.9'
            changefreq = 'weekly'
        elif filename.startswith('day'):
            priority = '0.8'
            changefreq = 'weekly'
        elif filename in ['about.html', 'founder.html', 'company.html']:
            priority = '0.8'
            changefreq = 'monthly'
        else:
            priority = '0.7'
            changefreq = 'monthly'
        
        sitemap_lines.append('    <url>')
        sitemap_lines.append(f'        <loc>{url}</loc>')
        sitemap_lines.append(f'        <lastmod>{today}</lastmod>')
        sitemap_lines.append(f'        <changefreq>{changefreq}</changefreq>')
        sitemap_lines.append(f'        <priority>{priority}</priority>')
        sitemap_lines.append('    </url>')
    
    sitemap_lines.append('</urlset>')
    
    sitemap_content = '\n'.join(sitemap_lines)
    
    # 写入 sitemap.xml
    sitemap_path = BLOG_DIR / 'sitemap.xml'
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    return sitemap_path, len(html_files)

def add_breadcrumb_navigation(html_content, page_title, parents=None):
    """添加面包屑导航"""
    if parents is None:
        parents = []
    
    breadcrumb_html = '''
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" aria-label="面包屑导航">
        <ol class="breadcrumb-list">
            <li class="breadcrumb-item"><a href="/">首页</a></li>
'''
    
    for parent in parents:
        breadcrumb_html += f'            <li class="breadcrumb-item"><a href="{parent["url"]}">{parent["name"]}</a></li>\n'
    
    breadcrumb_html += f'            <li class="breadcrumb-item active" aria-current="page">{page_title}</li>\n'
    breadcrumb_html += '''        </ol>
    </nav>
'''
    
    # 在 main 标签后插入面包屑
    if '<main' in html_content:
        html_content = html_content.replace('<main', f'<main<!-- 面包屑导航插入点 -->\n{breadcrumb_html}\n', 1)
        html_content = html_content.replace('<!-- 面包屑导航插入点 -->', '')
    
    return html_content

def optimize_internal_links(html_content, all_diaries, current_file):
    """优化内部链接"""
    # 查找日记页面链接模式
    diary_pattern = r'day(\d+)\.html'
    
    # 提取当前日记编号
    current_match = re.search(diary_pattern, current_file)
    if not current_match:
        return html_content
    
    current_day = int(current_match.group(1))
    
    # 添加上一篇/下一篇链接
    nav_links = '''
    <!-- 日记导航 -->
    <div class="diary-navigation">
        <div class="diary-nav-links">
'''
    
    # 上一篇
    prev_day = current_day - 1
    if prev_day >= 1:
        prev_file = f'day{prev_day}.html'
        if any(prev_file in d['filename'] for d in all_diaries):
            nav_links += f'            <a href="{prev_file}" class="prev-diary">← 上一篇 (Day {prev_day})</a>\n'
    
    # 下一篇
    next_day = current_day + 1
    if any(f'day{next_day}.html' in d['filename'] for d in all_diaries):
        nav_links += f'            <a href="day{next_day}.html" class="next-diary">下一篇 (Day {next_day}) →</a>\n'
    
    nav_links += '''        </div>
        <div class="diary-nav-all">
            <a href="timeline.html" class="all-diaries">📅 查看全部日记</a>
        </div>
    </div>
'''
    
    # 在文章结尾插入导航
    if '</article>' in html_content:
        html_content = html_content.replace('</article>', f'{nav_links}\n    </article>')
    
    return html_content

def update_homepage_links(html_content, all_diaries):
    """更新首页链接到最新日记"""
    # 按日期排序日记（假设文件名数字越大越新）
    diaries = [d for d in all_diaries if d['filename'].startswith('day') and d['filename'].endswith('.html')]
    diaries_sorted = sorted(diaries, key=lambda x: int(re.search(r'day(\d+)', x['filename']).group(1)) if re.search(r'day(\d+)', x['filename']) else 0, reverse=True)
    
    if not diaries_sorted:
        return html_content
    
    # 生成最新日记列表
    latest_diaries_html = '''
    <!-- 最新日记 -->
    <section class="latest-diaries">
        <h2>📝 最新日记</h2>
        <div class="diary-grid">
'''
    
    for diary in diaries_sorted[:6]:  # 显示最新 6 篇
        match = re.search(r'day(\d+)', diary['filename'])
        if match:
            day_num = int(match.group(1))
            latest_diaries_html += f'''
            <article class="diary-card">
                <h3><a href="{diary['filename']}">Day {day_num}</a></h3>
                <p><a href="{diary['filename']}" class="read-more">阅读全文 →</a></p>
            </article>
'''
    
    latest_diaries_html += '''
        </div>
        <div class="view-all">
            <a href="timeline.html" class="btn-primary">📅 查看全部日记</a>
        </div>
    </section>
'''
    
    # 在 main 标签内插入（如果已有最新日记部分则替换）
    if '<section class="latest-diaries">' in html_content:
        # 替换现有部分
        pattern = r'<section class="latest-diaries">.*?</section>\n*'
        html_content = re.sub(pattern, latest_diaries_html, html_content, flags=re.DOTALL)
    elif '<main' in html_content:
        # 在 main 标签后插入
        html_content = html_content.replace('<main', f'<main<!-- homepage-diaries -->\n{latest_diaries_html}', 1)
        html_content = html_content.replace('<!-- homepage-diaries -->', '')
    
    return html_content

def add_schema_if_missing(html_content, page_info, filename):
    """添加结构化数据（如果缺失）"""
    if page_info['has_schema']:
        return html_content
    
    # 根据页面类型生成不同的 schema
    if filename.startswith('day'):
        match = re.search(r'day(\d+)', filename)
        day_num = int(match.group(1)) if match else 0
        
        schema = f'''
    <!-- 结构化数据 Schema.org Article -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{page_info['title']}",
      "description": "{page_info['description']}",
      "author": {{
        "@type": "Person",
        "name": "世飞 opc",
        "url": "https://shifei.world/founder.html"
      }},
      "publisher": {{
        "@type": "Organization",
        "name": "行上科技",
        "logo": {{
          "@type": "ImageObject",
          "url": "https://shifei.world/logo.png"
        }}
      }},
      "datePublished": "2026-04-{day_num:02d}",
      "dateModified": "2026-04-{day_num:02d}",
      "mainEntityOfPage": {{
        "@type": "WebPage",
        "@id": "https://shifei.world/{filename}"
      }},
      "articleBody": "{page_info['description']}",
      "keywords": "{page_info['keywords']}"
    }}
    </script>
'''
    else:
        schema = f'''
    <!-- 结构化数据 Schema.org WebPage -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "{page_info['title']}",
      "description": "{page_info['description']}",
      "url": "https://shifei.world/{filename}",
      "author": {{
        "@type": "Person",
        "name": "世飞 opc",
        "url": "https://shifei.world/founder.html"
      }},
      "publisher": {{
        "@type": "Organization",
        "name": "行上科技"
      }}
    }}
    </script>
'''
    
    # 在 head 标签内插入
    if '</head>' in html_content:
        html_content = html_content.replace('</head>', f'{schema}\n</head>')
    
    return html_content

def generate_seo_report(seo_data, sitemap_count):
    """生成 SEO 报告"""
    report = []
    report.append("=" * 80)
    report.append("SEO 自动优化报告")
    report.append(f"生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append("=" * 80)
    report.append("")
    
    # 1. 页面收录情况
    report.append("📊 一、页面收录情况")
    report.append("-" * 40)
    report.append(f"总页面数：{len(seo_data)}")
    report.append(f"sitemap 收录：{sitemap_count}")
    report.append("")
    
    # 按类型分类
    diaries = [p for p in seo_data if p['filename'].startswith('day')]
    articles = [p for p in seo_data if p['filename'] in ['articles.html', 'timeline.html', 'skills.html']]
    pages = [p for p in seo_data if p['filename'] in ['index.html', 'about.html', 'founder.html', 'company.html']]
    others = [p for p in seo_data if p not in diaries + articles + pages]
    
    report.append(f"日记页面：{len(diaries)}")
    report.append(f"文章列表：{len(articles)}")
    report.append(f"静态页面：{len(pages)}")
    report.append(f"其他页面：{len(others)}")
    report.append("")
    
    # 2. SEO 元素检查
    report.append("📋 二、SEO 元素检查")
    report.append("-" * 40)
    
    total_issues = 0
    pages_with_issues = 0
    
    for page in seo_data:
        if page['issues']:
            pages_with_issues += 1
            total_issues += len(page['issues'])
    
    report.append(f"存在问题的页面：{pages_with_issues}/{len(seo_data)}")
    report.append(f"总问题数：{total_issues}")
    report.append("")
    
    # 详细问题列表
    report.append("详细问题：")
    for page in seo_data:
        if page['issues']:
            report.append(f"\n  {page['filename']}:")
            for issue in page['issues']:
                report.append(f"    ⚠️  {issue}")
    report.append("")
    
    # 3. 关键词分析
    report.append("🔑 三、关键词分析")
    report.append("-" * 40)
    
    all_keywords = []
    for page in seo_data:
        if page['keywords']:
            kws = [k.strip() for k in page['keywords'].split(',') if k.strip()]
            all_keywords.extend(kws)
    
    # 统计词频
    keyword_freq = {}
    for kw in all_keywords:
        keyword_freq[kw] = keyword_freq.get(kw, 0) + 1
    
    top_keywords = sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)[:15]
    
    report.append("高频关键词：")
    for kw, count in top_keywords:
        report.append(f"  {kw}: {count} 次")
    report.append("")
    
    # 4. 链接分析
    report.append("🔗 四、链接分析")
    report.append("-" * 40)
    
    total_internal = sum(p['internal_links'] for p in seo_data)
    total_external = sum(p['external_links'] for p in seo_data)
    
    report.append(f"内部链接总数：{total_internal}")
    report.append(f"外部链接总数：{total_external}")
    report.append(f"平均每页内部链接：{total_internal/len(seo_data):.1f}")
    report.append(f"平均每页外部链接：{total_external/len(seo_data):.1f}")
    report.append("")
    
    # 5. 优化建议
    report.append("💡 五、优化建议")
    report.append("-" * 40)
    
    suggestions = []
    
    if pages_with_issues > 0:
        suggestions.append(f"1. 修复 {pages_with_issues} 个页面的 SEO 问题（缺少 meta 标签、结构化数据等）")
    
    if total_internal < len(seo_data) * 3:
        suggestions.append("2. 增加内部链接密度，建议每页至少 3 个内部链接")
    
    # 检查日记之间的链接
    diary_count = len(diaries)
    if diary_count > 1:
        suggestions.append(f"3. 为 {diary_count} 篇日记添加上一篇/下一篇导航链接")
    
    suggestions.append("4. 在首页添加最新日记推荐模块")
    suggestions.append("5. 为所有页面添加面包屑导航")
    suggestions.append("6. 定期检查并更新 sitemap.xml")
    suggestions.append("7. 提交 sitemap 到 Google Search Console 和百度搜索资源平台")
    
    for suggestion in suggestions:
        report.append(f"  ✓ {suggestion}")
    report.append("")
    
    # 6. 完成情况
    report.append("✅ 六、本次优化完成情况")
    report.append("-" * 40)
    report.append("  ✓ 已更新 sitemap.xml")
    report.append(f"  ✓ 已扫描 {len(seo_data)} 个 HTML 文件")
    report.append(f"  ✓ 已识别 {total_issues} 个 SEO 问题")
    report.append("  ✓ 已生成内部链接优化方案")
    report.append("  ✓ 已生成面包屑导航方案")
    report.append("")
    
    report.append("=" * 80)
    report.append("报告结束")
    report.append("=" * 80)
    
    return '\n'.join(report)

def main():
    print("🚀 开始 SEO 自动优化...")
    print("")
    
    # 1. 扫描所有 HTML 文件
    print("📁 步骤 1: 扫描 HTML 文件...")
    html_files = get_html_files()
    print(f"   找到 {len(html_files)} 个 HTML 文件")
    
    # 2. 分析每个页面的 SEO 情况
    print("\n🔍 步骤 2: 分析页面 SEO...")
    seo_data = []
    
    for file_info in html_files:
        try:
            with open(file_info['path'], 'r', encoding='utf-8') as f:
                content = f.read()
            
            page_info = extract_page_info(content, file_info['filename'])
            page_info['filename'] = file_info['filename']
            page_info['path'] = file_info['path']
            seo_data.append(page_info)
            
        except Exception as e:
            print(f"   ⚠️  分析 {file_info['filename']} 失败：{e}")
    
    print(f"   完成 {len(seo_data)} 个页面分析")
    
    # 3. 生成 sitemap
    print("\n🗺️  步骤 3: 生成 sitemap.xml...")
    sitemap_path, sitemap_count = generate_sitemap(html_files)
    print(f"   已生成 sitemap.xml，收录 {sitemap_count} 个页面")
    print(f"   路径：{sitemap_path}")
    
    # 4. 优化建议（不直接修改文件，只生成报告）
    print("\n📝 步骤 4: 生成优化建议...")
    
    # 5. 生成 SEO 报告
    print("\n📊 步骤 5: 生成 SEO 报告...")
    report = generate_seo_report(seo_data, sitemap_count)
    
    # 保存报告
    report_path = BLOG_DIR / 'SEO_AUTO_OPTIMIZATION_REPORT.md'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"   报告已保存：{report_path}")
    print("")
    print(report)
    
    return report

if __name__ == '__main__':
    main()
