const CACHE_NAME = "tes-pro-v1";

const ASSETS = [
    "./",
    "./index.html",
    "./css/style.css",
    "./css/mobile.css",
    "./js/app.js",
    "./js/calculator.js",
    "./manifest.json",
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
    "https://fonts.googleapis.com/icon?family=Material+Icons+Round"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME).then(cache => {

            return cache.addAll(ASSETS);

        })

    );

    self.skipWaiting();

});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request).then(response => {

            if (response) {

                return response;

            }

            return fetch(event.request)
                .then(networkResponse => {

                    if (
                        !networkResponse ||
                        networkResponse.status !== 200 ||
                        networkResponse.type !== "basic"
                    ) {
                        return networkResponse;
                    }

                    const responseClone = networkResponse.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });

                    return networkResponse;

                })
                .catch(() => caches.match("./index.html"));

        })

    );

});
