import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Typography, Link as MuiLink, Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CoreMasterService, UserInfo } from '../services/CoreMasterService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

const BACKEND_URL =
  import.meta.env.VITE_COREMASTER_API_URL ?? 'https://dev.api-sod.com/core/v1';

interface EmailCardProps {
  id: string;
}

const EmailCard: React.FC<EmailCardProps> = ({ id }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const coreMasterServiceRef = useRef<CoreMasterService | null>(null);

  const fetchData = useCallback(async (userId: string): Promise<void> => {
    if (!coreMasterServiceRef.current) return;
    setLoading(true);
    setError(null);
    try {
      // Using findUsers as requested
      const data = await coreMasterServiceRef.current.findUsers({ userId });
      if (data && 'userId' in data) {
        setUserInfo(data);
      } else {
        setError('User not found.');
      }
    } catch (err) {
      setError('Failed to load user.');
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void authService.getUser().then((data) => {
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user && !coreMasterServiceRef.current) {
      coreMasterServiceRef.current = new CoreMasterService(BACKEND_URL);
      coreMasterServiceRef.current.setAuthToken(user.access_token);
    }
    // No cleanup needed here as the ref persists across renders
  }, [user]);

  useEffect(() => {
    if (user && id) {
      void fetchData(id);
    }
  }, [user, id, fetchData]);

  const getDisplayName = (): string => {
    // The ! postfix asserts that userInfo is not null here.
    // This is safe because we only call this function when userInfo is truthy.
    return userInfo!.attributes.name ?? userInfo!.userCode ?? 'Unknown User';
  };

  if (loading) {
    return <Skeleton variant="text" width={150} />;
  }

  if (error) {
    return (
      <Typography variant="h5" component="div" color="error">
        {error}
      </Typography>
    );
  }

  if (!userInfo) {
    return (
      <Typography variant="h5" component="div">
        User not found
      </Typography>
    );
  }

  return (
    <MuiLink
      color="primary"
      component={RouterLink}
      to={`/users/${userInfo.userId}`}
      underline="none"
    >
      <Typography variant="h5" component="div">
        {getDisplayName()}
      </Typography>
    </MuiLink>
  );
};

export default EmailCard;
