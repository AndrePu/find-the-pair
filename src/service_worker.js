const version = 1;
const CACHE_NAME = `offline-exp-${version}`;

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  try {
    const responseFromNetwork = await fetch(request);
    return responseFromNetwork;
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(
    enableNavigationPreload()
      .then(() => {
        return caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(name => {
              if (name !== CACHE_NAME) {
                return caches.delete(name);
              }
            })
          );
        });
      }));
});

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const toCache = [
      '/main.js'
    ];

    for (let i = 1; i <= 20; i++) {
      toCache.push(`/assets/images/${i}.jpg`);
    }

    await addResourcesToCache(toCache);
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse
    })
  );
});
