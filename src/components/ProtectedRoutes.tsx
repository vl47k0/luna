import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../utils/oidc';
import type { User } from 'oidc-client-ts';

interface AuthState {
  auth: boolean;
  role: User['profile'] | undefined;
  loading: boolean;
  user: User | null;
}

const useAuth = (): AuthState => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect((): void | (() => void) => {
    let isMounted = true;

    const fetchUser = async (): Promise<void> => {
      try {
        const currentUser = await authService.getUser();
        if (isMounted) setUser(currentUser);
      } catch (_err: unknown) {
        // log if needed
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchUser();

    return (): void => {
      isMounted = false;
    };
  }, []);

  return { auth: !!user, role: user?.profile, loading, user };
};

const ProtectedRoutes: React.FC = () => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
};

export default ProtectedRoutes;
