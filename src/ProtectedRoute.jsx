import { useUser } from './Context/UserContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (!adminOnly && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;