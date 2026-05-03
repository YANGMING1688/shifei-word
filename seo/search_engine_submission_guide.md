# 搜索引擎提交指南

## 📋 已完成优化

### 1. Sitemap.xml 生成 ✅
- **位置**: `/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/sitemap.xml`
- **URL 数量**: 26 个页面
- **最后更新**: 2026-05-03

### 2. 页面 SEO 优化 ✅
- **Title 标签**: 26/26 页面完整 (100%)
- **Meta Description**: 26/26 页面完整 (100%)
- **Keywords**: 26/26 页面完整 (100%)
- **Canonical URL**: 26/26 页面完整 (100%)
- **Open Graph**: 25/26 页面完整 (96.2%)
- **结构化数据**: 25/26 页面完整 (96.2%)

### 3. 内部链接优化 ✅
- **面包屑导航**: 已为 day25.html、day26.html 添加
- **上一篇/下一篇**: 已为 day21.html、day25.html、day26.html 添加

---

## 🔗 搜索引擎提交

### 百度搜索资源平台

**提交入口**: https://ziyuan.baidu.com/site/index

**步骤**:
1. 登录百度搜索资源平台
2. 选择网站 `shifei.world`
3. 进入「链接提交」→「sitemap」
4. 输入 sitemap 地址：`https://shifei.world/sitemap.xml`
5. 点击提交

**API 主动推送** (可选):
```bash
# 使用 curl 推送 sitemap 中的 URL
curl -H 'Content-Type:text/plain' --data-binary @urls.txt "http://data.zz.baidu.com/urls?site=shifei.world&token=YOUR_TOKEN"
```

**获取 Token**:
1. 百度搜索资源平台 → 工具 → 普通收录 → API 提交
2. 复制接口调用地址中的 token

---

### Bing Webmaster Tools

**提交入口**: https://www.bing.com/webmasters

**步骤**:
1. 登录 Bing Webmaster Tools
2. 选择网站 `shifei.world`
3. 进入「Sitemaps」
4. 点击「Submit a Sitemap」
5. 输入：`https://shifei.world/sitemap.xml`
6. 点击提交

**IndexNow API** (自动推送):
```bash
# 生成 URL 列表
find . -name "*.html" ! -name "day-template.html" ! -name "404.html" | \
  sed 's|^\./|https://shifei.world/|' | sed 's|/index.html|/|' > urls.txt

# 提交到 IndexNow
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "shifei.world",
    "key": "YOUR_INDEXNOW_KEY",
    "keyLocation": "https://shifei.world/YOUR_INDEXNOW_KEY.txt",
    "urlList": ["https://shifei.world/", "https://shifei.world/day26.html", ...]
  }'
```

**获取 IndexNow Key**:
1. 访问 https://www.indexnow.org/
2. 生成 API Key
3. 将 key 文件上传到网站根目录

---

### Google Search Console

**提交入口**: https://search.google.com/search-console

**步骤**:
1. 登录 Google Search Console
2. 选择网站 `shifei.world`
3. 进入「Sitemaps」
4. 输入：`sitemap.xml`
5. 点击提交

---

## 📊 收录监控

### 百度搜索
- 查询命令：`site:shifei.world`
- 资源平台：https://ziyuan.baidu.com/site/index

### Bing 搜索
- 查询命令：`site:shifei.world`
- Webmaster: https://www.bing.com/webmasters

### Google 搜索
- 查询命令：`site:shifei.world`
- Search Console: https://search.google.com/search-console

---

## ⚡ 自动推送脚本

创建 `submit_to_search_engines.sh`:

```bash
#!/bin/bash

# 生成 URL 列表
cd /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog
find . -name "*.html" ! -name "day-template.html" ! -name "404.html" | \
  sed 's|^\./|https://shifei.world/|' | \
  sed 's|/index.html|/|' | \
  sort > urls.txt

echo "已生成 $(wc -l < urls.txt) 个 URL"

# 百度推送 (需要替换 token)
# BAIDU_TOKEN="your_baidu_token"
# curl -H 'Content-Type:text/plain' --data-binary @urls.txt \
#   "http://data.zz.baidu.com/urls?site=shifei.world&token=$BAIDU_TOKEN"

echo "✅ URL 列表已生成，请手动提交到各搜索引擎"
```

---

## 📈 后续优化建议

1. **定期更新**: 每次发布新日记后重新生成 sitemap 并提交
2. **监控收录**: 每周检查各搜索引擎收录情况
3. **外链建设**: 在社交媒体分享文章，增加外部链接
4. **性能优化**: 启用 CDN、图片压缩、缓存策略
5. **移动友好**: 确保所有页面在移动端显示正常

---

*生成时间：2026-05-03*
