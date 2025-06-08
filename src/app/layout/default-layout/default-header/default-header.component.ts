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
      NavItemComponent,
      NavLinkDirective,
      RouterLink,
      RouterLinkActive,
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
      DatePipe
    ]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit, OnDestroy {
  readonly #colorModeService = inject(ColorModeService);
  readonly #store = inject(Store);
  readonly #notificationService = inject(NotificationService);
  readonly #authService = inject(AuthService);
  readonly colorMode = this.#colorModeService.colorMode;

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

  constructor() {
    super();
  }

  sidebarId = input('sidebar1');

  ngOnInit() {
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
    this.#notificationService.loadNotifications();
    // Loading state will be updated when notifications are received
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

  // Removed old mock notification methods - now using real API data
}
