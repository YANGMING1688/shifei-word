#!/usr/bin/env python3
"""
添加内部链接优化：
1. 首页添加最新日记链接
2. 日记页面添加面包屑导航
3. 日记页面之间添加前后导航
"""

import re
from pathlib import Path

BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")
BASE_URL = "https://shifei.world"

# 面包屑导航 HTML
BREADCRUMB_TEMPLATE = '''
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" aria-label="面包屑导航" style="padding: 12px 40px; background: #f5f3f0; border-bottom: 1px solid #e8e4dc; font-size: 14px;">
        <a href="/" style="color: #0066ff; text-decoration: none;">首页</a>
        <span style="color: #999; margin: 0 8px;">/</span>
        <a href="/articles.html" style="color: #0066ff; text-decoration: none;">文章</a>
        <span style="color: #999; margin: 0 8px;">/</span>
        <span style="color: #666;">{title}</span>
    </nav>
'''

# 日记前后导航 HTML
DIARY_NAV_TEMPLATE = '''
    <!-- 日记导航 -->
    <div class="diary-navigation" style="display: flex; justify-content: space-between; padding: 20px 40px; margin-top: 40px; border-top: 1px solid #e8e4dc;">
        {prev_link}
        {next_link}
    </div>
'''

def get_diary_files():
    """获取所有日记文件并排序"""
    diary_files = []
    for f in BLOG_DIR.glob("day*.html"):
        if f.name == "day-template.html":
            continue
        match = re.search(r'day(\d+)', f.name)
        if match:
            day_num = int(match.group(1))
            diary_files.append((day_num, f))
    
    # 按天数排序
    diary_files.sort(key=lambda x: x[0])
    return diary_files

def add_breadcrumb(html_file, title):
    """添加面包屑导航"""
    content = html_file.read_text(encoding="utf-8")
    
    # 检查是否已有面包屑
    if 'class="breadcrumb"' in content:
        return False
    
    # 找到 navbar 之后的位置
    navbar_match = re.search(r'</nav>\s*', content)
    if not navbar_match:
        return False
    
    insert_pos = navbar_match.end()
    breadcrumb = BREADCRUMB_TEMPLATE.format(title=title)
    
    content = content[:insert_pos] + breadcrumb + content[insert_pos:]
    html_file.write_text(content, encoding="utf-8")
    return True

def add_diary_navigation(html_file, prev_day, next_day, diary_files):
    """添加日记前后导航"""
    content = html_file.read_text(encoding="utf-8")
    
    # 检查是否已有导航
    if 'class="diary-navigation"' in content:
        return False
    
    # 生成前后链接
    prev_link = ""
    next_link = ""
    
    if prev_day:
        prev_file = f"day{prev_day}.html"
        prev_title = f"← 第{prev_day}天"
        prev_link = f'<a href="/{prev_file}" style="color: #0066ff; text-decoration: none; padding: 10px 20px; background: #fff; border-radius: 6px;">{prev_title}</a>'
    
    if next_day:
        next_file = f"day{next_day}.html"
        next_title = f"第{next_day}天 →"
        next_link = f'<a href="/{next_file}" style="color: #0066ff; text-decoration: none; padding: 10px 20px; background: #fff; border-radius: 6px;">{next_title}</a>'
    
    if not prev_link and not next_link:
        return False
    
    nav_html = DIARY_NAV_TEMPLATE.format(prev_link=prev_link, next_link=next_link)
    
    # 找到文章结尾位置（在 </article> 之前）
    article_end = content.find("</article>")
    if article_end == -1:
        # 如果没有 article 标签，找主要内容结尾
        article_end = content.find("</main>")
    
    if article_end == -1:
        return False
    
    content = content[:article_end] + nav_html + "\n" + content[article_end:]
    html_file.write_text(content, encoding="utf-8")
    return True

