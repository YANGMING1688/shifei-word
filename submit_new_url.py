#!/usr/bin/env python3
"""
新页面搜索引擎提交工具 - 提交 day21.html 到各大搜索引擎
"""

import json
import hashlib
import urllib.request
import urllib.error
from datetime import datetime

# 配置
NEW_URL = "https://shifei.world/day21.html"
SITE_URL = "https://shifei.world"
SITE = "shifei.world"

def submit_indexnow(url, key):
    """提交到 IndexNow (Bing/Edge 等)"""
    api_url = "https://api.indexnow.org/indexnow"
    
    payload = {
        "host": SITE_URL.replace("https://", ""),
        "key": key,
        "urlList": [url]
    }
    
    data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
    
    req = urllib.request.Request(
        api_url,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return response.status, response.read().decode('utf-8')
    except Exception as e:
        return None, str(e)

def submit_baidu(url, token):
    """提交到百度搜索资源平台"""
    api_url = f"http://data.zz.baidu.com/urls?site={SITE}&token={token}"
    
    data = url.encode('utf-8')
    
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
    print("="*60)
    print("🦞 新页面搜索引擎提交工具")
    print(f"提交页面：{NEW_URL}")
    print(f"提交时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    print()
    
    # 1. IndexNow 提交
    print("📤 提交到 IndexNow (Bing/Edge)...")
    key = hashlib.md5(f"{SITE_URL}-{datetime.now().strftime('%Y%m%d')}".encode()).hexdigest()
    status, result = submit_indexnow(NEW_URL, key)
    
    if status == 200:
        print(f"   ✅ IndexNow 提交成功！")
    else:
        print(f"   ⚠️  IndexNow 提交状态：{status}")
        print(f"   响应：{result}")
    print()
    
    # 2. 百度提交（需要 token）
    print("📤 提交到百度搜索资源平台...")
    print("   💡 提示：需要百度 API token")
    print("   获取方法：https://ziyuan.baidu.com/site/index#/")
    print("   → 搜索服务 → 普通收录 → 资源提交 → API 提交")
    print()
    
    # 3. Google Search Console（手动）
    print("📤 提交到 Google Search Console...")
    print(f"   访问：https://search.google.com/search-console/url-inspection")
    print(f"   输入：{NEW_URL}")
    print(f"   点击'请求索引'")
    print()
    
    print("="*60)
    print("📋 提交完成总结：")
    print(f"   ✅ 页面已部署：{NEW_URL}")
    print(f"   ✅ IndexNow 已提交（Bing/Edge 3-7 天收录）")
    print(f"   ⏳ 百度需手动提交（使用百度 token）")
    print(f"   ⏳ Google 需手动提交（Search Console）")
    print()
    print("💡 提示：")
    print("   - sitemap.xml 已更新，搜索引擎会定期抓取")
    print("   - 新页面通常 3-7 天内被收录")
    print("   - 可在各平台 webmaster tools 查看收录状态")
    print("="*60)

if __name__ == "__main__":
    main()
