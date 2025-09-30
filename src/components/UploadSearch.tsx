import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Grid,
  Box,
  Container,
  Fab,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
} from '@mui/material';
import {
  Issue,
  IssuesResponse,
  SolutionService,
} from '../services/SolutionsService';
import { User } from 'oidc-client-ts';
import { authService } from '../utils/oidc';
import AddIcon from '@mui/icons-material/Add';
import { IssueInputForm, IssueForm } from './IssueInputForm';
import IssueCard from './IssueCard';

const pageSize = 10;

const UploadSearch: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [olderPage, setOlderPage] = useState<number>(0);
  const [newerPage, setNewerPage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);

  const extractPageNumber = (url: string | null): number => {
    if (!url) return 0;
    const match = RegExp(/page=(\d+)/).exec(url);
    return match ? parseInt(match[1], 10) : 1;
  };

  useEffect(() => {
    console.log(error, loading, newerPage, count, olderPage);
  }, [error, loading, newerPage, count, olderPage]);

  const fetchData = useCallback(async (page: number): Promise<void> => {
    if (!solutionBackendRef.current) return;
    setLoading(true);
    try {
      const data: IssuesResponse | undefined | null =
        await solutionBackendRef.current.fetchIssues(
          '5e7331ca-27c6-4d82-ab29-403ff49e2e99',
          page
        );
      if (!data) return;

      setIssues((prev) => {
        const issueMap = new Map<string, Issue>();
        prev.forEach((issue) => issueMap.set(issue.id, issue));
        data.results.forEach((issue) => issueMap.set(issue.id, issue));
        return Array.from(issueMap.values()).sort();
      });
      const nextOlderPage = extractPageNumber(data.next);
      const nextNewerPage = extractPageNumber(data.previous);

      if (data.next !== null) {
        setOlderPage(nextOlderPage);
      } else {
        setOlderPage(page);
      }
      setNewerPage(nextNewerPage);

      setCount(data.count);
      setPageCount(Math.ceil(data.count / pageSize));
    } catch (error) {
      setError('Failed to load issues. Please try again later.');
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!user) return;
    if (!solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
      setPage(1);
    }
    return (): void => {
      if (solutionBackendRef.current) {
        solutionBackendRef.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    void fetchData(page);
  }, [page, fetchData]);

  useEffect(() => {
    void authService.getUser().then((data) => {
      setUser(data);
    });
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ): void => {
    console.log(event);
    setPage(value);
  };

  const submitHandler = (form: IssueForm): void => {
    handleSubmit(form).catch((error) => {
      setError('Failed to get UserPlease try again later.');
      console.error('Failed to get user:', error);
    });
  };

  const handleSubmit = async (form: IssueForm): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      await solutionBackendRef.current.addMasterIssue({
        title: form.title,
        description: form.text,
        assets: form.filenames,
        constraints: form.constraints,
      });
      void fetchData(page);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  const handleDialogOpen = (): void => {
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box
            m={1}
            p={1}
            sx={{
              maxHeight: 600,
              overflowY: 'auto',
              border: '2px solid darkgrey',
              borderRadius: '4px',
              background: '#CFD8DC',
            }}
          >
            <Box
              m={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                scrollBehavior: 'smooth',
              }}
              ref={scrollContainerRef}
            >
              <div>
                {issues.map((c) => (
                  <IssueCard key={c.id} id={c.id} />
                ))}
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleDialogOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <IssueInputForm onSubmit={submitHandler} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UploadSearch;
