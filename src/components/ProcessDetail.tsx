import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Box, Container, CircularProgress } from '@mui/material';
import {
  Process,
  Issue,
  IssuesResponse,
  SolutionService,
} from '../services/SolutionsService';
import { RTMSData, RTMSEvent, RTMSService } from '../services/RTMSService';
import { User } from 'oidc-client-ts';
import { authService } from '../utils/oidc';

import ProcessCardDetail from './ProcessCardDetail';
import IssueCard from './IssueCard';

const pageSize = 10;

const ProcessDetail: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [process, setProcess] = useState<Process | undefined>(undefined);
  const [processId, setProcessId] = useState<string>('');

  const [user, setUser] = useState<User | null>(null);

  const [update, setUpdate] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [olderPage, setOlderPage] = useState<number>(0);
  const [newerPage, setNewerPage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const issuesEndRef = useRef<HTMLDivElement | null>(null);
  const issuesStartRef = useRef<HTMLDivElement | null>(null);

  const solutionBackendRef = useRef<SolutionService | null>(null);
  const rtmsServiceRef = useRef<RTMSService | null>(null);

  const olderPageRef = useRef(olderPage);

  useEffect((): void => {
    console.log(process);
    console.log(count);
    console.log(pageCount);
    console.log(newerPage);
    console.log(error);
  }, [process, count, pageCount, newerPage, error]);

  const location = useLocation();
  useEffect((): void => {
    const id = location.pathname.split('/').pop();
    if (id) {
      setProcessId(id);
    }
  }, [location]);

  const extractPageNumber = (url: string | null): number => {
    if (!url) return 0;
    const match = RegExp(/page=(\d+)/).exec(url);
    return match ? parseInt(match[1], 10) : 1;
  };

  useEffect((): void => {
    scrollToBottom();
  }, []);

  const scrollToBottom = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect((): (() => void) | void => {
    if (!user) return;
    if (!solutionBackendRef.current) {
      const n = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
      solutionBackendRef.current = n;
      setPage(1);
    }

    return () => {
      if (solutionBackendRef.current) {
        console.log('ProcessList => Unmount => SolutionsService');
        solutionBackendRef.current = null;
      }
    };
  }, [user]);

  useEffect((): void => {
    if (!user) return;
    if (processId === '') return;

    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const data: Process | undefined | null =
          await solutionBackendRef.current?.fetchProcess(processId);
        console.log('Fetched data:', data);
        if (!data) return;

        setProcess(data);
      } catch (error) {
        setError('Failed to load issues. Please try again later.');
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch((error) => {
      console.error('Error in fetchData:', error);
    });
  }, [processId, user, solutionBackendRef, update]);

  const updateProcess = useCallback((pid: string) => {
    setUpdate((prevUpdate) => prevUpdate + 1);
    console.log('update process:', pid);
  }, []);

  useEffect((): void => {
    if (processId === '') return;
    if (!user) return;
    if (!solutionBackendRef.current) return;

    const fetchData = async (): Promise<void> => {
      console.log('ProcessList => FetchMasterProcesses=> Page: ', page);
      setLoading(true);

      try {
        const data: IssuesResponse | undefined | null =
          await solutionBackendRef.current?.fetchIssues(processId, page);
        console.log('Fetched data:', data);
        if (!data) return;

        if (data.results.length === 0) return;
        setIssues((prev) => {
          const messageMap = new Map<string, Issue>();
          prev.forEach((message) => messageMap.set(message.id, message));
          data.results.forEach((message) =>
            messageMap.set(message.id, message)
          );
          return Array.from(messageMap.values()).sort();
        });
        const nextOlderPage = extractPageNumber(data.next);
        const nextNewerPage = extractPageNumber(data.previous);

        console.log(
          'ProcessList => useEffect => FetchData => Data => Next: ',
          data.next
        );
        console.log(
          'ProcessList => useEffect => FetchData => Data => Previous: ',
          data.previous
        );
        console.log(
          'ProcessList => useEffect => FetchData => NextOlderPage',
          nextOlderPage
        );
        console.log(
          'ProcessList => useEffect => FetchData => NextNewerPage',
          nextNewerPage
        );

        if (data.next !== null) {
          setOlderPage(nextOlderPage);
          olderPageRef.current = nextOlderPage;
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
    };

    fetchData().catch((error) => {
      console.error('Error in fetchData:', error);
    });
  }, [page, processId, solutionBackendRef, user]);

  useEffect((): void => {
    authService
      .getUser()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Failed to get user:', error);
      });
  }, []);

  const addIssue = (iid: string): void => {
    const n: Issue = {
      id: iid,
      timestamp: new Date(),
    };

    setIssues((current: Issue[]): Issue[] => {
      const exists = current.some((i) => i.id === iid);
      if (!exists) {
        return [...current, n].sort((a, b) => {
          const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return aTime - bTime;
        });
      }
      return current;
    });
  };

  useEffect((): (() => void) | void => {
    if (!user) return;
    if (processId === '') return;
    if (!rtmsServiceRef.current) {
      const rtms = new RTMSService(processId, user.access_token);

      rtms.onConnected((receivedMessage: RTMSData): void => {
        console.log(
          'Services => RTMSService => OnConnected => Message: ',
          receivedMessage
        );
      });

      rtms.onDisconnected((receivedMessage: RTMSData): void => {
        console.log(
          'Services => RTMSService => OnDisconnected => Message: ',
          receivedMessage
        );
      });

      rtms.onData((events: RTMSEvent[]): void => {
        events.forEach((e) => {
          console.log('ProcessDetail => RTMS => OnData => Event: ', e);
          if (e.type === 'delete') {
            console.log('ProcessDetail => RTMS => Delete => Event: ', e);
          }
          if (e.type === 'add') {
            console.log('ProcessDetail => RTMS => Delete => Event: ', e);
            if (e.data.context === 'issue') {
              addIssue(e.data.id);
            }
          }
          if (e.type === 'update') {
            console.log('ProcessDetail => RTMS => Delete => Event: ', e);
            if (e.data.context === 'process') {
              updateProcess(e.data.id);
            }
          }
        });
      });

      rtms.connect();
      rtmsServiceRef.current = rtms;
    }

    return () => {
      if (rtmsServiceRef.current) {
        console.log('Services => RTMS => Disconnect: ');
        rtmsServiceRef.current.disconnect();
        rtmsServiceRef.current = null;
      }
    };
  }, [user, processId, updateProcess]);

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              maxHeight: 600,
              flexDirection: 'column',
              border: '2px solid darkgrey',
              borderRadius: '4px',
              overflow: 'hidden',
              background: '#CFD8DC',
              position: 'relative',
            }}
          >
            {loading ? (
              <Box
                sx={{
                  background: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  height: '600px',
                  m: 1,
                }}
              >
                <ProcessCardDetail id={processId}></ProcessCardDetail>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              maxHeight: 600,
              overflowY: 'auto',
              border: '2px solid darkgrey',
              borderRadius: '4px',
              background: '#CFD8DC',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                scrollBehavior: 'smooth',
              }}
              ref={scrollContainerRef}
            >
              <div>
                <div ref={issuesStartRef} />

                {issues.map((c) => (
                  <IssueCard key={c.id} id={c.id} />
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

export default ProcessDetail;
