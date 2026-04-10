#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
在所有 HTML 页面的</head>标签前添加导航栏 JavaScript
"""

import os
import re

# 导航栏 JavaScript
NAVBAR_JS = '''    <!-- 导航栏激活脚本 -->
    <script src="components/navbar.js"></script>
'''

def add_js_to_file(filepath, filename):
    """在文件的</head>标签前添加 JavaScript"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找</head>标签
    if '</head>' in content:
        # 在</head>前添加 JavaScript
        content = content.replace('</head>', NAVBAR_JS + '    </head>')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 已添加 JS: {filename}")
        return True
    else:
        print(f"⚠️  未找到</head>: {filename}")
        return False

def main():
    """主函数"""
    website_dir = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
    
    # 获取所有 HTML 文件
    html_files = [f for f in os.listdir(website_dir) if f.endswith('.html')]
    
    print(f"🦞 添加导航栏 JavaScript")
    print(f"================================\n")
    
    success_count = 0
    for filename in sorted(html_files):
        filepath = os.path.join(website_dir, filename)
        if add_js_to_file(filepath, filename):
            success_count += 1
    
    print(f"\n================================")
    print(f"✅ 完成！处理了 {success_count}/{len(html_files)} 个文件")

if __name__ == '__main__':
    main()
