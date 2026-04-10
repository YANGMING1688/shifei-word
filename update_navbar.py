#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OPC 网站导航栏统一更新脚本
功能：将所有 HTML 页面的导航栏更新为统一的固定导航栏
"""

import os
import re

# 统一的导航栏 HTML 模板
NAVBAR_TEMPLATE = '''    <!-- 导航栏 -->
    <nav class="navbar" id="navbar">
        <div class="navbar-container">
            <div class="navbar-left">
                <a href="/" class="logo">
                    <span class="logo-emoji">🦞</span>
                    <span>OPC 一人公司</span>
                </a>
            </div>
            <div class="navbar-right">
                <a href="/" class="nav-link" data-page="index">首页</a>
                <a href="skills.html" class="nav-link" data-page="skills">🛠️ 技能</a>
                <a href="founder.html" class="nav-link" data-page="founder">创始人</a>
                <a href="company.html" class="nav-link" data-page="company">行上科技</a>
                <a href="timeline.html" class="nav-link" data-page="timeline">进化轨迹</a>
                <a href="day1.html" class="nav-link" data-page="diary">日记</a>
                <a href="about.html" class="nav-link" data-page="about">关于</a>
            </div>
        </div>
    </nav>'''

# 页面映射关系，用于设置 active 类
PAGE_MAP = {
    'index.html': 'index',
    'about.html': 'about',
    'articles.html': 'diary',
    'company.html': 'company',
    'day1.html': 'diary',
    'day2.html': 'diary',
    'day3.html': 'diary',
    'day5.html': 'diary',
    'founder.html': 'founder',
    'skills.html': 'skills',
    'timeline.html': 'timeline',
    'week1-review.html': 'diary',
    'ai-experiment.html': 'diary',
    'status.html': 'index',
    'day-template.html': 'diary',
}

def get_navbar_for_page(filename):
    """为指定页面生成导航栏 HTML（带 active 类）"""
    page_id = PAGE_MAP.get(filename, 'index')
    
    navbar = NAVBAR_TEMPLATE
    # 为当前页面的链接添加 active 类
    navbar = navbar.replace(f'data-page="{page_id}"', f'data-page="{page_id}" class="nav-link active"')
    # 清理多余的 class
    navbar = navbar.replace('class="nav-link active" class="nav-link"', 'class="nav-link active"')
    
    return navbar

def update_navbar_in_file(filepath, filename):
    """更新单个文件中的导航栏"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 匹配旧的导航栏结构（多种可能）
    navbar_patterns = [
        r'<!-- 导航栏 -->\s*<nav class="navbar"[^>]*>.*?</nav>',
        r'<!-- 导航栏 -->\s*<nav class="navbar"[^>]*id="navbar"[^>]*>.*?</nav>',
        r'<nav class="navbar"[^>]*>.*?<div class="navbar-left">.*?</div>\s*<div class="navbar-right">.*?</div>\s*</nav>',
    ]
    
    new_navbar = get_navbar_for_page(filename)
    updated = False
    
    for pattern in navbar_patterns:
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, new_navbar, content, flags=re.DOTALL)
            updated = True
            break
    
    if not updated:
        print(f"⚠️  未找到导航栏：{filename}")
        return False
    
    # 写回文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 已更新：{filename}")
    return True

def main():
    """主函数"""
    website_dir = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
    
    # 获取所有 HTML 文件
    html_files = [f for f in os.listdir(website_dir) if f.endswith('.html')]
    
    print(f"🦞 OPC 网站导航栏统一更新")
    print(f"================================")
    print(f"找到 {len(html_files)} 个 HTML 文件\n")
    
    success_count = 0
    for filename in html_files:
        filepath = os.path.join(website_dir, filename)
        if update_navbar_in_file(filepath, filename):
            success_count += 1
    
    print(f"\n================================")
    print(f"✅ 完成！更新了 {success_count}/{len(html_files)} 个文件")

if __name__ == '__main__':
    main()
