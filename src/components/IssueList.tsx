import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Fab,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  Issue,
  IssuesResponse,
  SolutionService,
} from "../services/SolutionsService";
import { User } from "oidc-client-ts";
import { authService } from "../utils/oidc";
import AddIcon from "@mui/icons-material/Add";
import { IssueInputForm, IssueForm } from "./IssueInputForm";
import IssueCard from "./IssueCard";

const pageSize = 10;

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);

  const fetchData = useCallback(async (page: number): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      const data: IssuesResponse | undefined | null =
        await solutionBackendRef.current.fetchMasterIssues(page);
      if (!data) return;

      setIssues(data.results);
      setPageCount(Math.ceil(data.count / pageSize));
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        "https://mars.georgievski.net/",
        user.access_token
      );
    }
    void fetchData(page); // Marked as intentionally ignored.
    return (): void => {
      if (solutionBackendRef.current) {
        solutionBackendRef.current = null;
      }
    };
  }, [user, page, fetchData]);

  useEffect(() => {
    authService
      .getUser()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Failed to get user:", error);
      });
  }, []);

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ): void => {
    console.log("Page changed:", value); // Debug log
    setPage(value);
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
      void fetchData(page); // Marked as intentionally ignored.
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  const submitHandler = (form: IssueForm): void => {
    handleSubmit(form).catch((error) => {
      console.error("Failed to get user:", error);
    });
  };

  const handleDialogOpen = (): void => {
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  useEffect(() => {
    console.log("Issues updated:", issues); // Debug log
  }, [issues]);

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
              overflowY: "auto",
              border: "2px solid darkgrey",
              borderRadius: "4px",
              background: "#CFD8DC",
            }}
          >
            <Box
              m={1}
              sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                scrollBehavior: "smooth",
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
        sx={{ position: "fixed", bottom: 16, right: 16 }}
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

export default IssueList;
