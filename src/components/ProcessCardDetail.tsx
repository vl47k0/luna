import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Fab,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { Link as RouterLink } from "react-router-dom";
import { Issue, Process, SolutionService } from "../services/SolutionsService";
import { authService } from "../utils/oidc";
import { User } from "oidc-client-ts";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { red } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddIcon from "@mui/icons-material/Add";

import { IssueInputForm, IssueForm } from "./IssueInputForm";
import { ProcessEditForm, ProcessUpdateForm } from "./ProcessEditForm";
//import EmailCard from './EmailCard';
import FormattedTextDisplay from "./FormattedTextDisplay";

import { RTMSData, RTMSEvent, RTMSService } from "../services/RTMSService";

interface ProcessCardDetailProps {
  id: string;
}

const ProcessCardDetail: React.FC<ProcessCardDetailProps> = ({ id }) => {
  const [process, setProcess] = useState<Process | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);
  const rtmsServiceRef = useRef<RTMSService | null>(null);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openProcessEditDialog, setOpenProcessEditDialog] =
    useState<boolean>(false);

  const handleProcessEditDialogOpen = (): void => {
    console.log(error);
    console.log(loading);
    setOpenProcessEditDialog(true);
  };

  const handleProcessEditDialogClose = (): void => {
    setOpenProcessEditDialog(false);
  };

  const handleDialogOpen = (): void => {
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  const processUpdated = (process: Process): void => {
    console.log("Process Update Success: ", process);
    broadcast({
      data: { id: process.id, command: "update", context: "process" },
      type: "update",
    });
  };

  const updateProcessHandler = (form: ProcessUpdateForm): void => {
    handleUpdateProcess(form).catch((error) => {
      setError("Failed to get UserPlease try again later.");
      console.error("Failed to get user:", error);
    });
  };

  const handleUpdateProcess = async (
    form: ProcessUpdateForm
  ): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      if (process) {
        const p: Process = process;
        p.data = form.text;
        p.assets = form.filenames;
        await solutionBackendRef.current.updateProcess(p, processUpdated);
      }
    } catch (error) {
      console.error("Failed to create issue:", error);
    } finally {
      setOpenProcessEditDialog(false);
    }
  };

  const submitHandler = (form: IssueForm): void => {
    handleSubmit(form).catch((error) => {
      setError("Failed to get UserPlease try again later.");
      console.error("Failed to get user:", error);
    });
  };

  const handleSubmit = async (form: IssueForm): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      const newIssue: Issue | null = await solutionBackendRef.current.addIssue({
        process: process?.id,
        title: form.title,
        description: form.text,
        assets: form.filenames,
        constraints: form.constraints,
      });
      setOpenDialog(false);
      if (newIssue) {
        broadcast({
          data: { id: newIssue.id, command: "add", context: "issue" },
          type: "add",
        });
      }
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  const fetchData = async (processId: string): Promise<void> => {
    if (!solutionBackendRef.current) return;
    setLoading(true);
    try {
      const data: Process | undefined | null =
        await solutionBackendRef.current.fetchProcess(processId);
      if (!data) return;
      setProcess(data);
    } catch (error) {
      setError("Failed to load process. Please try again later.");
      console.error("Failed to fetch process:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!user) return;
    if (!solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        "https://mars.georgievski.net/",
        user.access_token
      );
    }
    return (): void => {
      if (solutionBackendRef.current) {
        solutionBackendRef.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    void fetchData(id);
  }, [user, id]);

  const extractFileName = (url: string): string => {
    return url.split("/").pop() ?? url;
  };

  const broadcast = (e: RTMSEvent): void => {
    if (!rtmsServiceRef.current) return;
    rtmsServiceRef.current.sendMessage(e);
    console.log("ProcessCardDetail=> Broadcast => Process:", process);
    console.log("ProcessCardDetail => Broadcast => Event:", e);
  };

  useEffect(() => {
    const initializeRTMSService = (): void => {
      if (!rtmsServiceRef.current && user) {
        const rtms = new RTMSService(id, user.access_token);

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
              console.log("ProcessCardDetail => RTMS => Delete => Event: ", e);
            }
            if (e.type === "add") {
              console.log("ProcessCardDetail => RTMS => Add => Event: ", e);
            }
            if (e.type === "update") {
              console.log("ProcessCardDetail=> RTMS => Update => Event: ", e);
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
  }, [user, id]);

  return (
    <>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <IssueInputForm onSubmit={submitHandler} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openProcessEditDialog}
        onClose={handleProcessEditDialogClose}
      >
        <DialogContent>
          <ProcessEditForm
            proc={process}
            onSubmit={updateProcessHandler}
          ></ProcessEditForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProcessEditDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"></Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <EditIcon onClick={handleProcessEditDialogOpen}></EditIcon>
            </IconButton>
          }
          //title={<EmailCard id={process?.owner ?? ''}></EmailCard>}
          title={process?.owner ?? ""}
          subheader={process?.timestamp?.toLocaleString() ?? ""}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            height: 400,
            overflow: "auto",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <FormattedTextDisplay
                htmlContent={process?.data ?? ""}
              ></FormattedTextDisplay>
            </Grid>
            <Grid item xs={12} md={12}>
              <List
                subheader={
                  <ListSubheader
                    component="div"
                    id="nested-list-subheader"
                  ></ListSubheader>
                }
              >
                {process?.assets?.map((asset, index) => (
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

          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={handleDialogOpen}
          >
            <AddIcon />
          </Fab>
        </CardContent>
        <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
          <Box>
            <MuiLink
              color="primary"
              component={RouterLink}
              to={process?.issue ? `/issues/${process.issue}` : "#"}
              underline="none"
            >
              <IconButton aria-label="share">
                <ArrowUpwardIcon></ArrowUpwardIcon>
              </IconButton>
            </MuiLink>

            <IconButton aria-label="share">
              <AccountTreeIcon></AccountTreeIcon>
            </IconButton>
          </Box>
          <Box>
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </>
  );
};

export default ProcessCardDetail;
