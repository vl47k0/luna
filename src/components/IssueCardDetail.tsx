import React, { useEffect, useState, useRef } from 'react';
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
  Grid,
  Fab,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { Link as RouterLink } from 'react-router-dom';
import { Process, Issue, SolutionService } from '../services/SolutionsService';
import { BookmarkService } from '../services/BookmarkService';
import { UserInfo } from '../services/CoreMasterService';

import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

import AddIcon from '@mui/icons-material/Add';
import { ProcessInputForm, ProcessForm } from './ProcessInputForm';
import FormattedTextDisplay from './FormattedTextDisplay';
import IssueTreeComponent from './IssueTreeComponent';
import UserSelectionDialog from './UserSelectionDialog';
import AdminSelectionDialog from './AdminSelectionDialog';

import { RTMSData, RTMSEvent, RTMSService } from '../services/RTMSService';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const solutionBackendRef = useRef<SolutionService | null>(null);
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
    console.log('IssueCardDetail=> Broadcast => Issue:', issue);
    console.log('IssueCardDetail => Broadcast => Event:', e);
  };

  const handleIssueTreeDialogOpen = (): void => {
    console.log(loading, error);
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

  const handleUsersSelected = (users: UserInfo[]): void => {
    console.log('IssueCardDetail => Selected Members:', users);
    users.forEach((user) => {
      console.log('IssueCardDetail => Member User ID:', user.userId);
      console.log('IssueCardDetail => Member User Code:', user.userCode);
      console.log(
        'IssueCardDetail => Member User Attributes:',
        user.attributes
      );
      console.log(
        'IssueCardDetail => Full Member User Object:',
        JSON.stringify(user, null, 2)
      );
    });

    console.log('IssueCardDetail => Calling onClose with issue ID:', id);
    onClose(id);

    setSnackbarMsg(`${users.length} member(s) selected successfully!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleAdminsSelected = (admins: UserInfo[]): void => {
    console.log('IssueCardDetail => Selected Administrators:', admins);
    admins.forEach((admin) => {
      console.log('IssueCardDetail => Admin User ID:', admin.userId);
      console.log('IssueCardDetail => Admin User Code:', admin.userCode);
      console.log(
        'IssueCardDetail => Admin User Attributes:',
        admin.attributes
      );
      console.log(
        'IssueCardDetail => Full Admin User Object:',
        JSON.stringify(admin, null, 2)
      );
    });

    console.log('IssueCardDetail => Setting administrators for issue ID:', id);

    setSnackbarMsg(`${admins.length} administrator(s) selected successfully!`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleEditClick = (): void => {
    console.log('IssueCardDetail => Edit button clicked for issue ID:', id);
    console.log('IssueCardDetail => Current issue data:', issue);
    console.log('IssueCardDetail => Calling onEdit with issue ID:', id);
    onEdit(id);
  };

  const handleAddBookmark = async (): Promise<void> => {
    if (!bookmarkServiceRef.current) return;

    const currentUrl = window.location.href;

    try {
      const added = await bookmarkServiceRef.current.addLink({
        title: issue?.title ?? 'Untitled',
        href: currentUrl,
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

  const processSent = (process: Process): void => {
    console.log(process);
    onAddProcess(process);
    broadcast({
      data: { id: process.id, command: 'add', context: 'process' },
      type: 'add',
    });
  };

  const submitHandler = (form: ProcessForm, issue: string): void => {
    handleSubmit(form, issue).catch((error) => {
      setError('Failed to get UserPlease try again later.');
      console.error('Failed to get user:', error);
    });
  };

  const handleSubmit = async (
    form: ProcessForm,
    issue: string
  ): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      await solutionBackendRef.current.addProcess(
        issue,
        form.text,
        form.filenames,
        processSent
      );
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  useEffect(() => {
    const initializeRTMSService = (): void => {
      if (!rtmsServiceRef.current && user) {
        const rtms = new RTMSService(id, user.access_token);

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
          events.forEach((e): void => {
            console.log('Services => RTMS => OnData => Event: ', e);
            if (e.type === 'delete') {
              console.log('Services => RTMS => Delete => Event: ', e);
            }
            if (e.type === 'add') {
              console.log('Services => RTMS => Add => Event: ', e);
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
        console.log('Services => RTMS => Disconnect: ');
        rtmsServiceRef.current.disconnect();
        rtmsServiceRef.current = null;
      }
    };
  }, [user, id]);

  const fetchData = async (issueId: string): Promise<void> => {
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
  };

  useEffect((): void => {
    authService
      .getUser()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        setError('Failed to get UserPlease try again later.');
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

  useEffect((): void => {
    void fetchData(id);
  }, [user, id]);

  const extractFileName = (url: string): string => {
    return url.split('/').pop() ?? url;
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
          <IssueTreeComponent issueId={issue?.id ?? ''}></IssueTreeComponent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIssueTreeDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UserSelectionDialog
        open={openUserSelectionDialog}
        onClose={handleUserSelectionClose}
        onSubmit={handleUsersSelected}
      />

      <AdminSelectionDialog
        open={openAdminSelectionDialog}
        onClose={handleAdminSelectionClose}
        onSubmit={handleAdminsSelected}
      />

      <Card
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          }
          title={issue?.title}
          subheader={issue?.timestamp?.toLocaleString() ?? ''}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            height: 400,
            overflow: 'auto',
          }}
        >
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleDialogOpen}
          >
            <AddIcon />
          </Fab>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <FormattedTextDisplay
                htmlContent={issue?.description ?? ''}
              ></FormattedTextDisplay>
            </Grid>
            <Grid item xs={12} md={12}>
              <List>
                {issue?.assets?.map((asset, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <MuiLink
                        href={asset}
                        download={asset}
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
            justifyContent: 'flex-start',
          }}
        >
          <MuiLink
            color="primary"
            component={RouterLink}
            to={issue?.process ? `/processes/${issue.process}` : '/issues/'}
            underline="none"
          >
            <IconButton aria-label="share">
              <ArrowUpwardIcon></ArrowUpwardIcon>
            </IconButton>
          </MuiLink>

          <IconButton aria-label="share" onClick={handleIssueTreeDialogOpen}>
            <AccountTreeIcon></AccountTreeIcon>
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
            <AdminPanelSettingsIcon></AdminPanelSettingsIcon>
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbarSeverity}>
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default IssueCardDetail;
