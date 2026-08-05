import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';

/** Redirects unauthenticated users to /login. */
export function AuthGuard() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
