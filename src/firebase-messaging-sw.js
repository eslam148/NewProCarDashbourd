importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCq2swcLucEwPgmcCQRjJGIXnYiigZwYIc",
    authDomain: "procare-e867d.firebaseapp.com",
    projectId: "procare-e867d",
    storageBucket: "procare-e867d.firebasestorage.app",
    messagingSenderId: "154715479933",
    appId: "1:154715479933:web:8b57de625a91e189677614",
    measurementId: "G-Q9ZV48R4F7"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const { title, body } = payload.notification;

    self.registration.showNotification(title, {
        body,
        icon: '/assets/icons/icon-72x72.png'
    });
});