def update_homepage_with_latest_diary():
    """更新首页，添加最新日记链接"""
    index_file = BLOG_DIR / "index.html"
    if not index_file.exists():
        print("  ⚠️ index.html 不存在")
        return False
    
    content = index_file.read_text(encoding="utf-8")
    
    # 获取日记列表
    diary_files = get_diary_files()
    if not diary_files:
        return False
    
    # 获取最新 3 篇日记
    latest_diaries = diary_files[-3:][::-1]  # 倒序，最新的在前
    
    # 生成最新日记链接 HTML
    latest_diaries_html = '''
    <!-- 最新日记 -->
    <section class="latest-diaries" style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
        <h2 style="font-size: 24px; margin-bottom: 20px; color: #1a1714;">📔 最新日记</h2>
        <div style="display: grid; gap: 16px;">
'''
    
    for day_num, diary_file in latest_diaries:
        # 读取日记标题
        try:
            diary_content = diary_file.read_text(encoding="utf-8")
            title_match = re.search(r'<title>([^<]+)</title>', diary_content)
            title = title_match.group(1) if title_match else f"Day {day_num}"
            
            # 读取描述
            desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', diary_content)
            description = desc_match.group(1) if desc_match else ""
            
            mtime = diary_file.stat().st_mtime
            from datetime import datetime
            date_str = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
            
            latest_diaries_html += f'''
            <a href="/{diary_file.name}" style="display: block; padding: 20px; background: #fff; border-radius: 8px; text-decoration: none; border: 1px solid #e8e4dc; transition: box-shadow 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                <h3 style="font-size: 18px; color: #0066ff; margin-bottom: 8px;">{title}</h3>
                <p style="color: #666; font-size: 14px; margin-bottom: 8px;">{description[:100]}...</p>
                <span style="color: #999; font-size: 12px;">{date_str}</span>
            </a>
'''
        except Exception as e:
            print(f"  ⚠️ 读取 {diary_file.name} 失败：{e}")
    
    latest_diaries_html += '''
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <a href="/articles.html" style="color: #0066ff; text-decoration: none;">查看所有文章 →</a>
        </div>
    </section>
'''
    
    # 检查是否已有最新日记部分
    if 'class="latest-diaries"' in content:
        print("  ✓ 首页已有最新日记部分")
        return False
    
    # 找到合适的位置插入（在 main 标签内，第一个 section 之后）
    main_match = re.search(r'<main[^>]*>', content)
    if not main_match:
        return False
    
    # 找到第一个 section 的结尾
    first_section_end = content.find("</section>", main_match.end())
    if first_section_end == -1:
        return False
    
    insert_pos = first_section_end + len("</section>")
    content = content[:insert_pos] + latest_diaries_html + content[insert_pos:]
    index_file.write_text(content, encoding="utf-8")
    return True

def main():
    """主函数"""
    print("=" * 60)
    print("添加内部链接优化")
    print("=" * 60)
    
    # 1. 更新首页
    print("\n🏠 更新首页...")
    if update_homepage_with_latest_diary():
        print("  ✅ 添加最新日记链接")
    else:
        print("  ✓ 首页已优化")
    
    # 2. 添加日记导航
    print("\n📔 处理日记页面导航...")
    diary_files = get_diary_files()
    
    for i, (day_num, diary_file) in enumerate(diary_files):
        # 获取标题
        try:
            content = diary_file.read_text(encoding="utf-8")
            title_match = re.search(r'<title>([^<]+)</title>', content)
            title = title_match.group(1) if title_match else f"Day {day_num}"
        except:
            title = f"Day {day_num}"
        
        # 添加面包屑
        breadcrumb_added = add_breadcrumb(diary_file, title)
        
        # 添加前后导航
        prev_day = diary_files[i-1][0] if i > 0 else None
        next_day = diary_files[i+1][0] if i < len(diary_files) - 1 else None
        
        nav_added = add_diary_navigation(diary_file, prev_day, next_day, diary_files)
        
        status = []
        if breadcrumb_added:
            status.append("✅ 面包屑")
        if nav_added:
            status.append("✅ 导航")
        
        if status:
            print(f"  {', '.join(status)} {diary_file.name}")
        else:
            print(f"  ✓ 已完成 {diary_file.name}")
    
    # 3. 处理其他页面的面包屑
    print("\n📄 处理其他页面面包屑...")
    other_pages = {
        "about.html": "关于",
        "articles.html": "文章列表",
        "company.html": "公司",
        "founder.html": "创始人",
        "skills.html": "技能",
        "timeline.html": "时间线",
        "status.html": "状态",
        "inspiring-article.html": "励志文章",
        "cross-border-ecommerce.html": "跨境电商",
        "week1-review.html": "第一周复盘",
        "ai-experiment.html": "AI 实验",
        "404.html": "页面未找到"
    }
    
    for filename, title in other_pages.items():
        html_file = BLOG_DIR / filename
        if not html_file.exists():
            continue
        
        if add_breadcrumb(html_file, title):
            print(f"  ✅ 面包屑 {filename}")
        else:
            print(f"  ✓ 已完成 {filename}")
    
    print("\n✅ 内部链接优化完成！")

if __name__ == "__main__":
    main()
