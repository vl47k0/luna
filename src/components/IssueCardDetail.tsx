import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import MuiAlert from "@mui/material/Alert";

import { Link as RouterLink } from "react-router-dom";
import { Process, Issue, SolutionService } from "../services/SolutionsService";
import { BookmarkService } from "../services/BookmarkService";
import { CoreMasterService, UserInfo } from "../services/CoreMasterService";

import { authService } from "../utils/oidc";
import { User } from "oidc-client-ts";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";

import AddIcon from "@mui/icons-material/Add";
import { ProcessInputForm, ProcessForm } from "./ProcessInputForm";
import FormattedTextDisplay from "./FormattedTextDisplay";
import IssueTreeComponent from "./IssueTreeComponent";
import UserSelectionDialog from "./UserSelectionDialog";

import { RTMSEvent, RTMSService } from "../services/RTMSService";

const COREMASTER_BACKEND_URL =
  import.meta.env.VITE_COREMASTER_API_URL ?? "https://dev.api-sod.com/core/v1";

interface IssueCardProps {
  id: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onClose: (id: string) => void;
  onAddProcess: (p: Process) => void;
}

const IssueCardDetail: React.FC<IssueCardProps> = ({
  id,
  onClose,
  onDelete,
  onEdit,
  onAddProcess,
}) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [memberDetails, setMemberDetails] = useState<UserInfo[]>([]);
  const [adminDetails, setAdminDetails] = useState<UserInfo[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const solutionBackendRef = useRef<SolutionService | null>(null);
  const coreMasterServiceRef = useRef<CoreMasterService | null>(null);
  const bookmarkServiceRef = useRef<BookmarkService | null>(null);
  const rtmsServiceRef = useRef<RTMSService | null>(null);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openIssueTreeDialog, setOpenIssueTreeDialog] =
    useState<boolean>(false);
  const [openUserSelectionDialog, setOpenUserSelectionDialog] =
    useState<boolean>(false);
  const [openAdminSelectionDialog, setOpenAdminSelectionDialog] =
    useState<boolean>(false);

  const broadcast = (e: RTMSEvent): void => {
    if (!rtmsServiceRef.current) return;
    rtmsServiceRef.current.sendMessage(e);
  };

  const handleIssueTreeDialogOpen = (): void => {
    setOpenIssueTreeDialog(true);
  };

  const handleIssueTreeDialogClose = (): void => {
    setOpenIssueTreeDialog(false);
  };

  const handleDialogOpen = (): void => {
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  const handleUserSelectionOpen = (): void => {
    setOpenUserSelectionDialog(true);
  };

  const handleUserSelectionClose = (): void => {
    setOpenUserSelectionDialog(false);
  };

  const handleAdminSelectionOpen = (): void => {
    setOpenAdminSelectionDialog(true);
  };

  const handleAdminSelectionClose = (): void => {
    setOpenAdminSelectionDialog(false);
  };

  const handleUsersSelected = async (
    selectedUsers: UserInfo[]
  ): Promise<void> => {
    if (!issue || !solutionBackendRef.current) return;

    const memberIds = selectedUsers.map((u) => u.userId);
    const updatedIssue = await solutionBackendRef.current.issueUpdateMembers(
      issue,
      memberIds
    );

    if (updatedIssue) {
      setIssue(updatedIssue);
      setMemberDetails(selectedUsers);
      setSnackbarMsg("Members updated successfully!");
      setSnackbarSeverity("success");
      onClose(issue.id);
    } else {
      setSnackbarMsg("Failed to update members.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
    handleUserSelectionClose();
  };

  const handleAdminsSelected = async (
    selectedAdmins: UserInfo[]
  ): Promise<void> => {
    if (!issue || !solutionBackendRef.current) return;

    const adminIds = selectedAdmins.map((u) => u.userId);
    const updatedIssue = await solutionBackendRef.current.issueUpdateAdmins(
      issue,
      adminIds
    );

    if (updatedIssue) {
      setIssue(updatedIssue);
      setAdminDetails(selectedAdmins);
      setSnackbarMsg("Administrators updated successfully!");
      setSnackbarSeverity("success");
      onClose(issue.id);
    } else {
      setSnackbarMsg("Failed to update administrators.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
    handleAdminSelectionClose();
  };

  const handleEditClick = (): void => {
    onEdit(id);
  };

  const handleAddBookmark = async (): Promise<void> => {
    if (!bookmarkServiceRef.current) return;
    const currentUrl = window.location.href;
    try {
      const added = await bookmarkServiceRef.current.addLink({
        title: issue?.title ?? "Untitled",
        href: currentUrl,
      });
      if (added) {
        setSnackbarMsg("Bookmark saved!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMsg("Failed to save bookmark.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Failed to add bookmark:", error);
      setSnackbarMsg("Error adding bookmark.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const processSent = (process: Process): void => {
    onAddProcess(process);
    broadcast({
      data: { id: process.id, command: "add", context: "process" },
      type: "add",
    });
  };

  const submitHandler = (form: ProcessForm, issueId: string): void => {
    void handleSubmit(form, issueId);
  };

  const handleSubmit = async (
    form: ProcessForm,
    issueId: string
  ): Promise<void> => {
    if (!solutionBackendRef.current) return;
    await solutionBackendRef.current.addProcess(
      issueId,
      form.text,
      form.filenames,
      processSent
    );
    setOpenDialog(false);
  };

  const fetchUserDetails = useCallback(
    async (userIds: string[]): Promise<UserInfo[]> => {
      if (!coreMasterServiceRef.current || userIds.length === 0) return [];
      try {
        const userPromises = userIds.map(async (userId) => {
          const userData = await coreMasterServiceRef.current!.findUsers({
            userId,
          });
          if (userData && "userId" in userData) {
            return userData;
          }
          return null;
        });

        const users = await Promise.all(userPromises);
        return users.filter((u): u is UserInfo => u !== null);
      } catch (error) {
        console.error("Failed to fetch user details with findUsers", error);
        return [];
      }
    },
    []
  );

  const fetchData = useCallback(async (issueId: string): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      const issueData = await solutionBackendRef.current.fetchIssue(issueId);
      if (issueData) {
        setIssue(issueData);
      }
    } catch (error) {
      console.error("Failed to load issue details.", error);
    }
  }, []);

  useEffect(() => {
    if (issue) {
      const fetchAllDetails = async (): Promise<void> => {
        const adminUserIds = issue.admin ?? [];
        const memberUserIds = issue.members ?? [];

        const [adminData, memberData] = await Promise.all([
          fetchUserDetails(adminUserIds),
          fetchUserDetails(memberUserIds),
        ]);

        setAdminDetails(adminData);
        setMemberDetails(memberData);
      };
      void fetchAllDetails();
    }
  }, [issue, fetchUserDetails]);

  useEffect((): (() => void) => {
    let isMounted = true;
    void authService.getUser().then((userData: User | null) => {
      if (userData && isMounted) {
        solutionBackendRef.current = new SolutionService(
          import.meta.env.VITE_BACKEND_API_URL,
          userData.access_token
        );
        coreMasterServiceRef.current = new CoreMasterService(
          COREMASTER_BACKEND_URL
        );
        coreMasterServiceRef.current.setAuthToken(userData.access_token);
        bookmarkServiceRef.current = new BookmarkService(
          import.meta.env.VITE_BACKEND_API_URL,
          userData.access_token
        );
        void fetchData(id);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [id, fetchData]);

  const extractFileName = (url: string): string => {
    return url.split("/").pop() ?? url;
  };

  return (
    <>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <ProcessInputForm onSubmit={submitHandler} issue={id} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openIssueTreeDialog} onClose={handleIssueTreeDialogClose}>
        <DialogContent>
          <IssueTreeComponent issueId={issue?.id ?? ""} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIssueTreeDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UserSelectionDialog
        open={openUserSelectionDialog}
        onClose={handleUserSelectionClose}
        onSubmit={(users) => void handleUsersSelected(users)}
        title="Select Members"
        initialSelection={memberDetails}
      />

      <UserSelectionDialog
        open={openAdminSelectionDialog}
        onClose={handleAdminSelectionClose}
        onSubmit={(admins) => void handleAdminsSelected(admins)}
        title="Select Administrators"
        initialSelection={adminDetails}
      />

      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          }
          title={issue?.title}
          subheader={issue?.timestamp?.toLocaleString() ?? ""}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            height: 400,
            overflow: "auto",
          }}
        >
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={handleDialogOpen}
          >
            <AddIcon />
          </Fab>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormattedTextDisplay htmlContent={issue?.description ?? ""} />
            </Grid>
            <Grid item xs={12}>
              <List>
                {issue?.assets?.map((asset, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <MuiLink
                        href={asset}
                        download={extractFileName(asset)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {extractFileName(asset)}
                      </MuiLink>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          disableSpacing
          sx={{
            justifyContent: "flex-start",
          }}
        >
          <MuiLink
            color="primary"
            component={RouterLink}
            to={issue?.process ? `/processes/${issue.process}` : "/issues/"}
            underline="none"
          >
            <IconButton aria-label="go-to-process">
              <ArrowUpwardIcon />
            </IconButton>
          </MuiLink>

          <IconButton
            aria-label="view-tree"
            onClick={handleIssueTreeDialogOpen}
          >
            <AccountTreeIcon />
          </IconButton>

          <IconButton aria-label="share">
            <ShareIcon />
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
            aria-label="Select Members"
            onClick={handleUserSelectionOpen}
          >
            <GroupIcon />
          </IconButton>
          <IconButton
            aria-label="Select Administrators"
            onClick={handleAdminSelectionOpen}
          >
            <AdminPanelSettingsIcon />
          </IconButton>
          <IconButton aria-label="Delete" onClick={() => onDelete(id)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbarSeverity}>
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default IssueCardDetail;
