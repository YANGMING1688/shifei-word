# 🔑 百度资源平台 Token 获取指南

## 快速步骤（3 分钟完成）

### 第 1 步：登录百度资源平台

**网址：** https://ziyuan.baidu.com/site/index#/

1. 使用百度账号登录
2. 如果没有账号，先注册一个

---

### 第 2 步：添加并验证网站

1. 点击 **"会员认证"** 或 **"添加网站"**
2. 输入网站地址：`https://shifei.world`
3. 选择验证方式（推荐 **HTML 标签验证**，最快）

**HTML 标签验证方法：**
```html
<!-- 复制百度提供的 meta 标签 -->
<meta name="baidu-site-verification" content="xxxxxxxxxxxxxxxx" />
```

4. 打开文件：`/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/index.html`
5. 在 `<head>` 标签内粘贴上述 meta 标签
6. 保存并提交到 GitHub
7. 等待 Vercel 自动部署（约 1 分钟）
8. 回到百度资源平台，点击 **"验证"**

---

### 第 3 步：获取 API Token

1. 验证成功后，进入网站管理后台
2. 点击左侧菜单 **"搜索服务"** → **"普通收录"**
3. 切换到 **"资源提交"** 标签
4. 选择 **"API 提交"**
5. 找到 **"token="** 后面的字符串，这就是密钥

**示例：**
```
http://data.zz.baidu.com/urls?site=shifei.world&token=abcd1234efgh5678ijkl
                                                  ↑
                                            这就是 token
```

**复制 token：** `abcd1234efgh5678ijkl`（示例，实际更长）

---

### 第 4 步：运行推送脚本

**方法 A：直接修改脚本**

1. 打开文件：`/Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog/baidu_submit.py`
2. 找到这一行：
   ```python
   BAIDU_TOKEN = "YOUR_BAIDU_TOKEN_HERE"
   ```
3. 替换为实际 token：
   ```python
   BAIDU_TOKEN = "abcd1234efgh5678ijkl"
   ```
4. 保存文件
5. 运行脚本：
   ```bash
   cd /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog
   python3 baidu_submit.py
   ```

**方法 B：使用命令行参数（推荐）**

创建新脚本 `baidu_submit_manual.py`，运行时输入 token：

```bash
python3 baidu_submit_manual.py
# 然后按提示输入 token
```

**方法 C：使用 curl 命令（最快）**

```bash
# 准备 URL 列表文件
cd /Users/yangming/.openclaw-openclaw/workspace/shifei-opc-blog
python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('sitemap.xml')
ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
for url in tree.findall('ns:url/ns:loc', ns):
    print(url.text)
" > urls.txt

# 替换 YOUR_TOKEN 为实际 token
curl -H 'Content-Type:text/plain' --data-binary @urls.txt "http://data.zz.baidu.com/urls?site=shifei.world&token=YOUR_TOKEN"
```

---

## 预期结果

**成功响应示例：**
```json
{
  "remain": 49000,      // 剩余推送配额
  "success": 12,        // 成功推送的 URL 数量
  "not_valid_url": 0,   // 无效 URL 数量
  "not_found": 0        // 未找到页面数量
}
```

**错误响应示例：**
```json
{
  "error": 401,
  "message": "token 错误"
}
```

---

## 推送配额说明

| 网站等级 | 每日配额 | 说明 |
|---------|---------|------|
| 新站 | 100-1000 条 | 验证后自动获得 |
| 普通站 | 1000-10000 条 | 根据活跃度提升 |
| 优质站 | 10000-100000 条 | 持续更新可提升 |

**提升配额方法：**
- 每天更新内容
- 保证内容质量
- 提高网站活跃度
- 获得百度搜索流量

---

## 验证推送成功

### 方法 1：百度资源平台后台

1. 访问 https://ziyuan.baidu.com/
2. 进入网站后台
3. 点击 **"搜索服务"** → **"普通收录"**
4. 查看 **"资源提交"** 记录
5. 可以看到推送时间和成功数量

### 方法 2：监控收录量

1. 访问 https://ziyuan.baidu.com/
2. 查看 **"索引量"** 数据
3. 推送后 7-15 天可见收录增长

---

## 常见问题

### Q1: token 无效怎么办？
**A:** 
- 检查是否复制完整（token 通常较长）
- 确认网站已验证通过
- 重新生成 token（后台有刷新按钮）

### Q2: 推送失败，提示 site 错误？
**A:**
- 确认 site 参数与验证的域名一致
- 检查是否带 http://或 https://（不应带）
- 正确格式：`site=shifei.world`

### Q3: 推送后多久能被收录？
**A:**
- 通常 7-15 天
- 高质量内容可能更快（3-7 天）
- 持续更新可加速收录

### Q4: 每天可以推送多少次？
**A:**
- 次数不限，但有总量限制
- 建议每天推送 1 次（新内容发布后）
- 避免短时间内大量重复推送

---

## 自动化建议

### 每日自动推送（推荐）

修改 cron 任务，每天自动推送 sitemap：

```python
# 添加到每日数据报告 cron 任务中
# 每天 9:00 执行
1. 检查 sitemap 更新
2. 推送新 URL 到百度
3. 报告推送结果
```

### 发布后自动推送

在 GitHub Actions 中配置：
```yaml
# 每次 push 后自动推送
on:
  push:
    branches: [main]

jobs:
  submit-baidu:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Submit to Baidu
        run: |
          python3 baidu_submit.py
```

---

## 联系支持

如果遇到无法解决的问题：

1. **百度资源平台帮助中心：** https://ziyuan.baidu.com/college/
2. **在线客服：** 百度资源平台后台右下角
3. **社区论坛：** https://ziyuan.baidu.com/community/

---

*文档创建时间：2026-04-06*  
*参考：傅盛 sanwan.ai SEO 优化方法*
