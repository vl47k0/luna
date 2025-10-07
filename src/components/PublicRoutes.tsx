import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';
import CircularProgress from '@mui/material/CircularProgress';

interface AuthState {
  auth: boolean;
  role: User['profile'] | null;
  loading: boolean;
}

const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchUser = async (): Promise<void> => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, []);

  return { auth: !!user, role: user?.profile ?? null, loading };
};

const PublicRoutes: React.FC = (): JSX.Element => {
  const { auth, loading } = useAuth();

  // Automatically initiate sign-in if not authenticated
  useEffect(() => {
    if (!loading && !auth) {
      void authService.signIn();
    }
  }, [loading, auth]);

  if (loading) {
    return (
      <CircularProgress sx={{ margin: 'auto', display: 'block', mt: 10 }} />
    );
  }

  return auth ? (
    <Outlet />
  ) : (
    <CircularProgress sx={{ margin: 'auto', display: 'block', mt: 10 }} />
  );
};

export default PublicRoutes;
