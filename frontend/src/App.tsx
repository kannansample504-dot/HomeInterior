import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import HomePage from './pages/home/HomePage';
import AboutPage from './pages/about/AboutPage';
import HowItWorksPage from './pages/how-it-works/HowItWorksPage';
import EstimatePage from './pages/estimate/EstimatePage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth pages (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />

        {/* Public pages with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/estimate" element={<EstimatePage />} />

          {/* Protected: User Dashboard */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />

          {/* Protected: Admin Dashboard */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboardPage /></AdminRoute>}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
