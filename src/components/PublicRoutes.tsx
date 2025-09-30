import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

interface AuthState {
  auth: boolean;
  role: User['profile'] | null; // Adjust the type if you have a specific type for role
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

const PublicRoutes: React.FC = (props): JSX.Element => {
  const { auth, loading } = useAuth();
  console.log(props);

  if (loading) {
    return <div>Loading...</div>;
  }

  return auth ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoutes;
