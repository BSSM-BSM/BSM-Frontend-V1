const cacheName = '1.2.0.6';
let cacheFiles = [
    '/',
    '/meal',
    '/timetable',
    '/meister',
    '/board/board',
    '/board/anonymous',
    '/js/jquery.min.js',
    '/js/summernote-lite.min.js',
    '/js/lang/summernote-ko-KR.js',
    '/js/menu_bar.js',
    '/js/search.js',
    '/js/error_code.js',
    '/js/alert.js',
    '/js/vue.js',
    '/js/etc/meal.js',
    '/js/etc/board/board.js',
    '/js/etc/board/post.js',
    '/css/style.css',
    '/css/etc/board.css',
    '/css/etc/index.css',
    '/css/etc/meal.css',
    '/css/etc/meister.css',
    '/css/etc/memberinfo.css',
    '/css/etc/timetable.css',
    '/css/summernote-lite.min.css',
    '/icons/logo.png',
    '/resource/member/profile_images/profile_default.png'
];
self.addEventListener('install', (event) => {
    event.waitUntil(
        // 캐쉬할 페이지들을 전부 캐쉬합니다.
        caches.open(cacheName).then((cache) => cache.addAll(cacheFiles))
    );
    self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') { // GET 요청만 캐싱 지원 처리
        return;
    }
    const fetchRequest = event.request.clone();
    event.respondWith(
        fetch(fetchRequest)
            .then((response) => {
                //caches.open(cacheName) // 네트워크 요청 성공시 해당 결과값 캐싱
                //      .then(cache => cache.put(event.request.url, response.clone()));
                return response;
            })
            .catch(() => {
                return caches.match(event.request.url)
                    .then(cache => {return cache;}) // 네트워크 요청 실패시 캐싱된 요청으로 응답.
            })
    );
});
self.addEventListener("push", event => { //푸시알림을 받았을 때
    const payload = JSON.parse(event.data.text());
    event.waitUntil(
        registration.showNotification(payload.title, {
            body:payload.body,
            data:{
                link:payload.link
            },
        })
    );
});
self.addEventListener("notificationclick", event => { //알림을 클릭할 때
    clients.openWindow(event.notification.data.link);
});