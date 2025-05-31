import { apiClient } from './apiClient';
import { NotificationDTO, NotificationRequestDTO } from '../types/notificationTypes';

const BASE_URL = '/api/notifications';

/**
 * Service for interacting with the notification API
 */
export const notificationService = {
  /**
   * Get all notifications
   * @returns Promise with array of notifications
   */
  getAllNotifications: async (): Promise<NotificationDTO[]> => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  /**
   * Get notification by ID
   * @param id Notification ID
   * @returns Promise with notification data
   */
  getNotificationById: async (id: number): Promise<NotificationDTO> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new notification
   * @param notification Notification data to create
   * @returns Promise with created notification
   */
  createNotification: async (notification: NotificationRequestDTO): Promise<NotificationDTO> => {
    const response = await apiClient.post(BASE_URL, notification);
    return response.data;
  },

  /**
   * Delete a notification
   * @param id Notification ID to delete
   * @returns Promise with void
   */
  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Get notifications by status
   * @param status Status to filter by
   * @returns Promise with array of notifications
   */
  getNotificationsByStatus: async (status: string): Promise<NotificationDTO[]> => {
    const response = await apiClient.get(`${BASE_URL}/status/${status}`);
    return response.data;
  },

  /**
   * Get notifications by type
   * @param type Type to filter by
   * @returns Promise with array of notifications
   */
  getNotificationsByType: async (type: string): Promise<NotificationDTO[]> => {
    const response = await apiClient.get(`${BASE_URL}/type/${type}`);
    return response.data;
  },

  /**
   * Get notifications by recipient
   * @param recipient Recipient email or phone number
   * @returns Promise with array of notifications
   */
  getNotificationsByRecipient: async (recipient: string): Promise<NotificationDTO[]> => {
    const response = await apiClient.get(`${BASE_URL}/recipient/${encodeURIComponent(recipient)}`);
    return response.data;
  }
};
