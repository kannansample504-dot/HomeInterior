import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
