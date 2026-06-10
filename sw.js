const CACHE_NAME = 'wayang-lingua-nusantara-v2';
const ASSETS = [
  './', './index.html', './styles.css', './app.js', './manifest.json',
  './assets/logo-mark.png', './assets/logo-wide.png', './assets/design-dark.png', './assets/design-concept.png',
  './assets/stage-hero.png', './assets/light-hero.png', './assets/concept-features.png', './assets/module-sample.png', './assets/dashboard-sample.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
