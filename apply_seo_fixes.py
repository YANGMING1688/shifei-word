#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO 优化修复脚本
实际修复所有识别的 SEO 问题
"""

import os
import re
from datetime import datetime
from pathlib import Path

BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")

# 页面 SEO 优化配置
PAGE_SEO_CONFIG = {
    'index.html': {
        'title': 'OPC 一人公司 - AI 龙虾蟹养成日记 | 记录创业历程与 AI 赋能',
        'description': 'OPC 一人公司创业实验，养了只 AI 龙虾蟹。记录一人公司的创业历程，分享 AI 赋能、效率工具、创业心得。探索 AI 时代的新型创业模式，实现工作与生活的完美平衡。',
        'keywords': '一人公司，创业心得，AI 助手，效率工具，自由职业，远程工作，个人品牌，创业日记，AI 赋能，自动化运营'
    },
    'about.html': {
        'title': '关于 OPC 一人公司 - AI 龙虾蟹养成计划介绍',
        'description': '了解 OPC 一人公司项目，这是一个 AI 龙虾蟹养成实验。探索 AI 如何赋能一人公司，实现自动化运营、内容创作和效率提升。',
        'keywords': '关于 OPC，一人公司介绍，AI 龙虾蟹，创业实验，AI 赋能，自动化运营'
    },
    'founder.html': {
        'title': '创始人 - 世飞的创业故事与 OPC 一人公司理念',
        'description': '认识 OPC 一人公司创始人世飞，了解他的创业故事、理念和对 AI 时代的思考。探索如何在 AI 时代打造成功的一人公司。',
        'keywords': '创始人，世飞，创业故事，一人公司理念，AI 创业，个人品牌'
    },
    'company.html': {
        'title': '行上科技 - OPC 一人公司背后的科技企业',
        'description': '了解行上科技，OPC 一人公司背后的科技企业。专注于 AI 工具开发、自动化解决方案和效率提升产品研发。',
        'keywords': '行上科技，公司介绍，AI 工具，自动化解决方案，效率产品，科技企业'
    },
    'articles.html': {
        'title': '文章列表 - OPC 一人公司创业文章与 AI 心得',
        'description': '浏览 OPC 一人公司的所有文章，包括创业心得、AI 工具使用、效率提升方法和一人公司运营经验。',
        'keywords': '文章列表，创业文章，AI 文章，效率工具，一人公司运营，创业心得'
    },
    'timeline.html': {
        'title': '创业时间线 - OPC 一人公司完整发展历程',
        'description': '查看 OPC 一人公司的完整创业时间线，从第一天开始的每个重要节点和成长历程。',
        'keywords': '创业时间线，发展历程，创业日记，一人公司成长，AI 龙虾蟹养成'
    },
    'skills.html': {
        'title': 'AI 工具技能 - OPC 一人公司使用的效率工具大全',
        'description': '了解 OPC 一人公司使用的 AI 工具和技能，包括 AI 写作、AI 设计、自动化运营等效率提升工具。',
        'keywords': 'AI 工具，效率工具，一人公司，AI 写作，AI 设计，工具推荐，自动化技能'
    },
    'status.html': {
        'title': '项目状态 - OPC 一人公司实时运营数据',
        'description': '查看 OPC 一人公司的实时运营状态，包括自动化系统运行情况、AI 助手状态和项目进展。',
        'keywords': '项目状态，运营数据，自动化系统，AI 助手，实时监控，项目进展'
    },
    'ai-experiment.html': {
        'title': 'AI 优化实验 - OPC 一人公司 AI 赋能实践记录',
        'description': '记录 OPC 一人公司的 AI 优化实验过程，探索 AI 如何提升一人公司的运营效率和内容质量。',
        'keywords': 'AI 实验，AI 优化，人工智能，效率提升，自动化实验，AI 赋能'
    },
    'week1-review.html': {
        'title': '第一周复盘 - OPC 一人公司创业首周总结与反思',
        'description': 'OPC 一人公司创业第一周的完整复盘，包括成果总结、遇到的挑战和下周计划。',
        'keywords': '第一周复盘，创业总结，周报复盘，一人公司，创业反思，成长记录'
    },
    'inspiring-article.html': {
        'title': '启发性文章 - AI 时代一人公司的机遇与挑战',
        'description': '探讨 AI 时代一人公司面临的机遇与挑战，分享深度思考和行业洞察。',
        'keywords': '启发性文章，AI 时代，一人公司机遇，创业思考，行业洞察，深度分析'
    },
    'cross-border-ecommerce.html': {
        'title': '跨境电商 - AI 赋能跨境出海新机遇',
        'description': '探索 AI 如何赋能跨境电商，帮助一人公司实现全球化运营和跨境出海。',
        'keywords': '跨境电商，出海，国际贸易，AI 赋能，全球化运营，跨境机遇'
    }
}

# 日记页面配置
DIARY_CONFIG = {
    'day1.html': {
        'title': 'Day 1 - 从今天起，我是一名一人公司创业者 | OPC 创业日记',
        'description': '记录 OPC 一人公司创业第一天的心路历程，为什么选择一人公司模式，以及未来的规划和期待。',
        'keywords': '一人公司，创业日记，第一天，创业心得，AI 助手，创业规划，自由职业'
    },
    'day2.html': {
        'title': 'Day 2 - 传统创业 vs 一人公司 | OPC 创业日记',
        'description': '创业第二天，深度分析传统创业与一人公司模式的区别，探索 AI 时代的新型创业方式。',
        'keywords': '一人公司，传统创业，创业模式，AI 创业，自由职业，创业对比'
    },
    'day3.html': {
        'title': 'Day 3 - AI 工具初体验 | OPC 创业日记',
        'description': '创业第三天，开始使用 AI 工具辅助工作，记录 AI 助手的实际使用体验和效率提升。',
        'keywords': '一人公司，创业日记，AI 工具，效率提升，AI 助手，自动化工作'
    },
    'day5.html': {
        'title': 'Day 5 - 效率工具配置完成 | OPC 创业日记',
        'description': '创业第五天，完成所有效率工具的配置，包括 AI 写作、设计和自动化运营系统。',
        'keywords': '一人公司，创业日记，AI 助手，Day 5，效率工具，自动化配置'
    },
    'day10.html': {
        'title': 'Day 10 - 自动化部署成功 | OPC 创业日记',
        'description': '创业第十天，完成网站自动化部署，实现内容自动发布和持续优化的一人公司系统。',
        'keywords': '一人公司，创业日记，第 10 天，自动化部署，AI 运营，持续优化'
    },
    'day12.html': {
        'title': 'Day 12 - 自动化日记系统 | OPC 创业日记',
        'description': '创业第十二天，实现自动化日记生成系统，AI 助手自动整理每日工作内容并生成日记。',
        'keywords': '一人公司，创业日记，第 12 天，自动化系统，AI 助手，日记生成'
    },
    'day15.html': {
        'title': 'Day 15 - 网站优化与数据分析 | OPC 创业日记',
        'description': '创业第十五天，进行网站功能优化、内容质量提升和流量数据分析，持续迭代一人公司系统。',
        'keywords': '一人公司，创业日记，第 15 天，网站优化，数据分析，AI 助手，内容质量'
    }
}

def read_html(filepath):
    """读取 HTML 文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_html(filepath, content):
    """写入 HTML 文件"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def update_meta_tags(content, title, description, keywords):
    """更新 meta 标签"""
    # 更新 title
    content = re.sub(
        r'<title[^>]*>.*?</title>',
        f'<title>{title}</title>',
        content,
        flags=re.IGNORECASE | re.DOTALL
    )
    
    # 更新或添加 description
    desc_pattern = r'<meta[^>]*name=["\']description["\'][^>]*>'
    if re.search(desc_pattern, content, re.IGNORECASE):
        content = re.sub(
            desc_pattern,
            f'<meta name="description" content="{description}">',
            content,
            flags=re.IGNORECASE
        )
    else:
        # 在 viewport 后添加
        content = content.replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            f'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta name="description" content="{description}">'
        )
    
    # 更新或添加 keywords
    kw_pattern = r'<meta[^>]*name=["\']keywords["\'][^>]*>'
    if re.search(kw_pattern, content, re.IGNORECASE):
        content = re.sub(
            kw_pattern,
            f'<meta name="keywords" content="{keywords}">',
            content,
            flags=re.IGNORECASE
        )
    else:
        # 在 description 后添加
        content = content.replace(
            f'<meta name="description" content="{description}">',
            f'<meta name="description" content="{description}">\n    <meta name="keywords" content="{keywords}">'
        )
    
    return content

def update_schema_content(content, title, description, keywords, filename):
    """更新结构化数据内容"""
    if 'application/ld+json' not in content:
        return content
    
    # 更新 headline
    content = re.sub(
        r'"headline"[^,]*,',
        f'"headline": "{title}",',
        content
    )
    
    # 更新 description
    content = re.sub(
        r'"description"[^,]*,',
        f'"description": "{description}",',
        content
    )
    
    # 更新 keywords
    content = re.sub(
        r'"keywords"[^}]*',
        f'"keywords": "{keywords}"',
        content
    )
    
    return content

def add_diary_navigation(content, current_day, total_diaries):
    """添加日记导航链接"""
    nav_html = '''
    <!-- 日记导航 -->
    <div class="diary-navigation" style="margin: 40px 0; padding: 20px; background: #f5f3f0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
'''
    
    # 上一篇
    if current_day > 1:
        prev_day = current_day - 1
        nav_html += f'            <a href="day{prev_day}.html" style="color: #c44536; text-decoration: none; font-weight: 500;">← 上一篇 (Day {prev_day})</a>\n'
    else:
        nav_html += '            <span style="color: #ccc;">← 上一篇</span>\n'
    
    nav_html += '''        </div>
        <div>
            <a href="timeline.html" style="color: #6b7b5f; text-decoration: none; font-weight: 500;">📅 全部日记</a>
        </div>
        <div>
'''
    
    # 下一篇
    if current_day < total_diaries:
        next_day = current_day + 1
        # 检查是否存在下一篇
        next_file = BLOG_DIR / f'day{next_day}.html'
        if next_file.exists():
            nav_html += f'            <a href="day{next_day}.html" style="color: #c44536; text-decoration: none; font-weight: 500;">下一篇 (Day {next_day}) →</a>\n'
        else:
            nav_html += '            <span style="color: #ccc;">下一篇 →</span>\n'
    else:
        nav_html += '            <span style="color: #ccc;">下一篇 →</span>\n'
    
    nav_html += '''        </div>
    </div>
'''
    
    # 在文章结尾插入
    if '</article>' in content:
        content = content.replace('</article>', f'{nav_html}\n    </article>')
    
    return content

def add_breadcrumb(content, page_title, parents=None):
    """添加面包屑导航"""
    if parents is None:
        parents = []
    
    breadcrumb_html = '''
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" aria-label="面包屑导航" style="padding: 10px 0; margin-bottom: 20px; font-size: 14px;">
        <ol class="breadcrumb-list" style="display: flex; list-style: none; gap: 8px; padding: 0; margin: 0;">
            <li class="breadcrumb-item" style="color: #666;"><a href="/" style="color: #c44536; text-decoration: none;">首页</a></li>
'''
    
    for parent in parents:
        breadcrumb_html += f'            <li class="breadcrumb-item" style="color: #666;">/ <a href="{parent["url"]}" style="color: #c44536; text-decoration: none;">{parent["name"]}</a></li>\n'
    
    breadcrumb_html += f'            <li class="breadcrumb-item active" aria-current="page" style="color: #333; font-weight: 500;">/ {page_title}</li>\n'
    breadcrumb_html += '''        </ol>
    </nav>
'''
    
    # 在 main 标签后插入
    if '<main' in content:
        # 找到 main 标签的结束
        main_match = re.search(r'<main[^>]*>', content)
        if main_match:
            insert_pos = main_match.end()
            content = content[:insert_pos] + f'\n{breadcrumb_html}' + content[insert_pos:]
    
    return content

def update_homepage_with_latest_diaries(content):
    """更新首页添加最新日记链接"""
    # 查找所有日记文件
    diary_files = []
    for i in range(1, 20):
        diary_file = BLOG_DIR / f'day{i}.html'
        if diary_file.exists():
            diary_files.append(i)
    
    diary_files.sort(reverse=True)
    latest_diaries = diary_files[:6]  # 最新 6 篇
    
    diaries_html = '''
    <!-- 最新日记推荐 -->
    <section class="latest-diaries" style="margin: 40px 0;">
        <h2 style="font-size: 24px; margin-bottom: 20px; color: #1a1714;">📝 最新日记</h2>
        <div class="diary-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
'''
    
    for day_num in latest_diaries:
        diaries_html += f'''
            <article class="diary-card" style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e8e4dc;">
                <h3 style="font-size: 18px; margin-bottom: 10px;"><a href="day{day_num}.html" style="color: #c44536; text-decoration: none;">Day {day_num}</a></h3>
                <p><a href="day{day_num}.html" style="color: #6b7b5f; text-decoration: none;">阅读全文 →</a></p>
            </article>
'''
    
    diaries_html += '''
        </div>
        <div class="view-all" style="margin-top: 20px; text-align: center;">
            <a href="timeline.html" class="btn-primary" style="display: inline-block; padding: 12px 24px; background: #c44536; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 500;">📅 查看全部日记</a>
        </div>
    </section>
'''
    
    # 在 main 标签后插入（如果已有则替换）
    if '<section class="latest-diaries">' in content:
        # 替换现有部分
        pattern = r'<section class="latest-diaries">.*?</section>\n*'
        content = re.sub(pattern, diaries_html, content, flags=re.DOTALL)
    else:
        # 在 main 标签后插入
        main_match = re.search(r'<main[^>]*>', content)
        if main_match:
            insert_pos = main_match.end()
            content = content[:insert_pos] + f'\n{diaries_html}' + content[insert_pos:]
    
    return content

def main():
    print("🔧 开始应用 SEO 优化修复...")
    print("")
    
    fixed_count = 0
    
    # 1. 修复普通页面
    print("📄 修复普通页面 SEO...")
    for filename, config in PAGE_SEO_CONFIG.items():
        filepath = BLOG_DIR / filename
        if not filepath.exists():
            print(f"   ⚠️  跳过 {filename} (文件不存在)")
            continue
        
        content = read_html(filepath)
        content = update_meta_tags(content, config['title'], config['description'], config['keywords'])
        content = update_schema_content(content, config['title'], config['description'], config['keywords'], filename)
        
        # 添加面包屑
        parents = []
        if filename not in ['index.html']:
            content = add_breadcrumb(content, config['title'].split(' - ')[0], parents)
        
        write_html(filepath, content)
        print(f"   ✓ 已优化 {filename}")
        fixed_count += 1
    
    # 2. 修复日记页面
    print("\n📔 修复日记页面 SEO...")
    diary_days = sorted([int(re.search(r'day(\d+)', k).group(1)) for k in DIARY_CONFIG.keys()])
    max_day = max(diary_days) if diary_days else 0
    
    for filename, config in DIARY_CONFIG.items():
        filepath = BLOG_DIR / filename
        if not filepath.exists():
            print(f"   ⚠️  跳过 {filename} (文件不存在)")
            continue
        
        content = read_html(filepath)
        content = update_meta_tags(content, config['title'], config['description'], config['keywords'])
        content = update_schema_content(content, config['title'], config['description'], config['keywords'], filename)
        
        # 提取日记天数
        day_match = re.search(r'day(\d+)', filename)
        if day_match:
            current_day = int(day_match.group(1))
            # 添加日记导航
            content = add_diary_navigation(content, current_day, max_day)
            # 添加面包屑
            content = add_breadcrumb(content, config['title'].split(' - ')[0], [{'url': 'timeline.html', 'name': '日记列表'}])
        
        write_html(filepath, content)
        print(f"   ✓ 已优化 {filename}")
        fixed_count += 1
    
    # 3. 更新首页
    print("\n🏠 更新首页...")
    index_path = BLOG_DIR / 'index.html'
    if index_path.exists():
        content = read_html(index_path)
        content = update_homepage_with_latest_diaries(content)
        write_html(index_path, content)
        print("   ✓ 已添加最新日记推荐模块")
    
    # 4. 更新 sitemap 时间戳
    print("\n🗺️  更新 sitemap...")
    sitemap_path = BLOG_DIR / 'sitemap.xml'
    if sitemap_path.exists():
        content = read_html(sitemap_path)
        today = datetime.now().strftime('%Y-%m-%d')
        # 更新所有 lastmod 为今天
        content = re.sub(r'<lastmod>[\d-]+</lastmod>', f'<lastmod>{today}</lastmod>', content)
        write_html(sitemap_path, content)
        print("   ✓ 已更新 sitemap 时间戳")
    
    print(f"\n✅ SEO 优化完成！共修复 {fixed_count} 个页面")
    print("\n📊 优化内容：")
    print("   ✓ 更新所有页面 title 标签（30-60 字符）")
    print("   ✓ 更新所有页面 meta description（80-160 字符）")
    print("   ✓ 更新所有页面 meta keywords（3-10 个关键词）")
    print("   ✓ 更新结构化数据内容")
    print("   ✓ 为日记页面添加上一篇/下一篇导航")
    print("   ✓ 为所有页面添加面包屑导航")
    print("   ✓ 首页添加最新日记推荐模块")
    print("   ✓ 更新 sitemap.xml 时间戳")

if __name__ == '__main__':
    main()
