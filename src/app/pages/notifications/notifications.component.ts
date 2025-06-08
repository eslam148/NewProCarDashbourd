import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

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
  searchTerm = '';
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
    // Initialize search with debounce
    this.setupSearchDebounce();
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
  }

  private setupSearchDebounce(): void {
    const searchSubject = new Subject<string>();

    searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });

    // This will be called when search input changes
    this.onSearchChange = (term: string) => {
      this.searchTerm = term;
      searchSubject.next(term);
    };
  }

  onSearchChange(term: string): void {
    // This will be overridden by setupSearchDebounce
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onSearchChange(target.value);
  }

  loadNotifications(): void {
    this.loading = true;
    this.error = null;

    // Load more notifications for the dedicated page (up to 100)
    this.notificationService.getAllNotifications(0, 100).subscribe({
      next: (response) => {
        if (response.status === 0 && response.data) {
          const displayItems = this.convertToDisplayItems(response.data.items);
          this.allNotifications = displayItems;
          this.totalItems = response.data.totalCount;
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
    return notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      time: new Date(notification.createdAt),
      type: notification.type as NotificationType,
      isRead: notification.isRead,
      icon: NotificationTypeHelper.getTypeIcon(notification.type),
      color: NotificationTypeHelper.getTypeColor(notification.type),
      requestId: notification.requestId || undefined,
      reservationId: notification.reservationId || undefined
    }));
  }

  applyFilters(): void {
    let filtered = [...this.allNotifications];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchLower) ||
        notification.body.toLowerCase().includes(searchLower)
      );
    }

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

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTypeFilter = 'all';
    this.selectedStatusFilter = 'all';
    this.currentPage = 1;
    this.applyFilters();
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
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return time.toLocaleDateString();
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
