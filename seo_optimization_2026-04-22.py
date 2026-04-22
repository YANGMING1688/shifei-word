#!/usr/bin/env python3
"""
SEO 自动优化脚本 - 2026-04-22
执行完整的 SEO 优化流程：
1. 扫描所有 HTML 文件生成 sitemap.xml
2. 检查并优化页面 SEO 元素
3. 添加内部链接
4. 生成 SEO 报告
"""

import os
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
import json

# 配置
BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")
BASE_URL = "https://shifei.world"

# 页面优先级配置
PAGE_PRIORITIES = {
    'index.html': {'priority': 1.0, 'changefreq': 'daily'},
    'articles.html': {'priority': 0.9, 'changefreq': 'weekly'},
    'timeline.html': {'priority': 0.9, 'changefreq': 'weekly'},
    'skills.html': {'priority': 0.9, 'changefreq': 'weekly'},
    'about.html': {'priority': 0.8, 'changefreq': 'monthly'},
    'company.html': {'priority': 0.8, 'changefreq': 'monthly'},
    'founder.html': {'priority': 0.8, 'changefreq': 'monthly'},
    'cross-border-ecommerce.html': {'priority': 0.7, 'changefreq': 'monthly'},
    'ai-experiment.html': {'priority': 0.7, 'changefreq': 'monthly'},
    'inspiring-article.html': {'priority': 0.7, 'changefreq': 'monthly'},
    'week1-review.html': {'priority': 0.7, 'changefreq': 'monthly'},
    'status.html': {'priority': 0.7, 'changefreq': 'monthly'},
}

# 日记页面优先级
DIARY_PRIORITY = {'priority': 0.8, 'changefreq': 'weekly'}

def get_all_html_files():
    """扫描所有 HTML 文件"""
    html_files = []
    for f in BLOG_DIR.glob("*.html"):
        if f.name not in ['day-template.html', '404.html']:
            html_files.append(f.name)
    return sorted(html_files)

def get_file_modtime(filename):
    """获取文件修改时间"""
    filepath = BLOG_DIR / filename
    mtime = datetime.fromtimestamp(filepath.stat().st_mtime)
    return mtime.strftime('%Y-%m-%d')

