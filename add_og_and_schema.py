#!/usr/bin/env python3
"""
为页面添加 Open Graph 标签和结构化数据
"""

import re
from pathlib import Path
from datetime import datetime

BLOG_DIR = Path("/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog")
BASE_URL = "https://shifei.world"

# 页面数据
PAGE_DATA = {
    "index.html": {
        "title": "OPC 一人公司 - AI 龙虾蟹养成日记",
        "description": "OPC 一人公司创业实验，养了只 AI 龙虾蟹。记录一人公司的创业历程，分享 AI 赋能、效率工具、创业心得。",
        "type": "WebSite",
        "image": "/og-image.png"
    },
    "about.html": {
        "title": "关于 - OPC 一人公司",
        "description": "了解 OPC 一人公司项目，AI 龙虾蟹养成计划，以及行上科技的使命。",
        "type": "AboutPage",
        "image": "/og-image.png"
    },
    "articles.html": {
        "title": "所有文章 - OPC 一人公司",
        "description": "OPC 一人公司所有文章汇总，包含创业日记、AI 优化实验、效率工具分享等内容。",
        "type": "CollectionPage",
        "image": "/og-image.png"
    },
    "company.html": {
        "title": "公司 - 行上科技",
        "description": "行上科技公司介绍，专注于 AI 工具和效率提升。",
        "type": "Organization",
        "image": "/og-image.png"
    },
    "founder.html": {
        "title": "创始人 - 世飞 OPC",
        "description": "世飞 OPC 的创业故事，从大厂到一人公司的转变历程。",
        "type": "Person",
        "image": "/og-image.png"
    },
    "skills.html": {
        "title": "技能 - OPC 一人公司",
        "description": "OPC 一人公司使用的技能栈，包括 AI 工具、效率方法等。",
        "type": "TechArticle",
        "image": "/og-image.png"
    },
    "timeline.html": {
        "title": "时间线 - OPC 一人公司创业历程",
        "description": "OPC 一人公司创业时间线，记录重要里程碑。",
        "type": "Timeline",
        "image": "/og-image.png"
    },
    "404.html": {
        "title": "页面未找到 - OPC 一人公司",
        "description": "抱歉，您访问的页面不存在。",
        "type": "WebPage",
        "image": "/og-image.png"
    },
    "status.html": {
        "title": "状态 - OPC 一人公司",
        "description": "OPC 一人公司当前状态更新。",
        "type": "WebPage",
        "image": "/og-image.png"
    },
    "inspiring-article.html": {
        "title": "励志文章 - OPC 一人公司",
        "description": "激励人心的创业文章，保持前行的动力。",
        "type": "Article",
        "image": "/og-image.png"
    },
    "cross-border-ecommerce.html": {
        "title": "跨境电商 - OPC 一人公司",
        "description": "跨境电商相关内容，出海机会与挑战。",
        "type": "Article",
        "image": "/og-image.png"
    },
    "week1-review.html": {
        "title": "第一周复盘 - OPC 一人公司",
        "description": "OPC 一人公司第一周创业复盘，经验总结。",
        "type": "Article",
        "image": "/og-image.png"
    }
}

# 日记页面数据
DIARY_DATA = {
    "day1.html": {"title": "Day 1 - 从今天起，我是一名一人公司创业者", "date": "2026-04-04"},
    "day2.html": {"title": "Day 2 - 注册公司流程", "date": "2026-04-05"},
    "day3.html": {"title": "Day 3 - 搭建网站", "date": "2026-04-06"},
    "day5.html": {"title": "Day 5 - 第一篇文章发布", "date": "2026-04-08"},
    "day10.html": {"title": "Day 10 - 第一次数据分析", "date": "2026-04-13"},
    "day12.html": {"title": "Day 12 - 优化用户体验", "date": "2026-04-15"},
    "day15.html": {"title": "Day 15 - 持续迭代", "date": "2026-04-18"},
    "ai-experiment.html": {"title": "AI 优化实验 - OPC 一人公司", "date": "2026-04-06"},
}

def add_og_tags(html_file, data):
    """添加 Open Graph 标签"""
    content = html_file.read_text(encoding="utf-8")
    
    # 检查是否已有 OG 标签
    if 'property="og:title"' in content:
        return False
    
    # 找到 </head> 位置
    head_end = content.find("</head>")
    if head_end == -1:
        return False
    
    # 生成 OG 标签
    og_tags = f'''
    <!-- Open Graph / 社交媒体分享 -->
    <meta property="og:type" content="{data.get('type', 'WebPage')}">
    <meta property="og:url" content="{BASE_URL}/{html_file.name}">
    <meta property="og:title" content="{data['title']}">
    <meta property="og:description" content="{data['description']}">
    <meta property="og:image" content="{BASE_URL}{data.get('image', '/og-image.png')}">
    <meta property="og:site_name" content="OPC 一人公司">
    
    <!-- Twitter 卡片 -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{BASE_URL}/{html_file.name}">
    <meta name="twitter:title" content="{data['title']}">
    <meta name="twitter:description" content="{data['description']}">
    <meta name="twitter:image" content="{BASE_URL}{data.get('image', '/og-image.png')}">
'''
    
    # 插入到 </head> 之前
    content = content[:head_end] + og_tags + "\n" + content[head_end:]
    html_file.write_text(content, encoding="utf-8")
    return True

