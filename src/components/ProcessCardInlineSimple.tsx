import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Link as MuiLink,
  Dialog,
  DialogContent,
  DialogActions,
  styled,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import { Issue, Process, SolutionService } from '../services/SolutionsService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';
import FormattedTextDisplay from './FormattedTextDisplay';
import ProcessMergeForm, { ProcessUpdateForm } from './ProcessMergeForm';

interface ProcessCardContentProps {
  solution?: boolean;
}

const ProcessCardContent = styled(CardContent)<ProcessCardContentProps>(
  ({ theme, solution }) => ({
    backgroundColor: solution ? '#e4e7f9' : theme.palette.background.paper,
  })
);

interface ProcessCardInlineSimpleProps {
  id: string;
  onProcessSelected: (process: Process) => void;
}

const ProcessCardInlineSimple: React.FC<ProcessCardInlineSimpleProps> = ({
  id,
}) => {
  const [process, setProcess] = useState<Process | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleDialogOpen = (): void => {
    console.log(loading, error);
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  const processSent = useCallback((p: Process): void => {
    console.log(p);
  }, []);

  const submitHandler = useCallback(
    (form: ProcessUpdateForm): void => {
      void handleSubmit(form).catch((error) => {
        setError('Failed to get user. Please try again later.');
        console.error('Failed to get user:', error);
      });
    },
    [issue]
  );

  const handleSubmit = useCallback(
    async (form: ProcessUpdateForm): Promise<void> => {
      if (!solutionBackendRef.current) return;
      try {
        const update: Partial<Process> = {
          id: issue?.process ?? '',
          data: form.text,
          assets: form.filenames,
        };
        await solutionBackendRef.current.updateProcess(update, processSent);
      } catch (error) {
        console.error('Failed to create issue:', error);
      } finally {
        setOpenDialog(false);
      }
    },
    [issue, processSent]
  );

  const fetchIssue = useCallback(async (issueId: string): Promise<void> => {
    if (!solutionBackendRef.current) return;
    setLoading(true);
    try {
      const data: Issue | undefined | null =
        await solutionBackendRef.current.fetchIssue(issueId);
      if (!data) return;
      setIssue(data);
    } catch (error) {
      setError('Failed to load issues. Please try again later.');
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async (processId: string): Promise<void> => {
    if (!solutionBackendRef.current) return;
    setLoading(true);
    try {
      const data: Process | undefined | null =
        await solutionBackendRef.current.fetchProcess(processId);
      if (!data) return;
      setProcess(data);
    } catch (error) {
      setError('Failed to load issues. Please try again later.');
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect((): void => {
    void authService
      .getUser()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Failed to get user:', error);
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!solutionBackendRef.current) {
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

  useEffect((): void => {
    if (user) {
      void fetchData(id).catch((error) => {
        console.error('Failed to fetch process data:', error);
      });
    }
  }, [user, id, fetchData]);

  useEffect((): void => {
    if (process?.issue) {
      void fetchIssue(process.issue).catch((error) => {
        console.error('Failed to fetch issue:', error);
      });
    }
  }, [process, fetchIssue]);

  return (
    <>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <ProcessMergeForm
            onSubmit={submitHandler}
            isOpen={openDialog}
            source={process?.id ?? ''}
            destination={issue?.process ?? ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Card variant="outlined" sx={{ margin: 1, width: '100%' }}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={handleDialogOpen}>
              <ForkLeftIcon />
            </IconButton>
          }
          title={
            <MuiLink
              color="primary"
              component={RouterLink}
              to={`/processes/${process?.id}`}
              underline="none"
            >
              <Typography>{process?.id}</Typography>
            </MuiLink>
          }
          subheader={process?.timestamp?.toLocaleString() ?? ''}
        />

        <ProcessCardContent solution={true}>
          <FormattedTextDisplay htmlContent={process?.data ?? ''} />
        </ProcessCardContent>
      </Card>
    </>
  );
};

export default ProcessCardInlineSimple;
