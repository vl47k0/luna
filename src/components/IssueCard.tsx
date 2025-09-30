import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Link as MuiLink,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Solution,
  Issue,
  Process,
  SolutionService,
  ClonedIssueResponse,
} from '../services/SolutionsService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';
import SolutionCard from './SolutionCard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTheme } from '@mui/material/styles';

interface IssueCardProps {
  id: string;
}

const IssueCard: React.FC<IssueCardProps> = ({ id }) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [processes, setProcesses] = useState<Process[]>([]);

  const [selectedProcess, setSelectedProcess] = useState<string>('');

  const theme = useTheme();

  const navigate = useNavigate();

  const handleProcessChange = (event: SelectChangeEvent<string>): void => {
    const processID = event.target.value;
    setSelectedProcess(processID);
  };

  const fetchIssueSolution = useCallback(
    async (issueId: string): Promise<void> => {
      if (!solutionBackendRef.current || !issueId) return;
      setLoading(true);
      try {
        const data =
          await solutionBackendRef.current.fetchIssueSolution(issueId);
        if (data) {
          setSolution(data);
        }
      } catch (error) {
        setError('Failed to load solution. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchData = useCallback(async (issueId: string): Promise<void> => {
    if (!solutionBackendRef.current) return;
    setLoading(true);
    try {
      const data = await solutionBackendRef.current.fetchIssue(issueId);
      if (data) {
        setIssue(data);
      }
    } catch (error) {
      setError('Failed to load issue. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProcessData = useCallback(async (): Promise<void> => {
    if (!solutionBackendRef.current) return;
    console.log('Issue Card Will be fetching Processes');
    setLoading(true);
    try {
      const data = await solutionBackendRef.current.fetchMasterProcesses(1);
      if (data) {
        setProcesses(data.results);
      }
    } catch (error) {
      setError('Failed to load processes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    authService
      .getUser()
      .then(setUser)
      .catch(() => setError('Failed to authenticate user.'));
  }, []);

  useEffect(() => {
    if (user) {
      if (!solutionBackendRef.current) {
        solutionBackendRef.current = new SolutionService(
          'https://mars.georgievski.net/',
          user.access_token
        );
      }
      void fetchData(id);
      void fetchProcessData();
    }
  }, [user, id, fetchData, fetchProcessData]);

  useEffect(() => {
    if (issue) {
      void fetchIssueSolution(issue.id);
    }
  }, [issue, fetchIssueSolution]);

  const handleOpenDialog = (): void => {
    console.log('Dialog opened');
    setOpen(true);
  };

  const handleIssueCloneSubmit = async (): Promise<
    ClonedIssueResponse | undefined
  > => {
    if (!solutionBackendRef.current) return;
    try {
      if (issue) {
        const data = await solutionBackendRef.current.cloneIssue(
          issue,
          selectedProcess
        );
        if (data) {
          console.log(data);

          navigate(`/issues/${data.cloned_issue_id}`);
        }
      }
    } catch (error) {
      console.error('Error cloning processes:', error);
    }
  };

  return (
    <Card variant="outlined" sx={{ margin: 1 }}>
      <CardHeader
        action={
          <IconButton aria-label="clone issue" onClick={handleOpenDialog}>
            <ContentCopyIcon style={{ color: theme.palette.primary.main }} />
          </IconButton>
        }
        title={
          <MuiLink
            color="primary"
            component={RouterLink}
            to={`/issues/${issue?.id}`}
            underline="none"
          >
            <Typography variant="h5" component="div">
              {issue?.title}
              {loading && 'loading...'}
              {error && <h1>{error}</h1>}
            </Typography>
          </MuiLink>
        }
        subheader={
          issue?.timestamp ? new Date(issue.timestamp).toLocaleString() : ''
        }
      />

      <CardContent>
        <Typography variant="body2" color="textSecondary">
          ID: {issue?.id}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Timestamp:{' '}
          {issue?.timestamp ? new Date(issue.timestamp).toLocaleString() : ''}
        </Typography>
        {solution && (
          <SolutionCard id={solution.id} onMerger={() => undefined} />
        )}
      </CardContent>
      <CardActions />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Replicate Issue</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Destination Process:</Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel></InputLabel>
            <Select value={selectedProcess} onChange={handleProcessChange}>
              {processes.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography>ID: {issue?.id}</Typography>
          <Typography>Title: {issue?.title}</Typography>
          <Typography>Description: {issue?.description}</Typography>
          {solution && (
            <>
              <Typography variant="h6">Solution</Typography>
              <Typography>Solution ID: {solution.id}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => void handleIssueCloneSubmit()}
          >
            Replicate
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default IssueCard;