def add_schema_org(html_file, data, is_diary=False):
    """添加 Schema.org 结构化数据"""
    content = html_file.read_text(encoding="utf-8")
    
    # 检查是否已有结构化数据
    if '"@type"' in content:
        return False
    
    # 找到 </head> 位置
    head_end = content.find("</head>")
    if head_end == -1:
        return False
    
    # 获取文件修改时间
    mtime = datetime.fromtimestamp(html_file.stat().st_mtime)
    published = data.get("date", mtime.strftime("%Y-%m-%d"))
    modified = mtime.strftime("%Y-%m-%d")
    
    # 生成结构化数据
    if is_diary:
        schema = f'''
    <!-- 结构化数据 Schema.org Article -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{data['title']}",
      "description": "{data['description']}",
      "author": {{
        "@type": "Person",
        "name": "世飞 OPC",
        "url": "{BASE_URL}/founder.html"
      }},
      "publisher": {{
        "@type": "Organization",
        "name": "行上科技",
        "logo": {{
          "@type": "ImageObject",
          "url": "{BASE_URL}/logo.png"
        }}
      }},
      "datePublished": "{published}",
      "dateModified": "{modified}",
      "mainEntityOfPage": {{
        "@type": "WebPage",
        "@id": "{BASE_URL}/{html_file.name}"
      }}
    }}
    </script>
'''
    else:
        schema = f'''
    <!-- 结构化数据 Schema.org -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "{data.get('type', 'WebPage')}",
      "name": "{data['title']}",
      "description": "{data['description']}",
      "url": "{BASE_URL}/{html_file.name}",
      "author": {{
        "@type": "Person",
        "name": "世飞 OPC",
        "url": "{BASE_URL}/founder.html"
      }},
      "publisher": {{
        "@type": "Organization",
        "name": "行上科技",
        "logo": {{
          "@type": "ImageObject",
          "url": "{BASE_URL}/logo.png"
        }}
      }},
      "dateModified": "{modified}"
    }}
    </script>
'''
    
    # 插入到 </head> 之前
    content = content[:head_end] + schema + "\n" + content[head_end:]
    html_file.write_text(content, encoding="utf-8")
    return True

def add_canonical(html_file):
    """添加 canonical 标签"""
    content = html_file.read_text(encoding="utf-8")
    
    # 检查是否已有 canonical
    if 'rel="canonical"' in content:
        return False
    
    # 找到 <head> 位置
    head_start = content.find("<head>")
    if head_start == -1:
        return False
    
    # 生成 canonical 标签
    canonical = f'\n    <link rel="canonical" href="{BASE_URL}/{html_file.name}">'
    
    # 插入到 <head> 之后
    insert_pos = content.find(">", head_start) + 1
    content = content[:insert_pos] + canonical + content[insert_pos:]
    html_file.write_text(content, encoding="utf-8")
    return True

def main():
    """主函数"""
    print("=" * 60)
    print("添加 Open Graph 标签和结构化数据")
    print("=" * 60)
    
    # 处理普通页面
    print("\n📄 处理普通页面...")
    for filename, data in PAGE_DATA.items():
        html_file = BLOG_DIR / filename
        if not html_file.exists():
            print(f"  ⚠️ {filename} 不存在")
            continue
        
        og_added = add_og_tags(html_file, data)
        schema_added = add_schema_org(html_file, data)
        canonical_added = add_canonical(html_file)
        
        status = []
        if og_added:
            status.append("✅ OG")
        if schema_added:
            status.append("✅ Schema")
        if canonical_added:
            status.append("✅ Canonical")
        
        if status:
            print(f"  {', '.join(status)} {filename}")
        else:
            print(f"  ✓ 已完成 {filename}")
    
    # 处理日记页面
    print("\n📔 处理日记页面...")
    for filename, data in DIARY_DATA.items():
        html_file = BLOG_DIR / filename
        if not html_file.exists():
            print(f"  ⚠️ {filename} 不存在")
            continue
        
        # 尝试从现有内容中提取 description
        content = html_file.read_text(encoding="utf-8")
        desc_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', content)
        description = desc_match.group(1) if desc_match else data['title']
        
        diary_data = {
            "title": data["title"],
            "description": description,
            "date": data["date"],
            "type": "Article",
            "image": "/og-image.png"
        }
        
        og_added = add_og_tags(html_file, diary_data)
        canonical_added = add_canonical(html_file)
        
        # 日记页面可能已有结构化数据
        schema_added = add_schema_org(html_file, diary_data, is_diary=True)
        
        status = []
        if og_added:
            status.append("✅ OG")
        if schema_added:
            status.append("✅ Schema")
        if canonical_added:
            status.append("✅ Canonical")
        
        if status:
            print(f"  {', '.join(status)} {filename}")
        else:
            print(f"  ✓ 已完成 {filename}")
    
    print("\n✅ 所有页面优化完成！")

if __name__ == "__main__":
    main()
