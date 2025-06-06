import { Routes, Route } from 'react-router-dom';
import CompanyListPage from '../pages/companies/CompanyListPage';
import CompanyDetailPage from '../pages/companies/CompanyDetailPage';
import CompanyCreatePage from '../pages/companies/CompanyCreatePage';
import CompanyEditPage from '../pages/companies/CompanyEditPage';
import PeopleListPage from '../pages/people/PeopleListPage';
import PersonDetailPage from '../pages/people/PersonDetailPage';
import PersonCreatePage from '../pages/people/PersonCreatePage';
import PersonEditPage from '../pages/people/PersonEditPage';
import NotificationListPage from '../pages/notifications/NotificationListPage';
import NotificationDetailPage from '../pages/notifications/NotificationDetailPage';
import NotificationCreatePage from '../pages/notifications/NotificationCreatePage';
import Dashboard from '../pages/dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Company Routes */}
      <Route path="/companies" element={<ProtectedRoute><CompanyListPage /></ProtectedRoute>} />
      <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetailPage /></ProtectedRoute>} />
      <Route path="/companies/new" element={<ProtectedRoute><CompanyCreatePage /></ProtectedRoute>} />
      <Route path="/companies/:id/edit" element={<ProtectedRoute><CompanyEditPage /></ProtectedRoute>} />
      
      {/* People Routes */}
      <Route path="/people" element={<ProtectedRoute><PeopleListPage /></ProtectedRoute>} />
      <Route path="/people/:id" element={<ProtectedRoute><PersonDetailPage /></ProtectedRoute>} />
      <Route path="/people/new" element={<ProtectedRoute><PersonCreatePage /></ProtectedRoute>} />
      <Route path="/people/:id/edit" element={<ProtectedRoute><PersonEditPage /></ProtectedRoute>} />
      
      {/* Notification Routes */}
      <Route path="/notifications" element={<ProtectedRoute><NotificationListPage /></ProtectedRoute>} />
      <Route path="/notifications/:id" element={<ProtectedRoute><NotificationDetailPage /></ProtectedRoute>} />
      <Route path="/notifications/new" element={<ProtectedRoute><NotificationCreatePage /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
