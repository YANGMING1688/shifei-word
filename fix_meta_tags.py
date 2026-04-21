#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 meta 标签格式问题
"""

import os
import re
from pathlib import Path

BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")

# 完整的页面 SEO 配置
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

def fix_file(filepath, config):
    """修复单个文件的 meta 标签"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 修复/更新 title
    title_pattern = r'<title[^>]*>.*?</title>'
    content = re.sub(title_pattern, f'<title>{config["title"]}</title>', content, flags=re.IGNORECASE | re.DOTALL)
    
    # 2. 修复 description - 先删除所有有问题的 description 行
    content = re.sub(r'\s*<meta[^>]*name=["\']description["\'][^>]*>\n?', '', content, flags=re.IGNORECASE)
    
    # 3. 修复 keywords - 先删除所有 keywords 行
    content = re.sub(r'\s*<meta[^>]*name=["\']keywords["\'][^>]*>\n?', '', content, flags=re.IGNORECASE)
    
    # 4. 在 viewport 后插入正确的 meta 标签
    viewport_pattern = r'(<meta name="viewport" content="width=device-width, initial-scale=1\.0">)'
    meta_tags = r'\1\n    <meta name="description" content="' + config['description'] + '">\n    <meta name="keywords" content="' + config['keywords'] + '">'
    
    content = re.sub(viewport_pattern, meta_tags, content, flags=re.IGNORECASE)
    
    # 写入文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print("🔧 修复 meta 标签格式问题...")
    
    fixed_count = 0
    
    # 修复普通页面
    for filename, config in PAGE_SEO_CONFIG.items():
        filepath = BLOG_DIR / filename
        if filepath.exists():
            fix_file(filepath, config)
            print(f"   ✓ 已修复 {filename}")
            fixed_count += 1
    
    # 修复日记页面
    for filename, config in DIARY_CONFIG.items():
        filepath = BLOG_DIR / filename
        if filepath.exists():
            fix_file(filepath, config)
            print(f"   ✓ 已修复 {filename}")
            fixed_count += 1
    
    print(f"\n✅ 共修复 {fixed_count} 个文件")

if __name__ == '__main__':
    main()
