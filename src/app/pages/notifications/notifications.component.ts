import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

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
  NotificationType
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
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Notifications', active: true }
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
    // Subscribe to notification updates from service
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
        this.updatePaginatedNotifications();
      });

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

    this.notificationService.getAllNotifications(0, 100).subscribe({
      next: (response) => {
        if (response.status === 0 && response.data) {
          this.notifications = this.convertToDisplayItems(response.data.notifications.items);
          this.totalItems = response.data.notifications.totalCount;
          this.unreadCount = response.data.unReadNotificationCount;
          this.updatePaginatedNotifications();
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

  private updatePaginatedNotifications(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && !this.loading) {
      this.currentPage = page;
      this.updatePaginatedNotifications();
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
    this.loadNotifications();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getTypeDescriptionKey(type: NotificationType): string {
    return `common.notificationTypes.${type}`;
  }

  formatTime(time: Date): string {
    if (!time) return '';

    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return time.toLocaleDateString(this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  }

  private getNotificationColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.NewRequest:
        return 'primary';
      case NotificationType.RequestAccepted:
        return 'success';
      case NotificationType.RequestRejected:
        return 'danger';
      case NotificationType.RequestCancelled:
        return 'warning';
      case NotificationType.RequestCompleted:
        return 'info';
      case NotificationType.NewReservation:
        return 'primary';
      default:
        return 'secondary';
    }
  }

  private getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.NewRequest:
        return 'plus-circle';
      case NotificationType.RequestAccepted:
        return 'check-circle';
      case NotificationType.RequestRejected:
        return 'x-circle';
      case NotificationType.RequestCancelled:
        return 'slash-circle';
      case NotificationType.RequestCompleted:
        return 'check2-all';
      case NotificationType.NewReservation:
        return 'calendar-plus';
      default:
        return 'bell';
    }
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
