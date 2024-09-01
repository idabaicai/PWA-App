// 缓存路径
const urlsToCache = ["/manifest.json", "/app.js", "/index.html", "/styles/index.css", "/imgs/photo.webp"];
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
  const simpleResponse = new Response("Hello PWA");
  const options = {
    status: 200,
    header: {
      "Content-Type": "text/html",
    },
  };
  const htmlResponse = new Response("<b>HTML</b> content", options);

  // Global search on all caches in the current origin
  // caches.match(e.request.url).then((response) => {
  //   // console.log(response ? response : "It's not in the cache");
  //   console.log("response :>> ", response);
  // });

  // Cache-specific search
  // caches.open("pwa-assets").then((cache) => {
  //   cache.match(e.request.url).then((response) => {
  //     console.log(response ? response : "It's not in the cache");
  //   });
  // });

  // cache first
  // e.respondWith(
  //   caches.match(e.request)
  //     .then((cacheResponse) => {
  //       return cacheResponse || fetch(e.request)
  //     })
  // )

  // network first
  // e.respondWith(
  //   caches.match(e.request)
  //     .catch((err) => {
  //       return caches.match(e.request)
  //     })
  // )

  // stale while revalidate
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const networkFetch = fetch(e.request).then((response) => {
        // update the cache with a clone of the network response
        const responseClone = response.clone();
        caches.open(cacheName).then((cache) => {
          console.log("cache :>> ", cache);
          cache.put(e.request, responseClone);
        });
        return response;
      }).catch(reason => {
        console.log('ServiceWorker fetch failed:', reason);
      })
      // prioritize cached response over network
      return cachedResponse || networkFetch;
    })
  );
});

// 清除旧缓存
self.addEventListener("activate", async (e) => {
  console.log("activated", e);
  const keys = await caches.keys();
  keys.forEach((key) => {
    if (key !== cacheName) {
      caches.delete(key);
    }
  });
  // 激活后获取控制权
  await self.clients.claim();
});
