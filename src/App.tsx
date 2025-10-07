import Routing from './Routing';
import Sidebar from './components/Sidebar';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';
import { authService } from './utils/oidc';
import { User } from 'oidc-client-ts';
import { useLocation, useNavigate } from 'react-router-dom';

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async (): Promise<void> => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
        // If the user is authenticated and at the root path, redirect to a default page.
        if (currentUser && location.pathname === '/') {
          navigate('/issues', { replace: true });
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };

    void checkUser();
  }, [navigate, location.pathname]);

  return (
    <Box sx={{ display: 'flex' }}>
      {user && <Sidebar />}
      <Routing />
    </Box>
  );
};

export default App;
