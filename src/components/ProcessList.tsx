import React from 'react';
import {
  Grid,
  Box,
  Container,
  CircularProgress,
  Pagination,
  Alert,
} from '@mui/material';
import {
  Process,
  ProcessesResponse,
  SolutionService,
} from '../services/SolutionsService';
import { User } from 'oidc-client-ts';
import { authService } from '../utils/oidc';
import ProcessCard from './ProcessCard';

const pageSize = 10;

const ProcessList: React.FC = () => {
  const [processes, setProcesses] = React.useState<Process[]>([]);
  const [user, setUser] = React.useState<User | null>(null);

  const issuesEndRef = React.useRef<HTMLDivElement | null>(null);
  const issuesStartRef = React.useRef<HTMLDivElement | null>(null);
  const solutionBackendRef = React.useRef<SolutionService | null>(null);

  const [page, setPage] = React.useState<number>(0); // 0 initially, will become 1 once service is ready
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [olderPage, setOlderPage] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const olderPageRef = React.useRef<number>(olderPage);

  const extractPageNumber = (url: string | null): number => {
    if (!url) return 0;
    const match = /[?&]page=(\d+)/.exec(url);
    return match ? Number.parseInt(match[1], 10) : 1;
  };

  const scrollToBottom = (): void => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  React.useEffect((): void => {
    scrollToBottom();
  }, []);

  React.useEffect((): (() => void) | void => {
    if (!user) return;

    if (!solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
      setPage(1);
    }

    return (): void => {
      solutionBackendRef.current = null;
    };
  }, [user]);

  React.useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      if (!solutionBackendRef.current || page <= 0) return;

      setLoading(true);
      setError(null);

      try {
        const data: ProcessesResponse | undefined | null =
          await solutionBackendRef.current.fetchMasterProcesses(page);

        if (!data) {
          setProcesses([]);
          setPageCount(0);
          return;
        }

        setProcesses((prev) => {
          const byId = new Map<string, Process>();
          prev.forEach((p) => byId.set(p.id, p));
          data.results.forEach((p) => byId.set(p.id, p));
          return Array.from(byId.values()).sort((a, b) =>
            a.id.localeCompare(b.id)
          );
        });

        const nextOlderPage = extractPageNumber(data.next);
        // const nextNewerPage = extractPageNumber(data.previous); // removed: unused

        if (data.next !== null) {
          setOlderPage(nextOlderPage);
          olderPageRef.current = nextOlderPage;
        } else {
          setOlderPage(page);
        }

        setPageCount(Math.ceil(data.count / pageSize));
      } catch (err: unknown) {
        setError('Failed to load processes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [page]);

  React.useEffect((): void => {
    void authService.getUser().then((u) => setUser(u));
  }, []);

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          {loading ? (
            <Box
              sx={{
                background: 'white',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                py: 2,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <Pagination
                count={pageCount}
                page={Math.max(page, 1)}
                onChange={handlePageChange}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} md={12}>
          <Box
            m={1}
            sx={{
              maxHeight: 600,
              overflowY: 'auto',
              border: '2px solid darkgrey',
              borderRadius: '4px',
              overflow: 'hidden',
              background: '#CFD8DC',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                overflowY: 'hidden',
                flexDirection: 'column',
                position: 'relative',
                scrollBehavior: 'smooth',
              }}
              ref={scrollContainerRef}
            >
              <div>
                <div ref={issuesStartRef} />
                {processes.map((c) => (
                  <ProcessCard key={c.id} id={c.id} />
                ))}
                <div ref={issuesEndRef} />
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProcessList;
