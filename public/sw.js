const CACHE_NAME = "himawari-v1";
const HIMAWARI_PREFIX =
  "https://www.data.jma.go.jp/mscweb/data/himawari/img/r2w/";

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (!url.startsWith(HIMAWARI_PREFIX)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);

      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      // stale-while-revalidate
      return cached || fetchPromise;
    })
  );
});
