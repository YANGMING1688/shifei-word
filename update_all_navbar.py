#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OPC 网站导航栏统一更新 - 按照 day1.html 截图样式
导航栏：🏠 首页 | 👨 创始人 | 🏢 行上科技 | 📈 进化轨迹 | 📔 日记 | ✏️ 文章 | 🦀 关于 OPC
"""

import os
import re

# 导航栏模板
NAVBAR_TEMPLATE = '''    <!-- 导航栏 -->
    <nav class="navbar" id="navbar">
        <div class="navbar-container">
            <div class="navbar-left">
                <a href="/" class="logo">
                    <span class="logo-emoji">🚀</span>
                    <span>OPC 一人公司</span>
                </a>
            </div>
            <div class="navbar-right">
                <a href="/" class="nav-link{active_index}">🏠 首页</a>
                <a href="founder.html" class="nav-link{active_founder}">👨 创始人</a>
                <a href="company.html" class="nav-link{active_company}">🏢 行上科技</a>
                <a href="timeline.html" class="nav-link{active_timeline}">📈 进化轨迹</a>
                <a href="day1.html" class="nav-link{active_diary}">📔 日记</a>
                <a href="articles.html" class="nav-link{active_articles}">✏️ 文章</a>
                <a href="about.html" class="nav-link{active_about}">🦀 关于 OPC</a>
            </div>
        </div>
    </nav>'''

# 页面映射关系
PAGE_MAP = {
    'index.html': 'active_index',
    'founder.html': 'active_founder',
    'company.html': 'active_company',
    'timeline.html': 'active_timeline',
    'day1.html': 'active_diary',
    'day2.html': 'active_diary',
    'day3.html': 'active_diary',
    'day5.html': 'active_diary',
    'about.html': 'active_about',
    'articles.html': 'active_articles',
    'ai-experiment.html': 'active_articles',
    'week1-review.html': 'active_articles',
    'skills.html': 'active_articles',
    'status.html': 'active_index',
    'day-template.html': 'active_diary',
    '404.html': 'active_index',
}

def get_navbar_for_page(filename):
    """为指定页面生成导航栏 HTML（带 active 类）"""
    active_class = PAGE_MAP.get(filename, 'active_index')
    
    navbar = NAVBAR_TEMPLATE
    # 为当前页面的链接添加 active 类
    navbar = navbar.replace(f'{{{active_class}}}', ' active')
    # 清理其他占位符
    for key in PAGE_MAP.values():
        navbar = navbar.replace(f'{{{key}}}', '')
    
    return navbar

def update_navbar_in_file(filepath, filename):
    """更新单个文件中的导航栏"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 匹配旧的导航栏结构（多种可能）
    patterns = [
        r'<!-- 导航栏 -->\s*<nav class="navbar"[^>]*>.*?</nav>',
        r'<nav class="navbar"[^>]*id="navbar"[^>]*>.*?</nav>',
        r'<nav class="navbar"[^>]*>.*?<div class="navbar-left">.*?</div>\s*<div class="navbar-right">.*?</div>\s*</nav>',
    ]
    
    new_navbar = get_navbar_for_page(filename)
    
    for pattern in patterns:
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, new_navbar, content, flags=re.DOTALL)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ 已更新：{filename}")
            return True
    
    print(f"⚠️  未找到导航栏：{filename}")
    return False

def main():
    """主函数"""
    website_dir = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
    
    html_files = [f for f in os.listdir(website_dir) if f.endswith('.html')]
    
    print(f"🦞 OPC 网站导航栏统一更新")
    print(f"导航栏：🏠 首页 | 👨 创始人 | 🏢 行上科技 | 📈 进化轨迹 | 📔 日记 | ✏️ 文章 | 🦀 关于 OPC")
    print(f"================================\n")
    
    success_count = 0
    for filename in sorted(html_files):
        filepath = os.path.join(website_dir, filename)
        if update_navbar_in_file(filepath, filename):
            success_count += 1
    
    print(f"\n================================")
    print(f"✅ 完成！更新了 {success_count}/{len(html_files)} 个文件")

if __name__ == '__main__':
    main()
