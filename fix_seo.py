#!/usr/bin/env python3
"""
批量修复 SEO 问题 - 学习傅盛 sanwan.ai 优化方法
1. 添加缺失的 meta description
2. 添加缺失的 canonical 标签
"""

import os
import re

BLOG_DIR = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"

# 需要修复的文件和对应的 meta description
FILES_TO_FIX = {
    "404.html": {
        "description": "页面未找到 - OPC 一人公司网站，探索 AI 赋能的一人公司创业模式。",
        "canonical": "https://shifei.world/404.html"
    },
    "status.html": {
        "description": "网站实时状态监控 - OPC 一人公司网站运行状态、流量数据、服务可用性。",
        "canonical": "https://shifei.world/status.html"
    }
}

def fix_html_file(filename, meta_info):
    """修复单个 HTML 文件的 SEO 标签"""
    filepath = os.path.join(BLOG_DIR, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有 meta description
    if 'meta name="description"' not in content:
        # 在 </head> 前插入 meta description
        meta_tag = f'    <meta name="description" content="{meta_info["description"]}">\n'
        content = content.replace('</head>', meta_tag + '    </head>')
        print(f"✓ {filename}: 添加 meta description")
    
    # 检查是否已有 canonical
    if 'link rel="canonical"' not in content:
        # 在 </head> 前插入 canonical
        canonical_tag = f'    <link rel="canonical" href="{meta_info["canonical"]}">\n'
        content = content.replace('</head>', canonical_tag + '    </head>')
        print(f"✓ {filename}: 添加 canonical 标签")
    
    # 写回文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print("🦞 开始 SEO 批量修复（学习傅盛优化方法）\n")
    
    for filename, meta_info in FILES_TO_FIX.items():
        fix_html_file(filename, meta_info)
    
    print("\n✅ SEO 修复完成！")
    print("\n已修复：")
    print("  - 404.html: meta description + canonical")
    print("  - status.html: meta description + canonical")

if __name__ == "__main__":
    main()
