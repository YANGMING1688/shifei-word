#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新所有 HTML 文件的导航栏 CSS 样式
"""

import os
import re

# 新的导航栏 CSS
NEW_NAVBAR_CSS = '''        /* ===== 导航栏 - 简洁风格（与截图一致） ===== */
        .navbar {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #ffffff;
            border-bottom: 1px solid #e5e5e5;
            position: sticky;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
        }

        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(8px);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .navbar-container {
            width: 100%;
            max-width: 1200px;
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar-left {
            display: flex;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 18px;
            font-weight: 600;
            color: #333;
            text-decoration: none;
            transition: opacity 0.2s;
        }

        .logo:hover {
            opacity: 0.8;
        }

        .logo-emoji {
            font-size: 24px;
            display: inline-block;
        }

        .navbar-right {
            display: flex;
            gap: 24px;
            align-items: center;
        }

        .nav-link {
            text-decoration: none;
            color: #666;
            font-size: 15px;
            font-weight: 500;
            position: relative;
            padding: 8px 0;
            transition: color 0.2s ease;
            white-space: nowrap;
        }

        .nav-link:hover {
            color: #0066ff;
        }

        .nav-link.active {
            color: #0066ff;
            font-weight: 600;
        }

        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: 4px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #0066ff;
        }

        /* 移动端响应式 */
        @media (max-width: 768px) {
            .navbar-container {
                padding: 12px 16px;
            }
            
            .navbar-right {
                gap: 16px;
            }
            
            .nav-link {
                font-size: 14px;
            }
            
            .logo {
                font-size: 16px;
            }
            
            .logo-emoji {
                font-size: 20px;
            }
        }'''

def update_css_in_file(filepath, filename):
    """更新文件中的导航栏 CSS"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 匹配旧的导航栏 CSS（多种模式）
    patterns = [
        r'/\* ===== 导航栏 - 固定不变 ===== \*/\s*\.navbar \{[^}]+\}[^}]+\.navbar\.scrolled \{[^}]+\}[^}]+\.navbar-container \{[^}]+\}[^}]+\.navbar-left \{[^}]+\}[^}]+\.logo \{[^}]+\}[^}]+\.logo-emoji \{[^}]+\}[^}]+\.logo:hover \.logo-emoji \{[^}]+\}[^}]+\.navbar-right \{[^}]+\}[^}]+\.nav-link \{[^}]+\}[^}]+\.nav-link::after \{[^}]+\}[^}]+\.nav-link:hover,[^}]+\.nav-link\.active \{[^}]+\}[^}]+\.nav-link\.active::after,[^}]+\.nav-link:hover::after \{[^}]+\}',
        r'/\* ===== 导航栏 - 简洁风格.*?\*/\s*\.navbar \{.*?\}',
        r'/\* ===== 导航栏.*?===== \*/\s*\.navbar \{[^}]+\}[^}]+\.navbar\.scrolled \{[^}]+\}',
    ]
    
    # 尝试匹配并替换
    for pattern in patterns:
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, NEW_NAVBAR_CSS, content, count=1, flags=re.DOTALL)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ 已更新 CSS: {filename}")
            return True
    
    # 如果没有找到导航栏 CSS，尝试在</style>前插入
    if '</style>' in content and '.navbar' not in content:
        content = content.replace('</style>', NEW_NAVBAR_CSS + '\n\n    </style>')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 已添加 CSS: {filename}")
        return True
    
    print(f"⚠️  未更新：{filename}")
    return False

def main():
    """主函数"""
    website_dir = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"
    
    html_files = [f for f in os.listdir(website_dir) if f.endswith('.html')]
    
    print(f" 更新导航栏 CSS 样式")
    print(f"================================\n")
    
    success_count = 0
    for filename in sorted(html_files):
        filepath = os.path.join(website_dir, filename)
        if update_css_in_file(filepath, filename):
            success_count += 1
    
    print(f"\n================================")
    print(f"✅ 完成！更新了 {success_count}/{len(html_files)} 个文件")

if __name__ == '__main__':
    main()
