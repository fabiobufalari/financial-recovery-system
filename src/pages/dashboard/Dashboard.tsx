import React from 'react';
import { FiPieChart, FiFileText, FiBell, FiUsers, FiSettings, FiHome } from 'react-icons/fi';
import { useAuthStore } from '../../stores/authStore';
import Sidebar from '../../components/layout/Sidebar';
import ProjectMap from '../../components/dashboard/ProjectMap';
import WeatherWidget from '../../components/dashboard/WeatherWidget';
import FinancialAnalysis from '../../components/dashboard/FinancialAnalysis';
import NotificationWidget from '../../components/notifications/NotificationWidget';

/**
 * Página principal do dashboard
 * Main dashboard page
 */
const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Sidebar navigation items
  const sidebarItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { name: 'Reports', icon: <FiFileText />, path: '/reports' },
    { name: 'Notifications', icon: <FiBell />, path: '/notifications' },
    { name: 'Analytics', icon: <FiPieChart />, path: '/analytics' },
    { name: 'Users', icon: <FiUsers />, path: '/users' },
    { name: 'Settings', icon: <FiSettings />, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Olá, {user?.firstName || user?.username || 'Usuário'}
          </h1>
          <div className="flex items-center space-x-4">
            <NotificationWidget />
            {/* Add other header elements like user profile dropdown */}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 overflow-y-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FiFileText className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Reports</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <FiPieChart className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Projects</p>
                <p className="text-xl font-bold">5</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <FiBell className="text-yellow-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Notifications</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </div>

          {/* Dashboard Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Analysis Widget */}
            <div className="lg:col-span-2">
              <FinancialAnalysis />
            </div>

            {/* Weather Widget */}
            <div>
              <WeatherWidget />
            </div>

            {/* Project Map Widget */}
            <div className="lg:col-span-3">
              <ProjectMap />
            </div>
          </div>
          
          {/* Recent Activity Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="bg-white rounded shadow p-4">
              <div className="space-y-4">
                <div className="flex items-start pb-4 border-b">
                  <div className="rounded-full bg-blue-100 p-2 mr-3">
                    <FiFileText className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Financial Report Generated</p>
                    <p className="text-sm text-gray-500">Monthly financial summary for March 2025</p>
                    <p className="text-xs text-gray-400 mt-1">Today at 08:00</p>
                  </div>
                </div>
                
                <div className="flex items-start pb-4 border-b">
                  <div className="rounded-full bg-green-100 p-2 mr-3">
                    <FiPieChart className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Project Status Updated</p>
                    <p className="text-sm text-gray-500">Northside Project is now 95% complete</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday at 15:30</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full bg-yellow-100 p-2 mr-3">
                    <FiBell className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">System Maintenance Scheduled</p>
                    <p className="text-sm text-gray-500">The system will be undergoing maintenance on April 20, 2025</p>
                    <p className="text-xs text-gray-400 mt-1">April 15 at 10:00</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-right">
                <a href="/activity" className="text-blue-500 hover:underline text-sm">
                  View all activity →
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
