#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
添加内部链接和面包屑导航
功能：
1. 为日记页面添加前后导航
2. 为所有页面添加面包屑导航
3. 在首页添加最新日记链接
4. 在日记页面添加相关文章推荐
"""

import re
from pathlib import Path
from datetime import datetime

WORKSPACE = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")
BASE_URL = "https://shifei.world"

# 日记页面顺序
DIARY_ORDER = ["day1.html", "day2.html", "day3.html", "day5.html", "day10.html", "day12.html"]

# 面包屑导航 HTML 模板
BREADCRUMB_TEMPLATE = '''
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" aria-label="面包屑导航">
        <ol class="breadcrumb-list" style="display:flex;gap:8px;list-style:none;padding:15px 20px;margin:0;background:#f9f8f6;border-bottom:1px solid #e8e4dc;font-size:14px;">
            <li class="breadcrumb-item"><a href="/index.html" style="color:#666;text-decoration:none;">首页</a></li>
            <li class="breadcrumb-separator" style="color:#999;">/</li>
            <li class="breadcrumb-item"><a href="/articles.html" style="color:#666;text-decoration:none;">文章</a></li>
            <li class="breadcrumb-separator" style="color:#999;">/</li>
            <li class="breadcrumb-item active" aria-current="page" style="color:#c44536;font-weight:500;">{page_title}</li>
        </ol>
    </nav>
'''

# 日记页面导航模板
DIARY_NAV_TEMPLATE = '''
    <!-- 日记导航 -->
    <nav class="diary-navigation" style="display:flex;justify-content:space-between;align-items:center;padding:20px;margin:30px 0;background:#fff;border:1px solid #e8e4dc;border-radius:12px;">
        <a href="{prev_link}" class="prev-diary" style="color:#666;text-decoration:none;display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">←</span>
            <span>
                <div style="font-size:12px;color:#999;">上一篇</div>
                <div style="font-weight:600;color:#333;">{prev_title}</div>
            </span>
        </a>
        <a href="/articles.html" class="all-diaries" style="color:#c44536;text-decoration:none;font-weight:500;">所有日记 →</a>
        <a href="{next_link}" class="next-diary" style="color:#666;text-decoration:none;display:flex;align-items:center;gap:8px;text-align:right;">
            <span>
                <div style="font-size:12px;color:#999;">下一篇</div>
                <div style="font-weight:600;color:#333;">{next_title}</div>
            </span>
            <span style="font-size:20px;">→</span>
        </a>
    </nav>
'''

def add_breadcrumb_to_page(content, page_title):
    """添加面包屑导航到页面"""
    # 查找</head>标签之前的位置
    head_end = content.find("</head>")
    if head_end == -1:
        return content
    
    # 查找<body>标签
    body_start = content.find("<body>")
    if body_start == -1:
        return content
    
    # 在<body>后添加面包屑
    breadcrumb_html = BREADCRUMB_TEMPLATE.format(page_title=page_title)
    insert_pos = body_start + len("<body>")
    
    # 检查是否已有面包屑
    if 'class="breadcrumb"' in content:
        return content
    
    new_content = content[:insert_pos] + "\n" + breadcrumb_html + content[insert_pos:]
    return new_content

def add_diary_navigation(content, current_diary_index):
    """添加日记导航"""
    if current_diary_index < 0 or current_diary_index >= len(DIARY_ORDER):
        return content
    
    # 检查是否已有日记导航
    if 'class="diary-navigation"' in content:
        return content
    
    # 获取前后日记
    prev_index = current_diary_index - 1
    next_index = current_diary_index + 1
    
    prev_file = DIARY_ORDER[prev_index] if prev_index >= 0 else None
    next_file = DIARY_ORDER[next_index] if next_index < len(DIARY_ORDER) else None
    
    # 提取标题
    title_match = re.search(r'<title[^>]*>([^<]+)</title>', content)
    current_title = title_match.group(1).strip() if title_match else "当前日记"
    
    # 构建导航 HTML
    nav_parts = []
    
    if prev_file:
        prev_title = prev_file.replace(".html", "").replace("day", "Day ")
        prev_link = f"/{prev_file}"
    else:
        prev_title = "第一篇"
        prev_link = "/articles.html"
    
    if next_file:
        next_title = next_file.replace(".html", "").replace("day", "Day ")
        next_link = f"/{next_file}"
    else:
        next_title = "最新一篇"
        next_link = "/timeline.html"
    
    nav_html = DIARY_NAV_TEMPLATE.format(
        prev_link=prev_link,
        prev_title=prev_title,
        next_link=next_link,
        next_title=next_title
    )
    
    # 在</body>前插入导航
    body_end = content.find("</body>")
    if body_end != -1:
        new_content = content[:body_end] + "\n" + nav_html + "\n" + content[body_end:]
        return new_content
    
    return content

def add_related_links_to_index(content):
    """在首页添加最新日记链接"""
    # 查找合适的位置插入（在主要内容区域）
    # 这里简化处理，在</body>前添加
    body_end = content.find("</body>")
    if body_end == -1:
        return content
    
    # 检查是否已有相关链接
    if 'class="latest-diaries"' in content:
        return content
    
    related_html = '''
    <!-- 最新日记推荐 -->
    <section class="latest-diaries" style="max-width:960px;margin:40px auto;padding:0 20px;">
        <h2 style="font-size:24px;font-weight:700;color:#222;margin-bottom:20px;">📔 最新日记</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
'''
    
    # 添加最新 3 篇日记
    for diary_file in DIARY_ORDER[-3:][::-1]:
        diary_name = diary_file.replace(".html", "").replace("day", "Day ")
        related_html += f'''
            <a href="/{diary_file}" style="background:#fff;border:1px solid #e8e4dc;border-radius:12px;padding:20px;text-decoration:none;color:inherit;transition:all 0.2s;">
                <div style="font-size:14px;color:#999;margin-bottom:8px;">创业日记</div>
                <div style="font-size:18px;font-weight:600;color:#333;margin-bottom:10px;">{diary_name}</div>
                <div style="font-size:14px;color:#666;">点击阅读 →</div>
            </a>
'''
    
    related_html += '''
        </div>
    </section>
'''
    
    new_content = content[:body_end] + related_html + "\n" + content[body_end:]
    return new_content

def optimize_page(filename):
    """优化单个页面"""
    filepath = WORKSPACE / filename
    
    if not filepath.exists():
        print(f"❌ 文件不存在：{filename}")
        return False
    
    try:
        content = filepath.read_text(encoding="utf-8")
        original_content = content
        
        # 提取页面标题
        title_match = re.search(r'<title[^>]*>([^<]+)</title>', content)
        page_title = title_match.group(1).strip() if title_match else filename
        
        # 添加面包屑导航（除了首页和 404）
        if filename not in ["index.html", "404.html", "day-template.html"]:
            content = add_breadcrumb_to_page(content, page_title)
        
        # 为日记页面添加导航
        if filename in DIARY_ORDER:
            diary_index = DIARY_ORDER.index(filename)
            content = add_diary_navigation(content, diary_index)
        
        # 为首页添加最新日记推荐
        if filename == "index.html":
            content = add_related_links_to_index(content)
        
        # 保存修改
        if content != original_content:
            filepath.write_text(content, encoding="utf-8")
            print(f"✅ 已优化：{filename}")
            return True
        else:
            print(f"⚠️  无需修改：{filename}")
            return False
            
    except Exception as e:
        print(f"❌ 优化失败 {filename}: {e}")
        return False

def main():
    print("🔧 开始添加内部链接和面包屑导航...\n")
    
    optimized_count = 0
    
    # 优化所有 HTML 文件
    html_files = [f for f in WORKSPACE.glob("*.html") 
                  if not f.name.startswith(".") and f.name != "day-template.html"]
    
    for html_file in sorted(html_files):
        if optimize_page(html_file.name):
            optimized_count += 1
    
    print(f"\n✅ 完成！共优化 {optimized_count} 个页面")
    print("\n📊 优化内容：")
    print("  - 添加面包屑导航（提升用户体验和 SEO）")
    print("  - 添加日记页面间导航（增强页面关联性）")
    print("  - 首页添加最新日记推荐（提升内容发现）")

if __name__ == "__main__":
    main()
