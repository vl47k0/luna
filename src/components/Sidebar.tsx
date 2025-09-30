import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../utils/oidc'; // Adjust the import path as necessary
import Dashboard from './Dashboard';
import { User } from 'oidc-client-ts';

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect((): void => {
    console.log(location);
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
  }, [location]);

  useEffect((): void => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{user && <Dashboard />}</>;
};

export default Sidebar;
