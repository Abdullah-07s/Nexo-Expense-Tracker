import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute check -- user:', user, 'loading:', loading);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
