// Notification DTOs based on the API response structure

export interface NotificationDto {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  type: number;
  requestId: string | null;
  reservationId: string | null;
  isRead: boolean;
  readAt: string | null;
}
export interface DisplayNotificationDto {
  id: number;
  title: string;
  body: string;
  time: Date;
  type: NotificationType;
  isRead: boolean;
  icon: string;
  color: string;
  requestId: string | null;
  reservationId: string | null;
}
export interface NotificationListRequest {
  pageNumber: number;
  pageSize: number;
}

export interface NotificationListResponse {
  items: NotificationDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NotificationApiResponse {
  status: number;
  message: string;
  internalMessage: string | null;
  data: NotificationListResponse;
  subStatus: number;
}

export interface SingleNotificationApiResponse {
  status: number;
  message: string;
  internalMessage: string | null;
  data: NotificationDto;
  subStatus: number;
}

// Enum for notification types - matches backend NotificationTypesEnum
export enum NotificationType {
  NewRequest = 1,
  RequestAccepted = 2,
  RequestRejected = 3,
  RequestCancelled = 4,
  RequestCompleted = 5,
  NewReservation = 6
}

// Helper interface for UI display
export interface NotificationDisplayItem {
  id: number;
  title: string;
  body: string;
  time: Date;
  type: NotificationType;
  isRead: boolean;
  icon: string;
  color: string;
  requestId?: string;
  reservationId?: string;
}

// Helper functions for notification types
export class NotificationTypeHelper {
  static getTypeDescriptionKey(type: NotificationType): string {
    switch (type) {
      case NotificationType.NewRequest:
        return 'common.notificationTypes.newRequest';
      case NotificationType.RequestAccepted:
        return 'common.notificationTypes.requestAccepted';
      case NotificationType.RequestRejected:
        return 'common.notificationTypes.requestRejected';
      case NotificationType.RequestCancelled:
        return 'common.notificationTypes.requestCancelled';
      case NotificationType.RequestCompleted:
        return 'common.notificationTypes.requestCompleted';
      case NotificationType.NewReservation:
        return 'common.notificationTypes.newReservation';
      default:
        return 'common.notifications';
    }
  }

  // Legacy method for backward compatibility
  static getTypeDescription(type: NotificationType): string {
    return this.getTypeDescriptionKey(type);
  }

  static getTypeIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.NewRequest:
        return 'person-plus-fill';
      case NotificationType.RequestAccepted:
        return 'check-circle-fill';
      case NotificationType.RequestRejected:
        return 'x-circle-fill';
      case NotificationType.RequestCancelled:
        return 'slash-circle-fill';
      case NotificationType.RequestCompleted:
        return 'check2-circle';
      case NotificationType.NewReservation:
        return 'calendar-plus-fill';
      default:
        return 'bell-fill';
    }
  }

  static getTypeColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.NewRequest:
        return 'info';
      case NotificationType.RequestAccepted:
        return 'success';
      case NotificationType.RequestRejected:
        return 'danger';
      case NotificationType.RequestCancelled:
        return 'warning';
      case NotificationType.RequestCompleted:
        return 'success';
      case NotificationType.NewReservation:
        return 'primary';
      default:
        return 'secondary';
    }
  }
}
