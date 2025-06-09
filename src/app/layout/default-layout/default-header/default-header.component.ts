import { NgTemplateOutlet, AsyncPipe, NgIf, NgClass, NgForOf, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../../store/auth/auth.actions';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslationService } from '../../../services/translation.service';
import { NotificationService } from '../../../services/Notification.service';
import { Subject, takeUntil } from 'rxjs';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { LanguageSwitcherComponent } from '../../../components/language-switcher/language-switcher.component';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle.component';
import { UserAvatarComponent } from '../../../components/user-avatar/user-avatar.component';
import { selectAuthResponse } from '../../../store/auth/auth.selectors';
import { selectProfile, selectProfileImage, selectProfileFullName } from '../../../store/profile/profile.selectors';
import { loadProfile } from '../../../store/profile/profile.actions';
import { AuthService } from '../../../services/auth.service';
import { NotificationDisplayItem, NotificationType, NotificationTypeHelper } from '../../../Models/DTOs/NotificationDto';

@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      ContainerComponent,
      HeaderTogglerDirective,
      SidebarToggleDirective,

      HeaderNavComponent,


      RouterLink,

      NgTemplateOutlet,

      DropdownComponent,
      DropdownToggleDirective,
      DropdownMenuDirective,
      DropdownHeaderDirective,
      DropdownItemDirective,
      BadgeComponent,
      DropdownDividerDirective,
      LanguageSwitcherComponent,
      ThemeToggleComponent,
      UserAvatarComponent,
      AsyncPipe,
      TranslatePipe,
      NgIf,
      NgClass,
      NgForOf,

    ]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit, OnDestroy {
  readonly #colorModeService = inject(ColorModeService);
  readonly #store = inject(Store);
  readonly #notificationService = inject(NotificationService);
  readonly #authService = inject(AuthService);
  readonly colorMode = this.#colorModeService.colorMode;
  currentLanguage: string = 'en';

  // Profile data observables
  profile$ = this.#store.select(selectProfile);
  profileImage$ = this.#store.select(selectProfileImage);
  profileFullName$ = this.#store.select(selectProfileFullName);
  authUser$ = this.#store.select(selectAuthResponse);

  // Notification properties
  unreadCount = 0;
  notifications: any[] = [];
  private destroy$ = new Subject<void>();
  loading = false;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ] as const;

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  // Memoize static data
  readonly newMessages = [
    { id: 0, title: 'common.messages.updates', link: '', status: 'info', time: 'common.time.42' },
    { id: 1, title: 'common.messages.messages', link: '/apps/email/inbox', status: 'success', time: 'common.time.42' },
    { id: 2, title: 'common.messages.tasks', link: '', status: 'danger', time: 'common.time.42' },
    { id: 3, title: 'common.messages.comments', link: '', status: 'warning', time: 'common.time.42' }
  ] as const;

  readonly newNotifications = [
    { id: 0, title: 'common.notifications.newUser', icon: 'cilUserFollow', color: 'success' },
    { id: 1, title: 'common.notifications.userDeleted', icon: 'cilUserUnfollow', color: 'danger' },
    { id: 2, title: 'common.notifications.salesReport', icon: 'cilChartPie', color: 'info' },
    { id: 3, title: 'common.notifications.newClient', icon: 'cilBasket', color: 'primary' },
    { id: 4, title: 'common.notifications.serverOverload', icon: 'cilSpeedometer', color: 'warning' }
  ] as const;

  readonly newStatus = [
    { id: 0, title: 'common.status.cpuUsage', value: 25, color: 'info', details: 'common.status.processes' },
    { id: 1, title: 'common.status.memoryUsage', value: 70, color: 'warning', details: 'common.status.memory' },
    { id: 2, title: 'common.status.ssdUsage', value: 90, color: 'danger', details: 'common.status.storage' }
  ] as const;

  readonly newTasks = [
    { id: 0, title: 'common.tasks.upgradeNpm', value: 0, color: 'info' },
    { id: 1, title: 'common.tasks.reactVersion', value: 25, color: 'danger' },
    { id: 2, title: 'common.tasks.vueVersion', value: 50, color: 'warning' },
    { id: 3, title: 'common.tasks.newLayouts', value: 75, color: 'info' },
    { id: 4, title: 'common.tasks.angularVersion', value: 100, color: 'success' }
  ] as const;

  constructor(
        private translationService: TranslationService,
        private notificationService: NotificationService,
  ) {
    super();
  }

  sidebarId = input('sidebar1');

  ngOnInit() {
    // Add this subscription at the beginning of ngOnInit
    this.translationService.getCurrentLang()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLanguage = lang;
        // Refresh notifications to update time formatting
        this.loadNotifications();
      });

    // Initialize Firebase messaging
    this.initializeFirebaseMessaging();

    // Load real notifications from API
    this.loadNotifications();

    // Load profile data when auth user is available
    this.authUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(authUser => {
        if (authUser) {
          // Get user ID from auth service
          const userId = this.#authService.getCurrentUserId();
          if (userId) {
            this.#store.dispatch(loadProfile({ userId: userId.toString() }));
          }
        }
      });

    // Subscribe to notification updates from API
    this.#notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    // Subscribe to unread count updates
    this.#notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });

    // Subscribe to Firebase notification updates (for real-time notifications)
    this.#notificationService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        if (payload) {
          console.log('New Firebase notification received in header:', payload);
          // Notifications are automatically updated by the service
          // No need to manually reload here as the service handles it
        }
      });

    // Subscribe to Firebase token updates
    this.#notificationService.currentToken$
      .pipe(takeUntil(this.destroy$))
      .subscribe(token => {
        if (token) {
          console.log('FCM token received in header:', token);
          // You can send this token to your backend if needed
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  formatTime(time: any): string {
    // Ensure time is a valid Date object
    if (!time || isNaN(time.getTime())) {
      return '';
    }

    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    console.log('Time difference:', this.currentLanguage);
    if (this.currentLanguage === 'ar') {
      // Arabic relative time formatting
      if (diffMins < 1) return 'للتو';
      if (diffMins < 60) return `منذ ${diffMins} ${diffMins === 1 ? 'دقيقة' : 'دقائق'}`;
      if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
      if (diffDays < 7) return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;

      // Format absolute date for older entries
      return time.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } else {
      // English relative time formatting
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      // Format absolute date for older entries
      return time.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    }
  }

  onLogout() {
    this.#store.dispatch(logout());
  }

  // Notification methods
  markAllAsRead() {
    this.#notificationService.markAllAsRead();
  }

  markAsRead(notification: any) {
    this.#notificationService.markAsRead(notification.id);
  }

  private loadNotifications() {
    this.loading = true;
    this.notificationService.getAllNotifications(0, 100).subscribe({
      next: (response) => {
        if (response.status === 0 && response.data) {
          const displayItems = this.convertToDisplayItems(response.data.items);
          this.notifications = displayItems;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  private async initializeFirebaseMessaging() {
    try {
      await this.#notificationService.initializeFirebaseMessaging();
      console.log('Firebase messaging initialized in header component');
    } catch (error) {
      console.error('Error initializing Firebase messaging in header:', error);
    }
  }
 private convertToDisplayItems(notifications: any[]): NotificationDisplayItem[] {
    return notifications.map(notification => {
      let time: Date;
      const createdAt = notification.createdAt;

      try {
        if (typeof createdAt === 'string') {
          if (createdAt.match(/[يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر]/)) {
            // Handle Arabic format: "يونيو 03, 2025 12:45 م"
            const parts = createdAt.split(' ').filter(Boolean);
            const month = parts[0];
            const day = parseInt(parts[1].replace(',', ''));
            const year = parseInt(parts[2]);
            const timeParts = parts[3].split(':');
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const isPM = parts[4] === 'م';

            const monthMap: { [key: string]: number } = {
              'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3, 'مايو': 4, 'يونيو': 5,
              'يوليو': 6, 'أغسطس': 7, 'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11
            };

            let adjustedHours = hours;
            if (isPM && hours !== 12) {
              adjustedHours = hours + 12;
            } else if (!isPM && hours === 12) {
              adjustedHours = 0;
            }

            time = new Date(year, monthMap[month], day, adjustedHours, minutes);
          } else {
            // Try parsing as English format or ISO
            time = new Date(createdAt);
          }
        } else if (createdAt instanceof Date) {
          time = createdAt;
        } else {
          time = new Date(); // Fallback to current time
        }

        // Validate the parsed date
        if (isNaN(time.getTime())) {
          console.warn('Invalid date created from:', createdAt);
          time = new Date();
        }
      } catch (error) {
        console.error('Error parsing date:', error, createdAt);
        time = new Date();
      }

      return {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        time,
        type: notification.type as NotificationType,
        isRead: notification.isRead,
        icon: NotificationTypeHelper.getTypeIcon(notification.type),
        color: NotificationTypeHelper.getTypeColor(notification.type),
        requestId: notification.requestId || undefined,
        reservationId: notification.reservationId || undefined
      };
    });
  }

  // Removed old mock notification methods - now using real API data
}
