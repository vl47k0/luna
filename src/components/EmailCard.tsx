import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CoreMasterService, UserInfo } from '../services/CoreMasterService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

interface EmailCardProps {
  id: string;
}

const EmailCard: React.FC<EmailCardProps> = ({ id }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const coreMasterServiceRef = useRef<CoreMasterService | null>(null);

  const fetchData = useCallback(async (userId: string): Promise<void> => {
    if (!coreMasterServiceRef.current) return;
    setLoading(true);
    try {
      const data: UserInfo = await coreMasterServiceRef.current.getUser(userId);
      if (data) {
        setUserInfo(data);
      }
    } catch (error) {
      setError('Failed to load user. Please try again later.');
      console.error('Failed to fetch user:', error);
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
      coreMasterServiceRef.current = new CoreMasterService(
        'https://dev.api-sod.com/core-api/'
      );
      coreMasterServiceRef.current.setAuthToken(user.access_token);
    }
    return (): void => {
      if (coreMasterServiceRef.current) {
        coreMasterServiceRef.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    if (user && id) {
      void fetchData(id);
    }
  }, [user, id, fetchData]);

  // Extract first name and last name from attributes
  const getDisplayName = (): string => {
    if (!userInfo?.attributes) return userInfo?.userCode ?? 'Unknown User';

    const firstName = userInfo.attributes.firstName as string | undefined;
    const lastName = userInfo.attributes.lastName as string | undefined;

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    if (firstName) return firstName;
    if (lastName) return lastName;

    return userInfo.userCode;
  };

  return (
    <MuiLink
      color="primary"
      component={RouterLink}
      to={`/users/${userInfo?.userId}`}
      underline="none"
    >
      <Typography variant="h5" component="div">
        {loading && 'Loading...'}
        {!loading && userInfo && getDisplayName()}
        {error && <span style={{ color: 'red' }}>{error}</span>}
      </Typography>
    </MuiLink>
  );
};

export default EmailCard;
