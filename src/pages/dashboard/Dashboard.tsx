import React from 'react'
// Removed unused FiHome import
import { FiDollarSign, FiPieChart, FiUsers, FiSettings } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import ProjectMap from '../../components/dashboard/ProjectMap'
import WeatherWidget from '../../components/dashboard/WeatherWidget'
import FinancialAnalysis from '../../components/dashboard/FinancialAnalysis'

/**
 * Página principal do dashboard
 * Main dashboard page
 */
const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore()

  // TODO: Add sidebar navigation component
  const sidebarItems = [
    { name: 'Dashboard', icon: <FiPieChart />, path: '/dashboard' },
    { name: 'Reports', icon: <FiDollarSign />, path: '/reports' }, // Added Reports link
    { name: 'Projects', icon: <FiDollarSign />, path: '/projects' }, // Placeholder
    { name: 'Clients', icon: <FiUsers />, path: '/clients' }, // Placeholder
    { name: 'Settings', icon: <FiSettings />, path: '/settings' }, // Placeholder
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Build System</h2>
        <nav>
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Link to={item.path} className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <button 
            onClick={logout} 
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          {/* Using user.username or email as fallback if name doesn't exist */}
          <h1 className="text-2xl font-semibold text-gray-800">Olá, {user?.username || user?.email || 'Usuário'}</h1>
          {/* Add other header elements like notifications, user profile dropdown */}
        </header>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Financial Analysis Widget */}
          <div className="lg:col-span-2">
            <FinancialAnalysis />
          </div>

          {/* Weather Widget */}
          <WeatherWidget />

          {/* Project Map Widget */}
          <div className="lg:col-span-3">
            <ProjectMap />
          </div>

          {/* Add more widgets as needed */}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

