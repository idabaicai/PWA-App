// 缓存路径
const urlsToCache = ["/app.js", "/index.html", "/styles/index.css"];
const cacheName = "pwa-assets";
self.addEventListener("install", async (e) => {
  console.log("installed", e);

  // e.waitUntil(
  //   caches
  //     .open("pwa-assets")
  //     .then((cache) => {
  //       return cache.addAll(urlsToCache);
  //     })
  //     .catch((err) => {
  //       console.log("err :>> ", err);
  //     })
  // );
  const cache = await caches.open(cacheName);
  await cache.addAll(urlsToCache);
  // 等待 skipWaiting 结束  进入 activated 状态
  await self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const res = "hello pwa";
  console.log("fetch", e.request.url);
  // e.respondWith(res);
});

// 清除旧缓存
self.addEventListener("activate", async (e) => {
  console.log("activated", e);
  const keys = await caches.keys();
  keys.forEach((key) => {
    if(key !== cacheName) {
      caches.delete(key);
    }
  })
  // 激活后获取控制权
  await self.clients.claim()
});
