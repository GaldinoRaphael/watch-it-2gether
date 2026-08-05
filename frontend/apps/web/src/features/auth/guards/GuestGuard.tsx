import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';

/** Redirects already-authenticated users away from /login and /register. */
export function GuestGuard() {
  const { token } = useAuth();
  return token ? <Navigate to="/groups" replace /> : <Outlet />;
}
