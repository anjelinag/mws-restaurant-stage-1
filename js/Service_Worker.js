let staticCacheName = 'restaurant-static-101';
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll([
				'/',
				'css/styles.css',
				'restaurant.json',
				'js/dbhelper.js',
				'js/main.js',
				'js/restaurant_info.js',
				'js/Service_worker.js',
				'index.html',
				'restaurant.html',
			])
			.catch(error =>{
				console.log('Caches open failed: ' + error)

		});
	});
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then(response => {
			if (response) {
				return response;
			}
			return fetch(event.request).then(networkResponse => {
				if (networkResponse.status === 404) {
					return;
				}
				return caches.open(staticCacheName).then(cache => {
					cache.put(event.request.url, networkResponse.clone());
					return networkResponse;
				})
			})
		}).catch(error => {
			console.log('Error:', error);
			return;
		})
	);
});
self.addEventListener('message', (event) => {
    console.log(event);
	
    // var messages = JSON.parse(event.data);
    if (event.data.action === 'skipWaiting') {
       self.skipWaiting();
    }
});

self.addEventListener('sync', function (event) {
	if (event.tag == 'myFirstSync') {
		const DBOpenRequest = indexedDB.open('restaurants', 1);
		DBOpenRequest.onsuccess = function (e) {
			db = DBOpenRequest.result;
			let tx = db.transaction('offline-reviews', 'readwrite');
			let store = tx.objectStore('offline-reviews');
			//get submitted reviews while offline
			let request = store.getAll();
			request.onsuccess = function () {
				//view offline reviews to network
				for (let i = 0; i < request.result.length; i++) {
					fetch(`http://localhost:1337/reviews/`, {
						body: JSON.stringify(request.result[i]),
						cache: 'no-cache', 
						credentials: 'same-origin', 
						headers: {
							'content-type': 'application/json'
						},
						method: 'POST',
						mode: 'cors', 
						redirect: 'follow', 
						referrer: 'no-referrer', 
					})
					.then(response => {
						return response.json();
					})
					.then(data => {
						let tx = db.transaction('all-reviews', 'readwrite');
						let store = tx.objectStore('all-reviews');
						let request = store.add(data);
						request.onsuccess = function (data) {
							//add data to view
							let tx = db.transaction('offline-reviews', 'readwrite');
							let store = tx.objectStore('offline-reviews');
							let request = store.clear();
							request.onsuccess = function () { };
							request.onerror = function (error) {
								console.log('Unable to clear offline-reviews objectStore', error);
							}
						};
						request.onerror = function (error) {
							console.log('Unable to add objectStore to IDB', error);
						}
					})
					.catch(error => {
						console.log('Unable to make a post fetch', error);
					})
				}
			}
			request.onerror = function (e) {
				console.log(e);
			}
		}
		DBOpenRequest.onerror = function (e) {
			console.log(e);
		}
	}
});