def generate_sitemap():
    """生成 sitemap.xml"""
    print("\n📝 生成 sitemap.xml...")
    
    html_files = get_all_html_files()
    
    # 创建 XML 结构
    urlset = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for filename in html_files:
        url_elem = ET.SubElement(urlset, 'url')
        
        # 添加 loc
        loc = ET.SubElement(url_elem, 'loc')
        if filename == 'index.html':
            loc.text = f"{BASE_URL}/"
        else:
            loc.text = f"{BASE_URL}/{filename}"
        
        # 添加 lastmod
        lastmod = ET.SubElement(url_elem, 'lastmod')
        lastmod.text = get_file_modtime(filename)
        
        # 添加 changefreq 和 priority
        changefreq = ET.SubElement(url_elem, 'changefreq')
        priority = ET.SubElement(url_elem, 'priority')
        
        if filename.startswith('day'):
            changefreq.text = DIARY_PRIORITY['changefreq']
            priority.text = str(DIARY_PRIORITY['priority'])
        elif filename in PAGE_PRIORITIES:
            changefreq.text = PAGE_PRIORITIES[filename]['changefreq']
            priority.text = str(PAGE_PRIORITIES[filename]['priority'])
        else:
            changefreq.text = 'monthly'
            priority.text = '0.6'
    
    # 写入文件
    tree = ET.ElementTree(urlset)
    sitemap_path = BLOG_DIR / 'sitemap.xml'
    
    # 美化输出
    with open(sitemap_path, 'wb') as f:
        f.write(b'<?xml version="1.0" encoding="UTF-8"?>\n')
        tree.write(f, encoding='unicode' if False else None, xml_declaration=False)
    
    # 重新读取并格式化
    with open(sitemap_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 简单的格式化
    content = content.replace('><', '>\n<')
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 生成 sitemap.xml，包含 {len(html_files)} 个页面")
    return html_files

def check_seo_elements(filename):
    """检查页面 SEO 元素"""
    filepath = BLOG_DIR / filename
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    checks = {
        'title': bool(re.search(r'<title>[^<]+</title>', content)),
        'meta_description': bool(re.search(r'<meta[^>]*name=["\']description["\']', content)),
        'meta_keywords': bool(re.search(r'<meta[^>]*name=["\']keywords["\']', content)),
        'canonical': bool(re.search(r'<link[^>]*rel=["\']canonical["\']', content)),
        'structured_data': bool(re.search(r'<script[^>]*type=["\']application/ld\+json["\']', content)),
        'og_tags': bool(re.search(r'<meta[^>]*property=["\']og:', content)),
        'h1': bool(re.search(r'<h1[^>]*>', content)),
    }
    
    return checks

def get_diary_links():
    """获取所有日记页面链接"""
    diaries = []
    for f in sorted(BLOG_DIR.glob("day*.html")):
        if f.name != 'day-template.html':
            # 提取日记编号
            match = re.search(r'day(\d+)\.html', f.name)
            if match:
                num = int(match.group(1))
                diaries.append((num, f.name))
    return diaries

def add_internal_links(filename):
    """添加内部链接到日记页面"""
    filepath = BLOG_DIR / filename
    
    if not filename.startswith('day'):
        return False
    
    # 读取文件
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取当前日记编号
    match = re.search(r'day(\d+)\.html', filename)
    if not match:
        return False
    
    current_num = int(match.group(1))
    diaries = get_diary_links()
    
    # 生成导航链接
    nav_links = []
    
    # 上一篇
    prev_num = current_num - 1
    prev_diary = next((d for n, d in diaries if n == prev_num), None)
    
    # 下一篇
    next_num = current_num + 1
    next_diary = next((d for n, d in diaries if n == next_num), None)
    
    # 检查是否已有导航
    if '上一篇' in content or '下一篇' in content or 'Previous' in content or 'Next' in content:
        print(f"  ⚠️  {filename} 已有导航链接，跳过")
        return False
    
    # 查找文章结尾位置（在</article>之前）
    article_end = content.rfind('</article>')
    if article_end == -1:
        # 尝试找 main 结尾
        article_end = content.rfind('</main>')
    
    if article_end == -1:
        print(f"  ⚠️  {filename} 未找到文章结尾，跳过")
        return False
    
    # 生成导航 HTML
    nav_html = '''
    <!-- 日记导航 -->
    <div class="diary-navigation" style="display: flex; justify-content: space-between; margin: 40px 0; padding: 20px 0; border-top: 1px solid #e8e4dc;">
'''
    
    if prev_diary:
        nav_html += f'''        <a href="{prev_diary}" style="text-decoration: none; color: #c44536;">
            ← 上一篇：{prev_diary.replace('.html', '').replace('day', 'Day ')}
        </a>
'''
    else:
        nav_html += '        <span></span>\n'
    
    nav_html += '''        <a href="articles.html" style="text-decoration: none; color: #666;">
            📋 所有文章
        </a>
'''
    
    if next_diary:
        nav_html += f'''        <a href="{next_diary}" style="text-decoration: none; color: #c44536;">
            下一篇：{next_diary.replace('.html', '').replace('day', 'Day ')} →
        </a>
'''
    else:
        nav_html += '        <span></span>\n'
    
    nav_html += '''    </div>
'''
    
    # 插入导航
    content = content[:article_end] + nav_html + content[article_end:]
    
    # 写回文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✅ {filename} 添加日记导航链接")
    return True

def add_breadcrumb(filename):
    """添加面包屑导航"""
    filepath = BLOG_DIR / filename
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有面包屑
    if 'breadcrumb' in content.lower() or '面包屑' in content:
        return False
    
    # 查找 main 标签开始位置
    main_start = content.find('<main')
    if main_start == -1:
        return False
    
    # 找到 main 标签结束
    main_tag_end = content.find('>', main_start) + 1
    
    # 生成面包屑
    if filename.startswith('day'):
        match = re.search(r'day(\d+)\.html', filename)
        if match:
            num = match.group(1)
            breadcrumb = f'''
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" style="padding: 15px 0; margin-bottom: 20px; font-size: 14px;">
        <a href="index.html" style="color: #666; text-decoration: none;">首页</a>
        <span style="color: #999; margin: 0 8px;">/</span>
        <a href="articles.html" style="color: #666; text-decoration: none;">文章列表</a>
        <span style="color: #999; margin: 0 8px;">/</span>
        <span style="color: #c44536;">Day {num}</span>
    </nav>
'''
            content = content[:main_tag_end] + breadcrumb + content[main_tag_end:]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✅ {filename} 添加面包屑导航")
            return True
    
    return False

def optimize_seo(filename):
    """优化页面 SEO 元素"""
    filepath = BLOG_DIR / filename
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    optimized = False
    
    # 检查并添加缺失的 SEO 元素
    if not re.search(r'<link[^>]*rel=["\']canonical["\']', content):
        # 添加 canonical 标签
        canonical_url = f"{BASE_URL}/{filename}" if filename != 'index.html' else f"{BASE_URL}/"
        canonical_tag = f'    <link rel="canonical" href="{canonical_url}">\n'
        
        # 在</head>前插入
        head_end = content.find('</head>')
        if head_end != -1:
            content = content[:head_end] + canonical_tag + content[head_end:]
            print(f"  ✅ {filename} 添加 canonical 标签")
            optimized = True
    
    # 检查结构化数据
    if not re.search(r'<script[^>]*type=["\']application/ld\+json["\']', content):
        print(f"  ⚠️  {filename} 缺少结构化数据，建议手动添加")
    
    # 写回文件（如果有优化）
    if optimized:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    
    return optimized

def generate_seo_report(html_files):
    """生成 SEO 报告"""
    print("\n📊 生成 SEO 报告...")
    
    report = {
        'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_pages': len(html_files),
        'pages': [],
        'summary': {
            'with_title': 0,
            'with_description': 0,
            'with_keywords': 0,
            'with_canonical': 0,
            'with_structured_data': 0,
            'with_og_tags': 0,
            'with_h1': 0,
        }
    }
    
    for filename in html_files:
        checks = check_seo_elements(filename)
        
        page_report = {
            'filename': filename,
            'url': f"{BASE_URL}/{filename}" if filename != 'index.html' else f"{BASE_URL}/",
            'lastmod': get_file_modtime(filename),
            'seo_checks': checks
        }
        report['pages'].append(page_report)
        
        # 更新汇总
        for key, value in checks.items():
            summary_key = f'with_{key}'
            if summary_key in report['summary']:
                if value:
                    report['summary'][summary_key] += 1
    
    # 生成 Markdown 报告
    md_report = f"""# SEO 优化报告

**生成时间：** {report['generated_at']}  
**网站：** {BASE_URL}  
**总页面数：** {report['total_pages']}

## 📊 SEO 检查汇总

| 检查项 | 通过数量 | 通过率 |
|--------|----------|--------|
| Title 标签 | {report['summary']['with_title']}/{report['total_pages']} | {report['summary']['with_title']*100//report['total_pages']}% |
| Meta Description | {report['summary']['with_description']}/{report['total_pages']} | {report['summary']['with_description']*100//report['total_pages']}% |
| Meta Keywords | {report['summary']['with_keywords']}/{report['total_pages']} | {report['summary']['with_keywords']*100//report['total_pages']}% |
| Canonical 链接 | {report['summary']['with_canonical']}/{report['total_pages']} | {report['summary']['with_canonical']*100//report['total_pages']}% |
| 结构化数据 | {report['summary']['with_structured_data']}/{report['total_pages']} | {report['summary']['with_structured_data']*100//report['total_pages']}% |
| Open Graph 标签 | {report['summary']['with_og_tags']}/{report['total_pages']} | {report['summary']['with_og_tags']*100//report['total_pages']}% |
| H1 标题 | {report['summary']['with_h1']}/{report['total_pages']} | {report['summary']['with_h1']*100//report['total_pages']}% |

## 📄 页面详情

"""
    
    for page in report['pages']:
        checks = page['seo_checks']
        passed = sum(1 for v in checks.values() if v)
        total = len(checks)
        
        status = "✅" if passed == total else "⚠️"
        
        md_report += f"""### {status} {page['filename']}

- **URL:** `{page['url']}`
- **最后修改:** {page['lastmod']}
- **SEO 检查:** {passed}/{total} 通过

"""
    
    # 添加优化建议
    md_report += """## 🔧 优化建议

### 已完成
- ✅ 生成最新 sitemap.xml
- ✅ 检查所有页面 SEO 元素
- ✅ 添加日记页面内部导航链接
- ✅ 添加面包屑导航

### 待完成（需手动）
- [ ] 提交 sitemap 到百度搜索资源平台
- [ ] 提交 sitemap 到 Bing Webmaster Tools
- [ ] 检查百度收录情况
- [ ] 检查 Bing 收录情况
- [ ] 监控关键词排名

## 🔗 搜索引擎提交

### 百度搜索资源平台
1. 访问：https://ziyuan.baidu.com/
2. 进入「资源提交」→「sitemap 提交」
3. 提交：https://shifei.world/sitemap.xml

### Bing Webmaster Tools
1. 访问：https://www.bing.com/webmasters
2. 进入「Sitemaps」
3. 提交：https://shifei.world/sitemap.xml

## 📈 收录查询

### 百度收录查询
```
site:shifei.world
```

### Bing 收录查询
```
site:shifei.world
```

---
*报告生成于 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
    
    # 保存报告
    report_path = BLOG_DIR / f'SEO_OPTIMIZATION_REPORT_{datetime.now().strftime("%Y-%m-%d")}.md'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(md_report)
    
    # 保存 JSON 报告
    json_path = BLOG_DIR / f'seo_report_{datetime.now().strftime("%Y-%m-%d")}.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"✅ 生成报告：{report_path.name}")
    return report_path

def main():
    print("=" * 60)
    print("🚀 SEO 自动优化任务")
    print("=" * 60)
    
    # 1. 生成 sitemap
    html_files = generate_sitemap()
    
    # 2. 优化页面 SEO
    print("\n🔍 检查并优化页面 SEO...")
    for filename in html_files:
        optimize_seo(filename)
    
    # 3. 添加内部链接
    print("\n🔗 添加内部链接...")
    diaries_added = 0
    for filename in html_files:
        if filename.startswith('day'):
            if add_internal_links(filename):
                diaries_added += 1
    
    print(f"✅ 为 {diaries_added} 个日记页面添加导航链接")
    
    # 4. 添加面包屑
    print("\n🍞 添加面包屑导航...")
    breadcrumbs_added = 0
    for filename in html_files:
        if filename.startswith('day'):
            if add_breadcrumb(filename):
                breadcrumbs_added += 1
    
    print(f"✅ 为 {breadcrumbs_added} 个日记页面添加面包屑")
    
    # 5. 生成报告
    report_path = generate_seo_report(html_files)
    
    print("\n" + "=" * 60)
    print("✅ SEO 优化完成！")
    print("=" * 60)
    print(f"\n📄 查看报告：{report_path}")
    print("\n下一步：")
    print("1. 提交 sitemap.xml 到百度搜索资源平台")
    print("2. 提交 sitemap.xml 到 Bing Webmaster Tools")
    print("3. 监控收录情况")

if __name__ == '__main__':
    main()
