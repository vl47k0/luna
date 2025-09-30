import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Link as MuiLink,
  Snackbar,
} from '@mui/material';

import MuiAlert from '@mui/material/Alert';

import { red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';

import {
  Issue,
  IssuesResponse,
  Process,
  Solution,
  Signature,
  Verification,
  SolutionService,
} from '../services/SolutionsService';

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { BookmarkService } from '../services/BookmarkService';

import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailCard from './EmailCard';
import CheckIcon from '@mui/icons-material/Check';
import VerifiedIcon from '@mui/icons-material/Verified';
import ApprovalIcon from '@mui/icons-material/Approval';

import FormattedTextDisplay from './FormattedTextDisplay';
import ForkDownRight from './ForkDownRight';

interface ProcessCardProps {
  id: string;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ id }) => {
  const [process, setProcess] = useState<Process | null | undefined>(null);
  const [user, setUser] = useState<User | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const solutionBackendRef = useRef<SolutionService | null>(null);
  const bookmarkServiceRef = useRef<BookmarkService | null>(null);
  const theme = useTheme();

  const navigate = useNavigate();
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [availableIssues, setAvailableIssues] = useState<Issue[]>([]);

  const handleAddBookmark = async (): Promise<void> => {
    if (!bookmarkServiceRef.current) return;

    try {
      const added = await bookmarkServiceRef.current.addLink({
        title: process?.data ?? 'Untitled',
        href: `/processes/${process?.id}`,
      });

      if (added) {
        console.log('Bookmark added:', added);
        setSnackbarMsg('Bookmark saved!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMsg('Failed to save bookmark.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      setSnackbarMsg('Error adding bookmark.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const fetchData = useCallback(async (processId: string): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      const data: Process | undefined | null =
        await solutionBackendRef.current.fetchProcess(processId);
      if (data) {
        setProcess(data);
      }
    } catch (error) {
      console.error('Failed to fetch process:', error);
    }
  }, []);

  useEffect(() => {
    authService
      .getUser()
      .then((data) => setUser(data))
      .catch((e) => console.error('Failed to get user:', e));
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!solutionBackendRef.current && user) {
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
    }
    if (!bookmarkServiceRef.current) {
      bookmarkServiceRef.current = new BookmarkService(
        'https://mars.georgievski.net/',
        user.access_token
      );
    }
    return (): void => {
      solutionBackendRef.current = null;
      bookmarkServiceRef.current = null;
    };
  }, [user]);

  const fetchIssuesData = useCallback(async (page: number): Promise<void> => {
    if (!solutionBackendRef.current) return;
    console.log(page);
    try {
      const data: IssuesResponse | undefined | null =
        await solutionBackendRef.current.fetchMasterIssues(page);
      if (!data) return;

      setAvailableIssues(data.results);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    }
  }, []);

  useEffect(() => {
    if (user && id) {
      void fetchData(id);
      void fetchIssuesData(1);
    }
  }, [user, id, fetchData, fetchIssuesData]);

  const solveIssue = async (): Promise<void> => {
    if (!solutionBackendRef.current || !process) return;
    try {
      setProcess((prevProc) =>
        prevProc ? { ...prevProc, solution: true } : prevProc
      );
      const s: Solution | null = await solutionBackendRef.current.solveIssue(
        process.issue ?? '',
        process.id
      );
      console.log(s);
    } catch (error) {
      console.error('Failed to solve issue:', error);
    }
  };

  const signProcess = async (): Promise<void> => {
    if (!solutionBackendRef.current || !process) return;
    try {
      setProcess((prevProc) =>
        prevProc ? { ...prevProc, signed: true } : prevProc
      );
      const s: Signature | null = await solutionBackendRef.current.signProcess(
        process.id
      );
      console.log(s);
    } catch (error) {
      console.error('Failed to sign process:', error);
    }
  };

  const verifyProcess = async (): Promise<void> => {
    if (!solutionBackendRef.current || !process) return;
    try {
      setProcess((prevProc) =>
        prevProc ? { ...prevProc, verified: true } : prevProc
      );
      const s: Verification | null =
        await solutionBackendRef.current.verifyProcess(process.id);
      console.log(s);
    } catch (error) {
      console.error('Failed to verify process:', error);
    }
  };

  const handleCloneProcess = async (): Promise<void> => {
    if (!solutionBackendRef.current || !process || !selectedIssue) return;
    try {
      const clonedProcess: Process | null =
        await solutionBackendRef.current.cloneProcess(
          selectedIssue,
          process.id
        );
      console.log('Cloned Process:', clonedProcess);
      navigate(`/issues/${selectedIssue}`);
    } catch (error) {
      console.error('Failed to clone process:', error);
    } finally {
      setCloneDialogOpen(false);
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ margin: 1 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {process?.owner?.charAt(0) ?? ''}
            </Avatar>
          }
          action={
            <MuiLink
              color="primary"
              component={RouterLink}
              to={`/processes/${process?.id}`}
              underline="none"
            >
              <IconButton aria-label="settings">
                <ForkDownRight />
              </IconButton>
            </MuiLink>
          }
          title={<EmailCard id={process?.owner ?? ''} />}
          subheader={process?.timestamp?.toLocaleString() ?? ''}
        />

        <CardContent>
          <FormattedTextDisplay htmlContent={process?.data ?? ''} />{' '}
        </CardContent>

        <CardActions>
          <IconButton aria-label="solve" onClick={() => void solveIssue()}>
            <CheckIcon
              style={{
                color: process?.solution
                  ? theme.palette.primary.main
                  : 'defaultColor',
              }}
            />
          </IconButton>

          <IconButton aria-label="sign" onClick={() => void signProcess()}>
            <ApprovalIcon
              style={{
                color: process?.signed
                  ? theme.palette.primary.main
                  : 'defaultColor',
              }}
            />
          </IconButton>

          <IconButton aria-label="verify" onClick={() => void verifyProcess()}>
            <VerifiedIcon
              style={{
                color: process?.verified
                  ? theme.palette.primary.main
                  : 'defaultColor',
              }}
            />
          </IconButton>
          <IconButton
            aria-label="bookmark"
            onClick={() => {
              void handleAddBookmark();
            }}
          >
            <BookmarkAddIcon />
          </IconButton>

          <IconButton
            aria-label="clone"
            onClick={() => {
              setCloneDialogOpen(true);
            }}
          >
            <ContentCopyIcon style={{ color: theme.palette.primary.main }} />
          </IconButton>
        </CardActions>

        <Dialog
          open={cloneDialogOpen}
          onClose={() => setCloneDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Clone Process</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Select Issue</InputLabel>
                <Select
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                >
                  {availableIssues.map((issue) => (
                    <MenuItem key={issue.id} value={issue.id}>
                      {issue.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCloneDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => void handleCloneProcess()}
              color="primary"
              variant="contained"
              disabled={!selectedIssue}
            >
              Reuse
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbarSeverity}>
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ProcessCard;
