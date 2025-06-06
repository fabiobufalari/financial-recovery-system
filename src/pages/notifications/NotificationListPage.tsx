import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import NotificationWidget from '../../components/notifications/NotificationWidget';

// Sidebar navigation items
const sidebarItems = [
  { name: 'Dashboard', icon: <FiSearch />, path: '/dashboard' },
  { name: 'Reports', icon: <FiFilter />, path: '/reports' },
  { name: 'Notifications', icon: <FiDownload />, path: '/notifications' },
  { name: 'Create', icon: <FiPlus />, path: '/notifications/create' },
];

const NotificationListPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample notification data - in a real application, this would come from an API
  const sampleNotifications = [
    {
      id: '1',
      type: 'EMAIL',
      subject: 'Monthly Financial Report Available',
      content: 'The financial report for January 2025 is now available. Please log in to view it.',
      status: 'DELIVERED',
      recipient: 'finance@example.com',
      createdAt: '2025-02-01T10:30:00Z'
    },
    {
      id: '2',
      type: 'IN_APP',
      subject: 'New Report Template Available',
      content: 'A new report template "Project Milestone Tracking" is now available for use.',
      status: 'READ',
      recipient: 'project_managers',
      createdAt: '2025-03-10T09:00:00Z'
    },
    {
      id: '3',
      type: 'SMS',
      subject: null,
      content: 'Your expense report has been approved and will be processed for payment.',
      status: 'DELIVERED',
      recipient: '+1234567890',
      createdAt: '2025-02-05T13:00:00Z'
    },
    {
      id: '4',
      type: 'EMAIL',
      subject: 'System Maintenance Notification',
      content: 'The system will be undergoing maintenance on April 20, 2025, from 22:00 to 02:00 UTC.',
      status: 'SENT',
      recipient: 'all_users@example.com',
      createdAt: '2025-04-15T10:00:00Z'
    },
    {
      id: '5',
      type: 'IN_APP',
      subject: 'Document Upload Required',
      content: 'Please upload your receipts for the expenses reported in your January 2025 expense report.',
      status: 'PENDING',
      recipient: 'john.doe',
      createdAt: '2025-02-10T13:00:00Z'
    },
    {
      id: '6',
      type: 'SMS',
      subject: null,
      content: 'Urgent: Project milestone deadline approaching in 48 hours.',
      status: 'FAILED',
      recipient: '+9876543210',
      createdAt: '2025-03-15T09:00:00Z'
    },
    {
      id: '7',
      type: 'EMAIL',
      subject: 'Weekly Project Update',
      content: 'The weekly project update for Downtown Project is now available in your dashboard.',
      status: 'DELIVERED',
      recipient: 'project_team@example.com',
      createdAt: '2025-03-20T14:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(sampleNotifications);
      setLoading(false);
    }, 800);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const filteredNotifications = notifications.filter(notification => {
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
          <div className="flex items-center space-x-4">
            <NotificationWidget />
            {/* Add other header elements like user profile dropdown */}
          </div>
        </header>

        <main className="p-6">
          {/* Filters and Actions */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    className="border rounded px-3 py-2 w-full md:w-auto"
                  >
                    <option value="all">All Statuses</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="READ">Read</option>
                    <option value="SENT">Sent</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    id="type-filter"
                    value={typeFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
                    className="border rounded px-3 py-2 w-full md:w-auto"
                  >
                    <option value="all">All Types</option>
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="IN_APP">In-App</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Link
                  to="/notifications/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <FiPlus className="mr-2" />
                  New Notification
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded shadow overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notifications match your filters
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject/Content
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotifications.map((notification) => (
                      <tr key={notification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {notification.subject || 'No Subject'}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {notification.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {notification.recipient}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(notification.status)}`}>
                            {notification.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(notification.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/notifications/${notification.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationListPage;
