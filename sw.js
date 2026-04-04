// Service Worker for OPC 一人公司
// 提供离线缓存和快速加载

const CACHE_NAME = 'opc-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/articles.html',
  '/skills.html',
  '/founder.html',
  '/company.html',
  '/timeline.html',
  '/day1.html',
  '/day2.html',
  '/day3.html',
  '/week1-review.html'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存命中，返回缓存
        if (response) {
          return response;
        }
        // 缓存未命中，从网络获取
        return fetch(event.request).then(
          response => {
            // 不缓存非成功响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // 克隆响应
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
