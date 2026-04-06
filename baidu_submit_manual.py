#!/usr/bin/env python3
"""
百度搜索资源平台 - URL 主动推送工具（交互式）
学习傅盛 sanwan.ai 优化方法，主动推送 sitemap 到百度

使用方法：
    python3 baidu_submit_manual.py
"""

import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from pathlib import Path

# 配置
SITE = "shifei.world"
SITEMAP_FILE = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/sitemap.xml"

def parse_sitemap(sitemap_path):
    """解析 sitemap.xml，提取所有 URL"""
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    
    # 处理带命名空间的 XML
    ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = []
    
    for url in root.findall('ns:url/ns:loc', ns):
        urls.append(url.text)
    
    return urls

def submit_baidu(urls, token):
    """使用百度 API 主动推送 URL"""
    api_url = f"http://data.zz.baidu.com/urls?site={SITE}&token={token}"
    
    # 百度要求每行一个 URL 的纯文本格式
    data = "\n".join(urls).encode('utf-8')
    
    req = urllib.request.Request(
        api_url,
        data=data,
        headers={"Content-Type": "text/plain"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            return response.status, result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            error_json = json.loads(error_body)
            return e.code, error_json
        except:
            return e.code, {"error": error_body}
    except Exception as e:
        return None, {"error": str(e)}

def get_token_interactive():
    """交互式获取 token"""
    print("\n📝 请输入百度资源平台 API token")
    print("获取方法：")
    print("1. 访问 https://ziyuan.baidu.com/site/index#/")
    print("2. 添加并验证网站：shifei.world")
    print("3. 进入 搜索服务 → 普通收录 → 资源提交 → API 提交")
    print("4. 复制 token= 后面的字符串\n")
    
    while True:
        token = input("Token: ").strip()
        if len(token) >= 10:  # token 通常较长
            confirm = input(f"确认使用此 token? (y/n): {token[:10]}... ").strip().lower()
            if confirm == 'y':
                return token
        else:
            print("❌ token 长度过短，请检查是否复制完整\n")

def main():
    print("="*60)
    print("🦞 百度搜索资源平台 - URL 主动推送工具")
    print("学习傅盛 sanwan.ai 优化方法")
    print("="*60)
    
    # 交互式获取 token
    token = get_token_interactive()
    
    # 解析 sitemap
    print("\n📄 解析 sitemap.xml...")
    urls = parse_sitemap(SITEMAP_FILE)
    print(f"✅ 找到 {len(urls)} 个 URL")
    
    # 显示 URL 列表
    print("\n准备推送的 URL:")
    for i, url in enumerate(urls, 1):
        print(f"  {i}. {url}")
    
    # 确认推送
    print(f"\n🚀 准备提交 {len(urls)} 个 URL 到百度搜索资源平台")
    print(f"目标域名：{SITE}")
    print(f"API: http://data.zz.baidu.com/urls")
    
    confirm = input("\n确认推送？(y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ 已取消推送")
        return
    
    # 执行推送
    print("\n正在推送...")
    status_code, result = submit_baidu(urls, token)
    
    # 显示结果
    print("\n" + "="*60)
    print("📊 推送结果:")
    print(f"   HTTP 状态码：{status_code}")
    
    if status_code == 200:
        print(f"   ✅ 推送成功！")
        print(f"   成功推送：{result.get('success', len(urls))} 条")
        print(f"   剩余配额：{result.get('remain', 'N/A')}")
        if result.get('not_valid_url', 0) > 0:
            print(f"   ⚠️  无效 URL: {result.get('not_valid_url')} 条")
        if result.get('not_found', 0) > 0:
            print(f"   ⚠️  未找到页面：{result.get('not_found')} 条")
    else:
        print(f"   ❌ 推送失败")
        print(f"   错误信息：{json.dumps(result, ensure_ascii=False, indent=2)}")
        print("\n💡 提示：")
        print("   - 检查 token 是否正确")
        print("   - 确认网站已在百度资源平台验证")
        print("   - 访问 https://ziyuan.baidu.com/ 查看详细信息")
    
    print("="*60)
    print("\n📋 下一步操作：")
    print("1. 访问 https://ziyuan.baidu.com/ 查看收录状态")
    print("2. 等待 7-15 天查看百度收录结果")
    print("3. 查看 百度 Token 获取指南.md 了解更多")
    print("="*60)

if __name__ == "__main__":
    main()
