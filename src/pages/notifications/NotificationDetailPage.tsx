import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiSend, FiTrash2 } from 'react-icons/fi';
import Sidebar from '../../components/layout/Sidebar';
import NotificationWidget from '../../components/notifications/NotificationWidget';

// Sidebar navigation items
const sidebarItems = [
  { name: 'Dashboard', icon: <FiArrowLeft />, path: '/dashboard' },
  { name: 'Notifications', icon: <FiCheck />, path: '/notifications' },
  { name: 'Create', icon: <FiSend />, path: '/notifications/create' },
];

const NotificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Sample notification data - in a real application, this would come from an API
  const sampleNotifications = [
    {
      id: '1',
      type: 'EMAIL',
      subject: 'Monthly Financial Report Available',
      content: 'The financial report for January 2025 is now available. Please log in to view it.\n\nYou can access the report through the Reports section of your dashboard or by clicking the link below:\n\nhttps://example.com/reports/jan2025\n\nIf you have any questions about the report, please contact the finance team.',
      status: 'DELIVERED',
      recipient: 'finance@example.com',
      createdAt: '2025-02-01T10:30:00Z',
      sentAt: '2025-02-01T10:31:15Z',
      deliveredAt: '2025-02-01T10:31:20Z',
      readAt: null
    },
    {
      id: '2',
      type: 'IN_APP',
      subject: 'New Report Template Available',
      content: 'A new report template "Project Milestone Tracking" is now available for use. This template allows you to track project milestones and deadlines more effectively.\n\nYou can find the new template in the Reports section under "Create New Report".',
      status: 'READ',
      recipient: 'project_managers',
      createdAt: '2025-03-10T09:00:00Z',
      sentAt: '2025-03-10T09:01:05Z',
      deliveredAt: '2025-03-10T09:01:10Z',
      readAt: '2025-03-10T14:25:30Z'
    },
    {
      id: '3',
      type: 'SMS',
      subject: null,
      content: 'Your expense report has been approved and will be processed for payment.',
      status: 'DELIVERED',
      recipient: '+1234567890',
      createdAt: '2025-02-05T13:00:00Z',
      sentAt: '2025-02-05T13:01:20Z',
      deliveredAt: '2025-02-05T13:01:45Z',
      readAt: null
    },
    {
      id: '4',
      type: 'EMAIL',
      subject: 'System Maintenance Notification',
      content: 'The system will be undergoing maintenance on April 20, 2025, from 22:00 to 02:00 UTC.\n\nDuring this time, the system will be unavailable. Please plan your work accordingly.\n\nWe apologize for any inconvenience this may cause.',
      status: 'SENT',
      recipient: 'all_users@example.com',
      createdAt: '2025-04-15T10:00:00Z',
      sentAt: '2025-04-15T10:05:00Z',
      deliveredAt: null,
      readAt: null
    },
    {
      id: '5',
      type: 'IN_APP',
      subject: 'Document Upload Required',
      content: 'Please upload your receipts for the expenses reported in your January 2025 expense report.\n\nThe deadline for submission is February 15, 2025.',
      status: 'PENDING',
      recipient: 'john.doe',
      createdAt: '2025-02-10T13:00:00Z',
      sentAt: null,
      deliveredAt: null,
      readAt: null
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const found = sampleNotifications.find(n => n.id === id);
      if (found) {
        setNotification(found);
      }
      setLoading(false);
    }, 800);
  }, [id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'READ':
        return 'bg-blue-100 text-blue-800';
      case 'SENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return 'bg-blue-100 text-blue-800';
      case 'SMS':
        return 'bg-green-100 text-green-800';
      case 'IN_APP':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsRead = () => {
    if (!notification || notification.status === 'READ') return;
    
    setUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setNotification({
        ...notification,
        status: 'READ',
        readAt: new Date().toISOString()
      });
      setUpdating(false);
    }, 500);
  };

  const handleResend = () => {
    if (!notification) return;
    
    setUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setNotification({
        ...notification,
        status: 'SENT',
        sentAt: new Date().toISOString(),
        deliveredAt: null,
        readAt: null
      });
      setUpdating(false);
    }, 500);
  };

  const handleDelete = () => {
    if (!notification) return;
    
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    setUpdating(true);
    // Simulate API call
    setTimeout(() => {
      navigate('/notifications');
    }, 500);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/notifications')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <FiArrowLeft />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Notification Details</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationWidget />
            {/* Add other header elements like user profile dropdown */}
          </div>
        </header>

        <main className="p-6">
          {loading ? (
            <div className="bg-white rounded shadow p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : notification ? (
            <div className="bg-white rounded shadow overflow-hidden">
              {/* Notification Header */}
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {notification.subject || 'No Subject'}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(notification.status)}`}>
                        {notification.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    {notification.status !== 'READ' && (
                      <button
                        onClick={handleMarkAsRead}
                        disabled={updating}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
                      >
                        <FiCheck className="mr-1" />
                        Mark as Read
                      </button>
                    )}
                    
                    {(notification.status === 'FAILED' || notification.status === 'PENDING') && (
                      <button
                        onClick={handleResend}
                        disabled={updating}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center"
                      >
                        <FiSend className="mr-1" />
                        Resend
                      </button>
                    )}
                    
                    <button
                      onClick={handleDelete}
                      disabled={updating}
                      className={`px-3 py-1 ${deleteConfirm ? 'bg-red-600' : 'bg-red-500'} text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center`}
                    >
                      <FiTrash2 className="mr-1" />
                      {deleteConfirm ? 'Confirm Delete' : 'Delete'}
                    </button>
                    
                    {deleteConfirm && (
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
                      >
                        <FiX className="mr-1" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Recipient</p>
                    <p>{notification.recipient}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p>{formatDate(notification.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sent</p>
                    <p>{formatDate(notification.sentAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Delivered</p>
                    <p>{formatDate(notification.deliveredAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Read</p>
                    <p>{formatDate(notification.readAt)}</p>
                  </div>
                </div>
              </div>
              
              {/* Notification Content */}
              <div className="p-6">
                <h3 className="font-medium mb-2">Content</h3>
                <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
                  {notification.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded shadow p-8 text-center">
              <p className="text-gray-500">Notification not found</p>
              <button
                onClick={() => navigate('/notifications')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Back to Notifications
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotificationDetailPage;
