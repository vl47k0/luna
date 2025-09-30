import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Contact, SolutionService } from '../services/SolutionsService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

interface ContactCardProps {
  id: string;
}

const EmailCard: React.FC<ContactCardProps> = ({ id }) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);

  const fetchData = useCallback(async (issueId: string): Promise<void> => {
    if (!solutionBackendRef.current) return;
    setLoading(true);
    try {
      const data: Contact | undefined | null =
        await solutionBackendRef.current.fetchContact(issueId);
      if (data) {
        setContact(data);
      }
    } catch (error) {
      setError('Failed to load contact. Please try again later.');
      console.error('Failed to fetch contact:', error);
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
    if (user && !solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
    }
    return (): void => {
      if (solutionBackendRef.current) {
        solutionBackendRef.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      void fetchData(id);
    }
  }, [user, id, fetchData]);

  return (
    <MuiLink
      color="primary"
      component={RouterLink}
      to={`/contacts/${contact?.id}`}
      underline="none"
    >
      <Typography variant="h5" component="div">
        {loading && 'loading'}
        {contact?.email}
        {error}
      </Typography>
    </MuiLink>
  );
};

export default EmailCard;
