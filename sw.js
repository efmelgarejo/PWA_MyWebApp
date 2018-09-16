;
const CACHE_NAME = "v1_cahe_fortunato_app",
    urlsToCache = [
        "./",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "./css/materialize.css",
        "./css/style.css",
        "./images/icons/icon_256.png",
        "./images/favicon.png",
    ]


 // En la fase de instalacion almacena los recursos en cache
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .then( () => self.skipWaiting() )
            })
            .catch( err => console.log("Falló registro de cahe", err) )
    )
})

// Una vez que se instala el SW,se activa y busca los recursos para que funcione sin conexion
self.addEventListener("activate", e => {
   const cacheWhiteList = [CACHE_NAME]
   
   e.waitUntil(
      caches.keys()
         .then(cacheNames => {
            return Promise.all(
               cacheNames.map(cacheName => {
                  //Eliminamos lo que ya no se necesita en cache
                  if(cacheWhiteList.indexOf(cacheName)=== -1){
                     return caches.delete(cacheName)
                  }
               })
            )
         })
         // Le indica al SW activar el cache actual
         .then( () => self.clients.claim() )
   )
})

// Cuando el navegador recupera una url
self.addEventListener("fetch", e => {
   e.respondWith(
      caches.match( e.request )
         .then( res => {
            if(res){
               // Recupera del cache
               return res
            }
            // recuperar de la peticion de la url
            return fetch(e.request)
         })
   )
})


