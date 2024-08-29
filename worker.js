
self.addEventListener('install', (e) => {
  console.log('installed', e)
  // 等待 skipWaiting 结束  进入 activated 状态
  e.waitUntil(self.skipWaiting());
})

self.addEventListener('fetch', (e) => {
  console.log('fetch',e)
})

self.addEventListener('activate', (e) => {
  console.log('activated', e)
  // 激活后获取控制权
  e.waitUntil(self.clients.claim());
})