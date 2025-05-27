import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';

// Import Report Pages
import ReportListPage from './pages/reports/ReportListPage';
import ReportViewPage from './pages/reports/ReportViewPage';
import ReportCreatePage from './pages/reports/ReportCreatePage';
import ReportEditPage from './pages/reports/ReportEditPage';

/**
 * Componente principal da aplicação que gerencia as rotas
 * Main application component that manages routes
 */
function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Rota pública para login / Public route for login */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      
      {/* Rotas protegidas / Protected routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Dashboard Route */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Report Routes */}
      <Route path="/reports" element={
        <ProtectedRoute>
          <ReportListPage />
        </ProtectedRoute>
      } />
      <Route path="/reports/new" element={
        <ProtectedRoute>
          <ReportCreatePage />
        </ProtectedRoute>
      } />
       <Route path="/reports/view/:id" element={
        <ProtectedRoute>
          <ReportViewPage />
        </ProtectedRoute>
      } />
      <Route path="/reports/edit/:id" element={
        <ProtectedRoute>
          <ReportEditPage />
        </ProtectedRoute>
      } />
      
      {/* Rota para página não encontrada / Route for not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

