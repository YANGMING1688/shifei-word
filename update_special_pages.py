#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新 day5.html、day-template.html、ai-experiment.html、status.html、404.html 的导航栏
"""

import re

# 统一的导航栏模板
NAVBAR_FULL = '''    <nav class="navbar" id="navbar">
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

NAVBAR_DIARY = '''    <nav class="navbar" id="navbar">
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
                <a href="day1.html" class="nav-link active" data-page="diary">日记</a>
                <a href="about.html" class="nav-link" data-page="about">关于</a>
            </div>
        </div>
    </nav>'''

def update_file(filepath, navbar_html):
    """更新文件中的导航栏"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 匹配旧导航栏
    pattern = r'<nav class="navbar"[^>]*>.*?</nav>'
    
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, navbar_html, content, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 已更新：{filepath}")
        return True
    else:
        print(f"❌ 未找到导航栏：{filepath}")
        return False

# 更新文件
base_dir = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"

print("更新特殊文件的导航栏...\n")

# day5.html - 日记类
update_file(f"{base_dir}/day5.html", NAVBAR_DIARY)

# day-template.html - 模板文件，不需要 active
update_file(f"{base_dir}/day-template.html", NAVBAR_FULL)

# ai-experiment.html - 日记类
update_file(f"{base_dir}/ai-experiment.html", NAVBAR_DIARY)

# status.html - 首页类
update_file(f"{base_dir}/status.html", NAVBAR_FULL)

# 404.html - 首页类
update_file(f"{base_dir}/404.html", NAVBAR_FULL)

print("\n✅ 完成！")
