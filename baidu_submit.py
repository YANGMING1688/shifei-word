#!/usr/bin/env python3
"""
百度搜索资源平台 - URL 主动推送工具
学习傅盛 sanwan.ai 优化方法，主动推送 sitemap 到百度
"""

import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from pathlib import Path

# 配置
SITE = "shifei.world"
SITEMAP_FILE = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/sitemap.xml"

# ⚠️ 注意：需要在百度资源平台获取 token
# 访问：https://ziyuan.baidu.com/site/index#/ 添加网站并验证
# 然后在 资源提交 → API 提交 中获取 token
BAIDU_TOKEN = "YOUR_BAIDU_TOKEN_HERE"  # 替换为实际 token

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

def main():
    print("🦞 百度搜索资源平台 - URL 主动推送工具\n")
    
    # 检查 token 是否配置
    if BAIDU_TOKEN == "YOUR_BAIDU_TOKEN_HERE":
        print("⚠️  请先配置百度 token！\n")
        print("获取步骤：")
        print("1. 访问 https://ziyuan.baidu.com/site/index#/")
        print("2. 添加并验证网站：shifei.world")
        print("3. 进入 资源提交 → API 提交")
        print("4. 复制 token 并替换脚本中的 YOUR_BAIDU_TOKEN_HERE")
        print("\n💡 提示：根据之前的记录，百度统计 ID 已配置")
        print("   百度统计代码：6480dfc181628f347848ca1aa482fa9c")
        print("   可能百度资源平台也已验证，请检查相关文档\n")
        return
    
    # 解析 sitemap
    print("📄 解析 sitemap.xml...")
    urls = parse_sitemap(SITEMAP_FILE)
    print(f"✅ 找到 {len(urls)} 个 URL\n")
    
    # 提交到百度
    print(f"🚀 提交 {len(urls)} 个 URL 到百度搜索资源平台...")
    print(f"目标域名：{SITE}")
    print(f"API: http://data.zz.baidu.com/urls\n")
    
    status_code, result = submit_baidu(urls, BAIDU_TOKEN)
    
    print(f"📊 提交结果:")
    print(f"   HTTP 状态码：{status_code}")
    
    if status_code == 200:
        print(f"   ✅ 提交成功！")
        print(f"   剩余配额：{result.get('remain', 'N/A')}")
        print(f"   成功推送：{result.get('success', len(urls))} 条")
    else:
        print(f"   ❌ 提交失败")
        print(f"   错误信息：{json.dumps(result, ensure_ascii=False, indent=2)}")
    
    print("\n" + "="*60)
    print("📋 下一步操作：")
    print("1. 访问 https://ziyuan.baidu.com/ 查看收录状态")
    print("2. 等待 7-15 天查看百度收录结果")
    print("3. 每日 cron 任务会自动推送新 URL")
    print("="*60)

if __name__ == "__main__":
    main()
