#!/usr/bin/env python3
"""
IndexNow 批量提交工具 - 学习傅盛 sanwan.ai 优化方法
自动提交 sitemap 中的所有 URL 到 Bing 搜索引擎
"""

import json
import hashlib
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from pathlib import Path

# 配置
SITE_URL = "https://shifei.world"
SITEMAP_FILE = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/sitemap.xml"
OUTPUT_DIR = "/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog"

def generate_key():
    """生成 IndexNow 密钥（32 位十六进制字符串）"""
    key = hashlib.md5(f"{SITE_URL}-{Path(SITEMAP_FILE).stat().st_mtime}".encode()).hexdigest()
    return key

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

def submit_indexnow(urls, key):
    """使用 IndexNow 协议批量提交 URL"""
    api_url = "https://api.indexnow.org/indexnow"
    
    payload = {
        "host": SITE_URL.replace("https://", ""),
        "key": key,
        "urlList": urls
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
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return None, str(e)

def main():
    print("🦞 IndexNow 批量提交工具 - 学习傅盛优化方法\n")
    
    # 1. 生成密钥
    key = generate_key()
    print(f"📝 生成密钥：{key}")
    
    # 2. 创建密钥文件（需要上传到网站根目录）
    key_file_path = Path(OUTPUT_DIR) / f"{key}.txt"
    with open(key_file_path, 'w', encoding='utf-8') as f:
        f.write(key)
    print(f"✅ 密钥文件已创建：{key_file_path.name}")
    print(f"⚠️  请将此文件上传到网站根目录：https://{SITE_URL.replace('https://', '')}/{key}.txt\n")
    
    # 3. 解析 sitemap
    print("📄 解析 sitemap.xml...")
    urls = parse_sitemap(SITEMAP_FILE)
    print(f"✅ 找到 {len(urls)} 个 URL\n")
    
    # 4. 提交到 IndexNow
    print(f"🚀 提交 {len(urls)} 个 URL 到 IndexNow...")
    print(f"目标域名：{SITE_URL}")
    print(f"API: https://api.indexnow.org/indexnow\n")
    
    status_code, response_text = submit_indexnow(urls, key)
    
    if status_code:
        print(f"📊 提交结果:")
        print(f"   HTTP 状态码：{status_code}")
        if status_code == 200:
            print(f"   ✅ 提交成功！")
        else:
            print(f"   ⚠️  响应内容：{response_text}")
    else:
        print(f"❌ 提交失败：{response_text}")
    
    print("\n" + "="*60)
    print("📋 下一步操作：")
    print(f"1. 将 {key}.txt 文件上传到网站根目录")
    print("2. 访问 https://www.bing.com/webmasters 验证收录状态")
    print("3. 等待 3-7 天查看 Bing 收录结果")
    print("="*60)

if __name__ == "__main__":
    main()
