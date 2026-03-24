import { Component, ReactNode } from 'react';
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

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4">
          <div className="text-center max-w-md">
            <span className="material-symbols-outlined text-error text-[64px]">error</span>
            <h1 className="font-headline text-2xl font-bold text-on-surface mt-4">Something went wrong</h1>
            <p className="text-secondary text-sm mt-2">An unexpected error occurred. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <Routes>
        {/* Auth pages (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />

        {/* Admin (its own full-screen layout, no Navbar) */}
        <Route
          path="/admin"
          element={<AdminRoute><AdminDashboardPage /></AdminRoute>}
        />

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
        </Route>
      </Routes>
    </AuthProvider>
    </ErrorBoundary>
  );
}
