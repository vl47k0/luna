import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  List,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Service, MapperService } from '../services/MapperService';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { User } from 'oidc-client-ts';
import { authService } from '../utils/oidc';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<MapperService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!solutionBackendRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const data: Service[] | undefined | null =
        await solutionBackendRef.current.fetchServices();
      if (!data) return;

      setServices((prev) => {
        const svcMap = new Map<string, Service>();
        prev.forEach((s) => svcMap.set(s.id, s));
        data.forEach((s) => svcMap.set(s.id, s));
        return Array.from(svcMap.values()).sort();
      });
    } catch (error) {
      setError('Failed to load services. Please try again later.');
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (!solutionBackendRef.current) {
        solutionBackendRef.current = new MapperService(
          import.meta.env.VITE_BACKEND_API_URL,
          user.access_token
        );
      }
      void fetchData();
    }

    return (): void => {
      if (solutionBackendRef.current) {
        solutionBackendRef.current = null;
      }
    };
  }, [user, fetchData]);

  useEffect((): void => {
    const fetchUser = async (): Promise<void> => {
      try {
        const data = await authService.getUser();
        setUser(data);
      } catch (error) {
        console.error('Failed to get user:', error);
      }
    };

    void fetchUser();
  }, []);

  return (
    <Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <List>
        {services.map((s) => (
          <Box
            key={s.id}
            p={2}
            border="1px solid #ccc"
            borderRadius="4px"
            my={2}
            sx={{ backgroundColor: 'white' }}
          >
            <MuiLink
              color="primary"
              component={RouterLink}
              to={`/services/${s.id}`}
              underline="none"
            >
              <Typography>{s.name}</Typography>
            </MuiLink>

            <ListItemText primary={`ID: ${s.id}`} />
            <ListItemText primary={`Name: ${s.name}`} />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default ServiceList;
