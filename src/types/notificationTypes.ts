/**
 * Types for the notification system
 */

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP'
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
  READ = 'READ'
}

export interface NotificationDTO {
  id: number;
  recipient: string;
  type: NotificationType;
  status: NotificationStatus;
  subject?: string;
  content: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export interface NotificationRequestDTO {
  recipient: string;
  type: NotificationType;
  subject?: string;
  content: string;
}
