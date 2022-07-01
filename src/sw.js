const PREFIX = 'BETA-2.1.1';


self.addEventListener('install', () => {
    self.skipWaiting();
    console.log(`${PREFIX} Install`);
})

self.addEventListener('activated', () => {
    clients.claim();
    console.log(`${PREFIX} Activated`);
})

self.addEventListener('fetch', event => {
    console.log(`${PREFIX} Fetching : ${event.request.url}, Mode : ${event.request.mode}`);
})
