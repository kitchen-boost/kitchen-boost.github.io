const CACHE_NAME = 'vue-cdn-pwa-cache-v1';

// Lista de archivos esenciales que deben ser cacheados
// ¡Asegúrate de incluir todos los archivos importantes, incluida la URL del CDN de Vue!
const urlsToCache = [
    '/', // La raíz de la app (GitHub Pages usa esto para index.html)
    '/index.html',
    '/styles.css',
    '/manifest.json',
    'https://unpkg.com/vue@3/dist/vue.global.js' // URL exacta del CDN de Vue
    // Incluye también tus imágenes y otros activos...
    // '/images/icon-192x192.png',
    // '/images/icon-512x512.png'
];

// Evento: Install (Instalación)
self.addEventListener('install', event => {
    // Espera hasta que el caché se abra y los archivos se añadan
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Archivos cacheados');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento: Fetch (Solicitud)
// Intercepta las solicitudes de red para servir desde el caché si es posible
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devuelve el archivo cacheados si existe
                if (response) {
                    return response;
                }
                // Si no está en caché, realiza la solicitud de red
                return fetch(event.request);
            })
    );
});

// Evento: Activate (Activación)
// Limpia cachés antiguos para ahorrar espacio
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Elimina los cachés que no están en la lista blanca
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});