// Firebase messaging service worker for background notifications
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase with your config
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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received:', payload);

    // Extract notification data
    const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || '',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        tag: `notification-${payload.data?.type || 'general'}`,
        data: {
            type: payload.data?.type,
            requestId: payload.data?.requestId,
            reservationId: payload.data?.reservationId,
            url: getNotificationUrl(payload.data),
            timestamp: Date.now()
        },
        requireInteraction: true,
        silent: false,
        vibrate: [200, 100, 200]
    };

    // Show notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);

    event.notification.close();

    // Get the URL to open
    const urlToOpen = event.notification.data?.url || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.focus();
                        // Send message to the app about notification click
                        client.postMessage({
                            type: 'NOTIFICATION_CLICKED',
                            data: event.notification.data
                        });
                        return client.navigate(urlToOpen);
                    }
                }

                // Open new window if app is not open
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Helper function to determine notification URL based on type
function getNotificationUrl(data) {
    if (!data) return '/dashboard';

    const type = parseInt(data.type);

    switch (type) {
        case 1: // NewRequest
            return '/requests';
        case 2: // RequestAccepted
        case 3: // RequestRejected
        case 4: // RequestCancelled
        case 5: // RequestCompleted
            return data.requestId ? `/requests/${data.requestId}` : '/requests';
        case 6: // NewReservation
            return data.reservationId ? `/reservations/${data.reservationId}` : '/reservations';
        default:
            return '/notifications';
    }
}

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    // Notification closed by user
});

// Handle push events for additional processing
self.addEventListener('push', (event) => {
    console.log('[firebase-messaging-sw.js] Push event received:', event);

    if (event.data) {
        try {
            const payload = event.data.json();
            console.log('[firebase-messaging-sw.js] Push payload:', payload);
        } catch (error) {
            console.error('[firebase-messaging-sw.js] Error parsing push payload:', error);
        }
    }
});
