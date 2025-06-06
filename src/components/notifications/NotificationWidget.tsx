import React, { useState, useEffect } from 'react';
import { FiBell, FiMail, FiMessageSquare, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Sample notification data - in a real application, this would come from an API
const sampleNotifications = [
  {
    id: '1',
    type: 'EMAIL',
    subject: 'Monthly Financial Report Available',
    content: 'The financial report for January 2025 is now available. Please log in to view it.',
    status: 'DELIVERED',
    createdAt: '2025-02-01T10:30:00Z'
  },
  {
    id: '2',
    type: 'IN_APP',
    subject: 'New Report Template Available',
    content: 'A new report template "Project Milestone Tracking" is now available for use.',
    status: 'READ',
    createdAt: '2025-03-10T09:00:00Z'
  },
  {
    id: '3',
    type: 'SMS',
    subject: null,
    content: 'Your expense report has been approved and will be processed for payment.',
    status: 'DELIVERED',
    createdAt: '2025-02-05T13:00:00Z'
  },
  {
    id: '4',
    type: 'EMAIL',
    subject: 'System Maintenance Notification',
    content: 'The system will be undergoing maintenance on April 20, 2025, from 22:00 to 02:00 UTC.',
    status: 'SENT',
    createdAt: '2025-04-15T10:00:00Z'
  },
  {
    id: '5',
    type: 'IN_APP',
    subject: 'Document Upload Required',
    content: 'Please upload your receipts for the expenses reported in your January 2025 expense report.',
    status: 'PENDING',
    createdAt: '2025-02-10T13:00:00Z'
  }
];

interface NotificationWidgetProps {
  maxNotifications?: number;
}

const NotificationWidget: React.FC<NotificationWidgetProps> = ({ maxNotifications = 3 }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch notifications
    setTimeout(() => {
      setNotifications(sampleNotifications);
      // Count unread notifications (PENDING or SENT status)
      const unread = sampleNotifications.filter(
        n => n.status === 'PENDING' || n.status === 'SENT'
      ).length;
      setUnreadCount(unread);
    }, 500);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <FiMail className="text-blue-500" />;
      case 'SMS':
        return <FiMessageSquare className="text-green-500" />;
      case 'IN_APP':
        return <FiBell className="text-yellow-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const handleNotificationClick = (id: string) => {
    navigate(`/notifications/${id}`);
    setShowDropdown(false);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would call an API to mark all as read
    setUnreadCount(0);
    // Update notification statuses locally
    const updatedNotifications = notifications.map(n => ({
      ...n,
      status: n.status === 'PENDING' || n.status === 'SENT' ? 'READ' : n.status
    }));
    setNotifications(updatedNotifications);
  };

  return (
    <div className="relative">
      <button 
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              )}
              <button 
                onClick={() => setShowDropdown(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.slice(0, maxNotifications).map(notification => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    notification.status === 'PENDING' || notification.status === 'SENT' 
                      ? 'bg-blue-50' 
                      : ''
                  }`}
                >
                  <div className="flex">
                    <div className="mr-3 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {notification.subject || 'Notification'}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 text-center border-t">
            <button 
              onClick={() => {
                navigate('/notifications');
                setShowDropdown(false);
              }}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationWidget;
