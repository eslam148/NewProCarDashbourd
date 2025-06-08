import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getMessaging, getToken, isSupported, Messaging, onMessage } from 'firebase/messaging';

import { environment } from '../../environments/environment';

import { initializeApp } from 'firebase/app';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  NotificationDto,
  NotificationListRequest,
  NotificationApiResponse,
  SingleNotificationApiResponse,
  NotificationDisplayItem,
  NotificationType,
  NotificationTypeHelper
} from '../Models/DTOs/NotificationDto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging: any;
  messaging2?: Messaging;
  private apiUrl = environment.apiUrl;

  // Firebase messaging subjects
  public currentToken$ = new BehaviorSubject<string | null>(null);
  public message$ = new BehaviorSubject<any>(null);

  // API notification subjects
  public notifications$ = new BehaviorSubject<NotificationDisplayItem[]>([]);
  public unreadCount$ = new BehaviorSubject<number>(0);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      initializeApp(environment.firebaseConfig);
      isSupported().then((supported) => {
        if (supported) {
          this.messaging = getMessaging();
        } else {
          console.warn('Firebase Messaging is not supported in this environment.');
        }
      });
    }
  }

  async requestPermission() {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      // Check if messaging is supported and initialized
      if (!this.messaging) {
        const supported = await isSupported();
        if (supported) {
          this.messaging = getMessaging();
        } else {
          console.warn('Firebase Messaging is not supported in this environment.');
          this.currentToken$.next('');
          return;
        }
      }

      // Request token with retry logic
      let retries = 2;
      while (retries >= 0) {
        try {
          const token = await getToken(this.messaging, {
            vapidKey: 'BH8-SVxnCB9RieA62u4fzlU2HGZhcnUSKd-0PjrEvXXvW5-ERtcpMtI9PlYOx0YA-HBmzbvlaCR2GtGqrqWm28Y',
          });

          if (token) {
            this.currentToken$.next(token);
            return;
          } else {
            // No registration token available
          }
        } catch (err) {
          console.error(`FCM token error (retry ${2-retries}/2):`, err);
        }
        retries--;

        // Wait before retry
        if (retries >= 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // If we get here, we failed to get a token
      this.currentToken$.next('');
    } catch (err) {
      console.error('Fatal error requesting FCM token:', err);
      this.currentToken$.next('');
    }
  }

  listen() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.messaging) {
      console.warn('Messaging not initialized yet.');
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('Firebase message received: ', payload);

      // Handle the incoming notification
      this.handleIncomingNotification(payload);

      // Emit the message for other components to listen
      this.message$.next(payload);
    });
  }

  /**
   * Handle incoming Firebase notification
   */
  private handleIncomingNotification(payload: any): void {
    try {
      // Extract notification data
      const notificationData = {
        title: payload.notification?.title || payload.data?.title || 'New Notification',
        body: payload.notification?.body || payload.data?.body || '',
        type: payload.data?.type ? parseInt(payload.data.type) : NotificationType.NewRequest,
        requestId: payload.data?.requestId || null,
        reservationId: payload.data?.reservationId || null,
        timestamp: new Date()
      };

      console.log('Processed notification data:', notificationData);

      // Show browser notification if permission granted
      this.showBrowserNotification(notificationData);

      // Add to local notifications list
      this.addNotificationToList(notificationData);

      // Refresh notifications from API to get the latest data
      this.loadNotifications();

    } catch (error) {
      console.error('Error handling incoming notification:', error);
    }
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notificationData: any): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check if browser notifications are supported and permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(notificationData.title, {
        body: notificationData.body,
        icon: '/assets/icons/icon-192x192.png', // Use existing app icon
        tag: `notification-${notificationData.type}`,
        requireInteraction: false,
        silent: false
      });

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();

        // Navigate to appropriate page based on notification type
        this.handleNotificationClick(notificationData);
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }

  /**
   * Handle notification click navigation
   */
  private handleNotificationClick(notificationData: any): void {
    // You can inject Router here if needed for navigation
    console.log('Notification clicked:', notificationData);

    // Example navigation logic based on notification type
    switch (notificationData.type) {
      case NotificationType.NewRequest:
        // Navigate to requests page
        window.location.href = '/requests';
        break;
      case NotificationType.RequestAccepted:
      case NotificationType.RequestRejected:
      case NotificationType.RequestCancelled:
      case NotificationType.RequestCompleted:
        // Navigate to specific request
        if (notificationData.requestId) {
          window.location.href = `/requests/${notificationData.requestId}`;
        }
        break;
      case NotificationType.NewReservation:
        // Navigate to reservations page
        if (notificationData.reservationId) {
          window.location.href = `/reservations/${notificationData.reservationId}`;
        } else {
          window.location.href = '/reservations';
        }
        break;
      default:
        // Navigate to notifications page
        window.location.href = '/notifications';
        break;
    }
  }

  /**
   * Add notification to local list
   */
  private addNotificationToList(notificationData: any): void {
    const newNotification: NotificationDisplayItem = {
      id: Date.now(), // Temporary ID until we get real ID from API
      title: notificationData.title,
      body: notificationData.body,
      time: notificationData.timestamp,
      type: notificationData.type,
      isRead: false,
      icon: this.getIconForType(notificationData.type),
      color: this.getColorForType(notificationData.type),
      requestId: notificationData.requestId,
      reservationId: notificationData.reservationId
    };

    // Add to beginning of notifications array
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = [newNotification, ...currentNotifications];

    // Limit to 50 notifications to prevent memory issues
    if (updatedNotifications.length > 50) {
      updatedNotifications.splice(50);
    }

    this.notifications$.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  /**
   * Request browser notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  /**
   * Initialize Firebase messaging with full setup
   */
  async initializeFirebaseMessaging(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      // Request notification permission first
      const notificationPermission = await this.requestNotificationPermission();
      console.log('Browser notification permission:', notificationPermission);

      // Request FCM permission and token
      await this.requestPermission();

      // Start listening for messages
      this.listen();

      console.log('Firebase messaging initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase messaging:', error);
    }
  }

  // Add this method to get token as a Promise
  async getTokenPromise(timeoutMs: number = 5000): Promise<string> {
    // Return existing token if available
    const currentToken = this.currentToken$.getValue();
    if (currentToken) {
      return currentToken;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('FCM token retrieval timed out');
      }, timeoutMs);

      this.currentToken$.pipe(
        filter(token => !!token),
        take(1)
      ).subscribe({
        next: (token) => {
          clearTimeout(timeout);
          resolve(token || '');
        },
        error: (err) => {
          clearTimeout(timeout);
          reject(err);
        }
      });

      // Request permission and token
      this.requestPermission();
    });
  }
  // API Methods for notification management

  /**
   * Get all notifications from the API
   */
  getAllNotifications(pageNumber: number = 0, pageSize: number = 10): Observable<NotificationApiResponse> {
    const url = `${this.apiUrl}/api/Notification/GetAll`;
    const body: NotificationListRequest = { pageNumber, pageSize };

    return this.http.post<NotificationApiResponse>(url, body, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Mark a notification as read
   */
  markNotificationAsRead(notificationId: number): Observable<SingleNotificationApiResponse> {
    const url = `${this.apiUrl}/api/Notification/ReadNotification/${notificationId}`;

    return this.http.get<SingleNotificationApiResponse>(url, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Load notifications and update the subjects
   */
  loadNotifications(): void {
    this.getAllNotifications(0, 50).subscribe({
      next: (response) => {
        if (response.status === 0 && response.data) {
          const displayItems = this.convertToDisplayItems(response.data.items);
          this.notifications$.next(displayItems);
          this.updateUnreadCount(displayItems);
        }
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  /**
   * Mark notification as read and update local state
   */
  markAsRead(notificationId: number): void {
    this.markNotificationAsRead(notificationId).subscribe({
      next: (response) => {
        if (response.status === 0) {
          // Update local state
          const currentNotifications = this.notifications$.value;
          const updatedNotifications = currentNotifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          );
          this.notifications$.next(updatedNotifications);
          this.updateUnreadCount(updatedNotifications);
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    const currentNotifications = this.notifications$.value;
    const unreadNotifications = currentNotifications.filter(n => !n.isRead);

    // Mark each unread notification as read
    unreadNotifications.forEach(notification => {
      this.markNotificationAsRead(notification.id).subscribe({
        next: () => {
          // Notification marked as read successfully
        },
        error: (error) => {
          console.error(`Error marking notification ${notification.id} as read:`, error);
        }
      });
    });

    // Update local state immediately for better UX
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    this.notifications$.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  /**
   * Convert API DTOs to display items
   */
  private convertToDisplayItems(notifications: NotificationDto[]): NotificationDisplayItem[] {
    return notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      time: new Date(notification.createdAt),
      type: notification.type as NotificationType,
      isRead: notification.isRead,
      icon: this.getIconForType(notification.type),
      color: this.getColorForType(notification.type),
      requestId: notification.requestId || undefined,
      reservationId: notification.reservationId || undefined
    }));
  }

  /**
   * Get icon based on notification type
   */
  private getIconForType(type: number): string {
    return NotificationTypeHelper.getTypeIcon(type as NotificationType);
  }

  /**
   * Get color based on notification type
   */
  private getColorForType(type: number): string {
    return NotificationTypeHelper.getTypeColor(type as NotificationType);
  }

  /**
   * Update unread count
   */
  private updateUnreadCount(notifications: NotificationDisplayItem[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCount$.next(unreadCount);
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): { [header: string]: string } {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  //  constructor(private afMessaging: AngularFireMessaging) { }

}
