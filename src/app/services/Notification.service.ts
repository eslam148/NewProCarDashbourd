import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getMessaging, getToken, isSupported, Messaging, onMessage } from 'firebase/messaging';
import { mergeMapTo } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { initializeApp } from 'firebase/app';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take, map, catchError } from 'rxjs/operators';
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
            console.log('FCM token received:', token);
            this.currentToken$.next(token);
            return;
          } else {
            console.log('No registration token available.');
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
      console.log('Message received: ', payload);
      alert("New Notification")
      this.message$.next(payload);
    });
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
        next: (response) => {
          if (response.status === 0) {
            console.log(`Notification ${notification.id} marked as read`);
          }
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
