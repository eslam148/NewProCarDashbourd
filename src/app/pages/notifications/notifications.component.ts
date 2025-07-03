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
  DropdownModule,
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
    DropdownModule,
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
  filteredNotifications: NotificationDisplayItem[] = [];
  allNotifications: NotificationDisplayItem[] = [];

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Loading and states
  loading = false;
  loadingMarkAll = false;
  error: string | null = null;

  // Filters and search
  selectedTypeFilter: NotificationType | 'all' = 'all';
  selectedStatusFilter: 'all' | 'read' | 'unread' = 'all';

  // Notification types for filter dropdown - Only the main 6 types from original enum
  notificationTypes = [
    { value: 'all', label: 'notifications.allTypes' },
    { value: NotificationType.NewRequest, label: 'common.notificationTypes.newRequest' },
    { value: NotificationType.RequestAccepted, label: 'common.notificationTypes.requestAccepted' },
    { value: NotificationType.RequestRejected, label: 'common.notificationTypes.requestRejected' },
    { value: NotificationType.RequestCancelled, label: 'common.notificationTypes.requestCancelled' },
    { value: NotificationType.RequestCompleted, label: 'common.notificationTypes.requestCompleted' },
    { value: NotificationType.NewReservation, label: 'common.notificationTypes.newReservation' }
  ];

  // Status filters
  statusFilters = [
    { value: 'all', label: 'notifications.allStatus' },
    { value: 'unread', label: 'notifications.unread' },
    { value: 'read', label: 'notifications.read' }
  ];

  // Breadcrumb items
  breadcrumbItems = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Notifications', active: true }
  ];

  // Add currentLanguage property - public so it can be accessed from template
  currentLanguage: string = 'en';

  constructor(
    private notificationService: NotificationService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.setupSubscriptions();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    // Empty function - no search to initialize
  }

  private setupSubscriptions(): void {
    // Subscribe to notification updates from service
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.allNotifications = notifications;
        this.applyFilters();
      });

    // Subscribe to real-time Firebase notifications
    this.notificationService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        if (payload) {
          console.log('New Firebase notification received in notifications page:', payload);
          // Refresh notifications when new Firebase message arrives
          this.loadNotifications();
        }
      });

    // Subscribe to language changes
   this.translationService.getCurrentLang()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLanguage = lang;
        // Refresh notifications to update time formatting
        this.loadNotifications();
      });
  }

  loadNotifications(): void {
    this.loading = true;
    this.error = null;

    // Load more notifications for the dedicated page (up to 100)
    this.notificationService.getAllNotifications(0, 100).subscribe({
      next: (response) => {
        if (response.status === 0 && response.data) {
          const displayItems = this.convertToDisplayItems(response.data.notifications.items);
          this.allNotifications = displayItems;
          this.totalItems = response.data.notifications.totalCount;
          this.applyFilters();
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

  clearFilters(): void {
    this.selectedTypeFilter = 'all';
    this.selectedStatusFilter = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.allNotifications];

    // Apply type filter
    if (this.selectedTypeFilter !== 'all') {
      const typeFilter = typeof this.selectedTypeFilter === 'string'
        ? parseInt(this.selectedTypeFilter)
        : this.selectedTypeFilter;
      filtered = filtered.filter(notification =>
        notification.type === typeFilter
      );
    }

    // Apply status filter
    if (this.selectedStatusFilter !== 'all') {
      filtered = filtered.filter(notification => {
        if (this.selectedStatusFilter === 'read') {
          return notification.isRead;
        } else {
          return !notification.isRead;
        }
      });
    }

    this.filteredNotifications = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    // Reset to first page if current page is out of bounds
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }

    this.updatePaginatedNotifications();
  }

  private updatePaginatedNotifications(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.notifications = this.filteredNotifications.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedNotifications();
  }

  onTypeFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  markAsRead(notification: NotificationDisplayItem): void {
    if (notification.isRead) return;

    this.notificationService.markAsRead(notification.id);

    // Update local state immediately for better UX
    notification.isRead = true;
    this.applyFilters();
  }

  markAllAsRead(): void {
    const unreadNotifications = this.allNotifications.filter(n => !n.isRead);

    if (unreadNotifications.length === 0) return;

    this.loadingMarkAll = true;
    this.notificationService.markAllAsRead();

    // Update local state immediately for better UX
    this.allNotifications = this.allNotifications.map(notification => ({
      ...notification,
      isRead: true
    }));

    this.applyFilters();

    setTimeout(() => {
      this.loadingMarkAll = false;
    }, 1000);
  }

  refreshNotifications(): void {
    this.loadNotifications();
  }

  getUnreadCount(): number {
    return this.allNotifications.filter(n => !n.isRead).length;
  }

  getTypeDescriptionKey(type: NotificationType): string {
    return NotificationTypeHelper.getTypeDescriptionKey(type);
  }

  formatTime(time: Date): string {
    if (!time || isNaN(time.getTime())) {
      return '';
    }

    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

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

  trackByNotificationId(index: number, notification: NotificationDisplayItem): number {
    return notification.id;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }
}
