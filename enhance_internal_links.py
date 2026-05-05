#!/usr/bin/env python3
"""
内部链接增强工具 - 为日记页面添加上一篇/下一篇导航
"""

import os
import re
from pathlib import Path

BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")

def extract_day_number(filename):
    """从文件名提取日记天数"""
    match = re.match(r'day(\d+)\.html', filename)
    if match:
        return int(match.group(1))
    return None

def get_diary_pages():
    """获取所有日记页面并按天数排序"""
    diaries = []
    for html_file in BLOG_DIR.glob("day*.html"):
        day_num = extract_day_number(html_file.name)
        if day_num:
            diaries.append((day_num, html_file.name))
    return sorted(diaries, key=lambda x: x[0])

def generate_internal_links(day_num, diaries):
    """为指定日记生成内部链接 HTML"""
    prev_link = ""
    next_link = ""
    
    # 找到上一篇和下一篇
    for i, (d_num, d_file) in enumerate(diaries):
        if d_num == day_num:
            if i > 0:
                prev_num, prev_file = diaries[i - 1]
                prev_link = f'<a href="{prev_file}" class="internal-link prev">← 上一篇：Day {prev_num}</a>'
            if i < len(diaries) - 1:
                next_num, next_file = diaries[i + 1]
                next_link = f'<a href="{next_file}" class="internal-link next">下一篇：Day {next_num} →</a>'
            break
    
    return prev_link, next_link

def add_internal_links_to_file(filepath, prev_link, next_link):
    """为文件添加内部链接"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有内部链接
    if 'internal-link' in content or '上一篇' in content or '下一篇' in content:
        return False, "已存在内部链接"
    
    # 查找文章主要内容结束位置（在</article>之前）
    article_end = content.find('</article>')
    if article_end == -1:
        # 尝试找 main 结束
        article_end = content.find('</main>')
    
    if article_end == -1:
        return False, "未找到文章结束标签"
    
    # 生成导航 HTML
    nav_html = '''
    <!-- 内部链接导航 -->
    <nav class="article-navigation" style="display: flex; justify-content: space-between; margin: 40px 0; padding: 20px 0; border-top: 1px solid #e8e4dc;">
        <div>''' + prev_link + '''</div>
        <div>''' + next_link + '''</div>
    </nav>
'''
    
    # 插入导航
    new_content = content[:article_end] + nav_html + content[article_end:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True, "已添加内部链接"

def add_breadcrumb_to_file(filepath, title):
    """为文件添加面包屑导航"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有面包屑
    if 'breadcrumb' in content.lower():
        return False, "已存在面包屑导航"
    
    # 查找 body 开始位置
    body_start = content.find('<body>')
    if body_start == -1:
        return False, "未找到<body>标签"
    
    # 生成面包屑 HTML
    breadcrumb_html = f'''
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" style="padding: 20px 40px; background: #f5f3f0; font-size: 14px;">
        <a href="index.html" style="color: #c44536; text-decoration: none;">首页</a>
        <span style="margin: 0 8px; color: #999;">/</span>
        <a href="articles.html" style="color: #c44536; text-decoration: none;">创业日记</a>
        <span style="margin: 0 8px; color: #999;">/</span>
        <span style="color: #666;">{title}</span>
    </nav>
'''
    
    # 插入面包屑
    insert_pos = body_start + 6  # </body>之后
    new_content = content[:insert_pos] + breadcrumb_html + content[insert_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True, "已添加面包屑导航"

def extract_title(filepath):
    """从 HTML 文件提取标题"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if title_match:
        title = title_match.group(1).strip()
        # 清理标题，移除"| OPC 创业日记"等后缀
        title = re.sub(r'\s*\|.*$', '', title)
        return title
    return "未知页面"

def main():
    print("=" * 60)
    print("内部链接增强工具")
    print("=" * 60)
    
    diaries = get_diary_pages()
    print(f"\n📖 找到 {len(diaries)} 篇日记页面")
    
    # 为每篇日记添加内部链接
    updated = 0
    skipped = 0
    
    for day_num, filename in diaries:
        filepath = BLOG_DIR / filename
        prev_link, next_link = generate_internal_links(day_num, diaries)
        
        # 只添加缺失的链接
        success, message = add_internal_links_to_file(filepath, prev_link, next_link)
        
        if success:
            updated += 1
            print(f"  ✓ {filename}: {message}")
        else:
            skipped += 1
            print(f"  ○ {filename}: {message}")
    
    print(f"\n📊 结果：更新 {updated} 篇，跳过 {skipped} 篇")
    
    # 为缺失面包屑的页面添加面包屑
    print("\n🍞 添加面包屑导航...")
    breadcrumb_updated = 0
    
    for day_num, filename in diaries:
        filepath = BLOG_DIR / filename
        title = extract_title(filepath)
        success, message = add_breadcrumb_to_file(filepath, title)
        
        if success:
            breadcrumb_updated += 1
            print(f"  ✓ {filename}: {message}")
    
    print(f"\n📊 面包屑更新：{breadcrumb_updated} 篇")
    print("\n✅ 内部链接增强完成！")

if __name__ == "__main__":
    main()
