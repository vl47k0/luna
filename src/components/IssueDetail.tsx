import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, CircularProgress } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  Process,
  Issue,
  ProcessesResponse,
  SolutionService,
} from "../services/SolutionsService";
import { RTMSData, RTMSEvent, RTMSService } from "../services/RTMSService";
import { User } from "oidc-client-ts";
import { authService } from "../utils/oidc";

import IssueCardDetail from "./IssueCardDetail";
import ProcessCard from "./ProcessCard";

const pageSize = 10;

const IssueDetail: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [issue, setIssue] = useState<Issue>();
  const [issueId, setIssueId] = useState<string>("");

  const [user, setUser] = useState<User | null>(null);

  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [olderPage, setOlderPage] = useState<number>(0);
  const [newerPage, setNewerPage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const processesEndRef = useRef<HTMLDivElement | null>(null);
  const processesStartRef = useRef<HTMLDivElement | null>(null);

  const solutionBackendRef = useRef<SolutionService | null>(null);
  const rtmsServiceRef = useRef<RTMSService | null>(null);

  const location = useLocation();

  useEffect((): void => {
    console.log(count, pageCount, newerPage, error, olderPage);
  }, [count, pageCount, newerPage, error, olderPage]);

  useEffect((): void => {
    const id = location.pathname.split("/").pop();
    if (id) {
      setIssueId(id);
    }
  }, [location]);

  const extractPageNumber = (url: string | null): number => {
    if (!url) return 0;
    const match = RegExp(/page=(\d+)/).exec(url);
    return match ? parseInt(match[1], 10) : 1;
  };

  useEffect((): void => {
    scrollToBottom();
  }, [processes]);

  useEffect((): void => {
    console.log(issue);
  }, [issue]);

  const scrollToBottom = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const initializeSolutionService = (): void => {
      if (!solutionBackendRef.current && user) {
        const n = new SolutionService(
          import.meta.env.VITE_BACKEND_API_URL,
          user.access_token
        );
        solutionBackendRef.current = n;
        setPage(1);
      }
    };

    initializeSolutionService();

    return (): void => {
      if (solutionBackendRef.current) {
        console.log("ProcessList => Unmount => SolutionsService");
        solutionBackendRef.current = null;
      }
    };
  }, [user]);

  const addProcess = (pid: string): void => {
    const n: Process = {
      id: pid,
      timestamp: new Date(),
    };

    setProcesses((current: Process[]): Process[] => {
      const exists = current.some((proc) => proc.id === pid);
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

  useEffect((): void => {
    if (!user || !issueId) return;

    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const data: Issue | undefined | null =
          await solutionBackendRef.current?.fetchIssue(issueId);
        console.log("Fetched data:", data);
        if (data) {
          setIssue(data);
        }
      } catch (error) {
        setError("Failed to load issues. Please try again later.");
        console.error("Failed to fetch issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch((error) => {
      setError("Failed to load issues. Please try again later.");
      console.error("Failed to fetch issues:", error);
    });
  }, [issueId, user]);

  useEffect((): void => {
    if (!issueId || !user || !solutionBackendRef.current) return;

    const fetchData = async (): Promise<void> => {
      console.log("ProcessList => FetchMasterProcesses=> Page: ", page);
      setLoading(true);

      try {
        const data: ProcessesResponse | undefined | null =
          await solutionBackendRef.current?.fetchProcesses(issueId, page);
        console.log("Fetched data:", data);
        if (data) {
          setProcesses((prev) => {
            const messageMap = new Map<string, Process>();
            prev.forEach((message) => messageMap.set(message.id, message));
            data.results.forEach((message) =>
              messageMap.set(message.id, message)
            );
            return Array.from(messageMap.values()).sort();
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
        }
      } catch (error) {
        setError("Failed to load issues. Please try again later.");
        console.error("Failed to fetch issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch((error) => {
      setError("Failed to load issues. Please try again later.");
      console.error("Failed to fetch issues:", error);
    });
  }, [page, issueId, user]);

  useEffect((): void => {
    authService
      .getUser()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Failed to get user:", error);
      });
  }, []);

  useEffect(() => {
    if (!user || !issueId) return;

    const initializeRTMSService = (): void => {
      if (!rtmsServiceRef.current) {
        const rtms = new RTMSService(issueId, user.access_token);

        rtms.onConnected((receivedMessage: RTMSData): void => {
          console.log(
            "Services => RTMSService => OnConnected => Message: ",
            receivedMessage
          );
        });

        rtms.onDisconnected((receivedMessage: RTMSData): void => {
          console.log(
            "Services => RTMSService => OnDisconnected => Message: ",
            receivedMessage
          );
        });

        rtms.onData((events: RTMSEvent[]): void => {
          events.forEach((e): void => {
            console.log("Services => RTMS => OnData => Event: ", e);
            if (e.type === "delete") {
              console.log("Services => RTMS => Delete => Event: ", e);
            }
            if (e.type === "add") {
              console.log("Services => RTMS => Add => Event: ", e);
              if (e.data.context === "process") {
                addProcess(e.data.id);
                scrollToBottom();
              }
            }
            if (e.type === "update") {
              console.log("Services => RTMS => Update => Event: ", e);
            }
          });
        });

        rtms.connect();
        rtmsServiceRef.current = rtms;
      }
    };

    initializeRTMSService();

    return (): void => {
      if (rtmsServiceRef.current) {
        console.log("Services => RTMS => Disconnect: ");
        rtmsServiceRef.current.disconnect();
        rtmsServiceRef.current = null;
      }
    };
  }, [user, issueId]);

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              maxHeight: 600,
              flexDirection: "column",
              border: "2px solid darkgrey",
              borderRadius: "4px",
              background: "#CFD8DC",
              position: "relative",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  background: "white",
                  height: "600px",
                  display: "flex",
                  overflow: "hidden",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  height: "600px",
                  m: 1,
                }}
              >
                <IssueCardDetail
                  key={issueId}
                  id={issueId}
                  onDelete={(): void => {
                    console.log("onDelete");
                  }}
                  onClose={(): void => {
                    console.log("onClose");
                  }}
                  onEdit={(): void => {
                    console.log("onEdit");
                  }}
                  onAddProcess={(p: Process): void => {
                    console.log("addProcess", p);
                  }}
                />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              maxHeight: 600,
              overflowY: "auto",
              border: "2px solid darkgrey",
              borderRadius: "4px",
              background: "#CFD8DC",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
                scrollBehavior: "smooth",
              }}
              ref={scrollContainerRef}
            >
              <div>
                <div ref={processesStartRef} />

                {processes.map((c) => (
                  <ProcessCard key={c.id} id={c.id} />
                ))}
                <div ref={processesEndRef} />
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IssueDetail;
