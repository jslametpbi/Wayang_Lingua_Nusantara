// V6 intentionally avoids caching so GitHub Pages does not keep an older app version.
self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))));
