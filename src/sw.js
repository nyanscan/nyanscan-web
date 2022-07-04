const BASE = location.protocol + '//' + location.host;
const PREFIX = 'BETA-3.2.1';

const CACHE_FILES = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css',
    `${BASE}/res/icons/ico.ico`,
    `${BASE}/res/icons/192.png`,
    `${BASE}/res/icons/512.png`,
    `${BASE}/css/var.css`,
    `${BASE}/css/nyanscan.css`,
    `${BASE}/js/utils/custom_elements.js`,
    `${BASE}/js/utils/utils.js`,
    `${BASE}/js/index.js`,
    `${BASE}/pages/user.js`,
    `${BASE}/pages/reading/project.js`,
    `${BASE}/pages/reading/reader.js`,
    `${BASE}/pages/information/cgu.js`
];

const LAZY_CACHE = [
    `${BASE}/api/v1/u/me`
];

self.addEventListener('install', evt => {
    self.skipWaiting();
    evt.waitUntil((async () => {
        const cache = await caches.open(PREFIX);
        await cache.addAll(CACHE_FILES);
    })());
    console.log(`${PREFIX} Install`);
});

self.addEventListener('activate', evt => {
    clients.claim();
    evt.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.map(k => {
                if (k !== PREFIX) return caches.delete(k);
            })
        );
    })());
    console.log(`${PREFIX} Activated`);
});

self.addEventListener('fetch', evt => {
    const short_uri = evt.request.url.split(/\?/, 1)[0];
    if (CACHE_FILES.includes(short_uri)) {
        evt.respondWith(caches.match(short_uri));
    }
});
