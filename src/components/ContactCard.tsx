import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Contact, SolutionService } from '../services/SolutionsService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

interface ContactCardProps {
  id: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ id }) => {
  const [issue, setIssue] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);

  const fetchData = useCallback(
    async (issueId: string): Promise<void> => {
      console.log(error, loading);
      if (!solutionBackendRef.current) return;
      setLoading(true);
      try {
        const data: Contact | undefined | null =
          await solutionBackendRef.current.fetchContact(issueId);
        if (!data) return;
        setIssue(data);
      } catch (error) {
        setError('Failed to load issues. Please try again later.');
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    },
    [error, loading]
  );

  useEffect((): void => {
    void authService.getUser().then((data) => {
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        import.meta.env.VITE_BACKEND_API_URL,
        user.access_token
      );
    }
    return (): void => {
      if (solutionBackendRef.current) {
        solutionBackendRef.current = null;
      }
    };
  }, [user]);

  useEffect((): void => {
    void fetchData(id);
  }, [user, id, fetchData]);

  return (
    <Card variant="outlined" sx={{ margin: 1 }}>
      <CardContent>
        <MuiLink
          color="primary"
          component={RouterLink}
          to={`/contacts/${issue?.id}`}
          underline="none"
        >
          <Typography variant="h5" component="div">
            {issue?.email}
          </Typography>
        </MuiLink>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
};

export default ContactCard;
