import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { BookmarkService, GroupedUnitLinks } from '../services/BookmarkService';
import { User } from 'oidc-client-ts';
import { authService } from '../utils/oidc';
import { useParams } from 'react-router-dom';

const BookmarkDetail: React.FC = () => {
  const { unitId } = useParams();
  const [groupedUnits, setGroupedUnits] = useState<GroupedUnitLinks[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const bookmarkBackendRef = useRef<BookmarkService | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!bookmarkBackendRef.current) return;
    setLoading(true);
    setError(null);

    try {
      if (!unitId) return;
      const data =
        await bookmarkBackendRef.current.fetchGroupedLinksForUnit(unitId);
      if (!data) return;
      setGroupedUnits(data);
    } catch (error) {
      setError('Failed to load grouped links. Please try again later.');
      console.error('Failed to fetch grouped links:', error);
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  useEffect((): (() => void) => {
    const initializeUser = async (): Promise<void> => {
      try {
        const data = await authService.getUser();
        if (data?.access_token) {
          setUser(data);
          bookmarkBackendRef.current = new BookmarkService(
            'https://mars.georgievski.net/',
            data.access_token
          );
        }
      } catch (error) {
        console.error('Failed to get user:', error);
      }
    };

    void initializeUser();

    return (): void => {
      bookmarkBackendRef.current = null;
    };
  }, []);

  useEffect((): void => {
    if (user?.access_token && bookmarkBackendRef.current) {
      void fetchData();
    }
  }, [user, fetchData]);

  return (
    <Box>
      {user && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Bookmarks for {user?.profile?.email ?? 'User'}
        </Typography>
      )}

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {groupedUnits.map((group) => (
        <Box
          key={group.unit.id}
          p={2}
          mb={3}
          border="1px solid #ccc"
          borderRadius="4px"
          sx={{ backgroundColor: '#fafafa' }}
        >
          <MuiLink
            component={RouterLink}
            to={`/bookmarks/${group.unit.id}`}
            underline="hover"
            color="primary"
          >
            <Typography variant="h6" gutterBottom>
              Unit: {group.unit.title}
            </Typography>
          </MuiLink>

          <List dense>
            {group.links.map((link) => (
              <ListItem key={link.id}>
                <ListItemText
                  primary={
                    <MuiLink
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.title}
                    </MuiLink>
                  }
                  secondary={new Date(link.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
            {group.links.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No links in this unit.
              </Typography>
            )}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default BookmarkDetail;
