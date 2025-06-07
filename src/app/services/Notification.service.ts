import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { getMessaging, getToken, isSupported, Messaging, onMessage } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private messaging: any;
  messaging2?: Messaging;
  public currentToken$ = new BehaviorSubject<string | null>(null);
  public message$ = new BehaviorSubject<any>(null);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
    if (!this.messaging) {
      console.warn('Messaging not initialized yet.');
      return;
    }

    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'BH8-SVxnCB9RieA62u4fzlU2HGZhcnUSKd-0PjrEvXXvW5-ERtcpMtI9PlYOx0YA-HBmzbvlaCR2GtGqrqWm28Y',
      });
      if (token) {
        console.log('Token received:', token);
        // send token to your backend server here
        this.currentToken$.next(token);

      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
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
}
