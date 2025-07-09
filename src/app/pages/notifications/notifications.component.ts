import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, Observable, map } from 'rxjs';

// CoreUI imports
import {
  CardModule,
  ButtonModule,
  FormModule,
  PaginationModule,
  BadgeModule,
  SpinnerModule,
  BreadcrumbModule,
  AlertModule
} from '@coreui/angular';

// Services and models
import { NotificationService } from '../../services/Notification.service';
import { TranslationService } from '../../services/translation.service';
import {
  NotificationDisplayItem,
  NotificationType,
  NotificationTypeHelper
} from '../../Models/DTOs/NotificationDto';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    FormModule,
    PaginationModule,
    BadgeModule,
    SpinnerModule,
    BreadcrumbModule,
    AlertModule,
    TranslatePipe
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Make Math available in template
  Math = Math;

  // Data properties
  notifications: NotificationDisplayItem[] = [];
  totalItems = 0;
  totalPages = 0;
  unreadCount = 0;

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Loading and states
  loading = false;
  error: string | null = null;

  // Breadcrumb items
  breadcrumbItems = [
    { label: 'common.dashboard', url: '/dashboard' },
    { label: 'notifications.title', active: true }
  ];

  // Current language for date formatting
  currentLanguage: string = 'en';

  constructor(
    private notificationService: NotificationService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.setupSubscriptions();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    // Subscribe to real-time Firebase notifications
    this.notificationService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        if (payload) {
          this.loadNotifications();
        }
      });

    // Subscribe to language changes
    this.translationService.getCurrentLang()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLanguage = lang;
        this.loadNotifications();
      });
  }

  loadNotifications(): void {
    this.loading = true;
    this.error = null;

    // Convert to 0-based index for API
    const pageIndex = this.currentPage - 1;

    this.notificationService.getAllNotifications(pageIndex, this.pageSize).subscribe({
      next: (response) => {
        if (response.status === 0 && response.data) {
          this.notifications = this.convertToDisplayItems(response.data.notifications.items);
          this.totalItems = response.data.notifications.totalCount;
          this.unreadCount = response.data.unReadNotificationCount;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        } else {
          this.error = response.message || 'Failed to load notifications';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.error = 'Failed to load notifications. Please try again.';
        this.loading = false;
      }
    });
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

            time = new Date(year, monthMap[month], day, isPM ? hours + 12 : hours, minutes);
          } else {
            time = new Date(createdAt);
          }
        } else {
          time = new Date(createdAt);
        }
      } catch (e) {
        console.error('Error parsing date:', e);
        time = new Date();
      }

      return {
        ...notification,
        time,
        color: this.getNotificationColor(notification.type),
        icon: this.getNotificationIcon(notification.type)
      };
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && !this.loading) {
      this.currentPage = page;
      this.loadNotifications();
    }
  }

  markAsRead(notification: NotificationDisplayItem): void {
    if (!notification.isRead) {
      this.notificationService.markNotificationAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  refreshNotifications(): void {
    this.currentPage = 1; // Reset to first page on refresh
    this.loadNotifications();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getTypeDescriptionKey(type: NotificationType): string {
    return NotificationTypeHelper.getTypeDescriptionKey(type);
  }

  formatTime(time: Date): Observable<string> {
    if (!time) return this.translationService.translate('');

    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Get the translation key and parameters based on time difference
    let translationKey: string;
    let params: any[] = [];

    if (days > 7) {
      // For dates older than a week, use the locale-specific date format
      return this.translationService.translate('', []).pipe(
        map(() => time.toLocaleDateString(this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }))
      );
    } else if (days > 0) {
      translationKey = 'notifications.timeFormat.daysAgo';
      params = [days];
    } else if (hours > 0) {
      translationKey = 'notifications.timeFormat.hoursAgo';
      params = [hours];
    } else if (minutes > 0) {
      translationKey = 'notifications.timeFormat.minutesAgo';
      params = [minutes];
    } else {
      translationKey = 'notifications.timeFormat.justNow';
    }

    // Get the translated string
    return this.translationService.translate(translationKey, params);
  }

  private getNotificationColor(type: NotificationType): string {
    return NotificationTypeHelper.getTypeColor(type);
  }

  private getNotificationIcon(type: NotificationType): string {
    return NotificationTypeHelper.getTypeIcon(type);
  }

  trackByNotificationId(index: number, notification: NotificationDisplayItem): number {
    return notification.id;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
