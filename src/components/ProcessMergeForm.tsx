import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Grid, Typography, CircularProgress } from '@mui/material';
import { Process, SolutionService } from '../services/SolutionsService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';
import FileUpload from './FileUpload';
import { RTMSData, RTMSEvent, RTMSService } from '../services/RTMSService';

export interface ProcessUpdateForm {
  text: string;
  filenames: string[];
}

export interface ProcessEditFormProps {
  onSubmit: (form: ProcessUpdateForm) => void;
  isOpen: boolean;
  source: string;
  destination: string;
}

const ProcessMergeForm: React.FC<ProcessEditFormProps> = ({
  onSubmit,
  isOpen,
  source,
  destination,
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [merger, setMerger] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceProcess, setSourceProcess] = useState<Process | null>(null);
  const [destinationProcess, setDestinationProcess] = useState<Process | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);

  const rtmsServiceRef = useRef<RTMSService | null>(null);

  const initializeBackendService = useCallback(async (): Promise<void> => {
    const authenticatedUser = await authService.getUser();
    setUser(authenticatedUser);
    if (authenticatedUser && !solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        authenticatedUser.access_token
      );
    }
  }, []);

  const fetchSourceData = useCallback(
    async (processId: string): Promise<void> => {
      if (!solutionBackendRef.current) return;
      setLoading(true);
      try {
        const result: Process | undefined | null =
          await solutionBackendRef.current.fetchProcess(processId);
        if (!result) return;
        setSourceProcess(result);
        console.log('ProcessMergeForm => SourceProcess: ', result);
      } catch (error) {
        setError('Failed to load source process. Please try again later.');
        console.error('Failed to fetch source process:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDestinationData = useCallback(
    async (processId: string): Promise<void> => {
      if (!solutionBackendRef.current) return;
      setLoading(true);
      try {
        const result: Process | undefined | null =
          await solutionBackendRef.current.fetchProcess(processId);
        if (!result) {
          console.log(
            'ProcessMergeForm => DestinationProcess: No Result',
            result
          );
          return;
        }
        setDestinationProcess(result);
        console.log('ProcessMergeForm => DestinationProcess: ', result);
      } catch (error) {
        setError('Failed to load destination process. Please try again later.');
        console.error('Failed to fetch destination process:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

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

  useEffect((): void => {
    if (!user) {
      console.log('ProcessMergeForm => No User: ', user);
      return;
    }
    if (!solutionBackendRef.current) {
      console.log('ProcessMergeForm => No Backend => Make New: ');
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
    }
  }, [user]);

  const handleDataChange = (value: string): void => {
    setMerger(value);
  };

  const handleFileUpload = (fileUrl: string): void => {
    setFiles((prevFiles) => [...prevFiles, fileUrl]);
  };

  const broadcast = (e: RTMSEvent): void => {
    if (rtmsServiceRef.current) {
      rtmsServiceRef.current.sendMessage(e);
    }
  };

  const handleSubmit = (): void => {
    const toUpload: ProcessUpdateForm = {
      text: merger,
      filenames: files,
    };

    onSubmit(toUpload);
    if (destinationProcess) {
      broadcast({
        data: {
          id: destinationProcess.id,
          command: 'update',
          context: 'process',
        },
        type: 'update',
      });
    }
  };

  useEffect((): void => {
    if (sourceProcess && destinationProcess) {
      const mergedData = `${sourceProcess.data}${destinationProcess.data}`;
      const mergedFiles = Array.from(
        new Set([
          ...(sourceProcess.assets ?? []),
          ...(destinationProcess.assets ?? []),
        ])
      );
      console.log('ProcessMergeForm => MergedData', mergedData);
      console.log('ProcessMergeForm => MergedFiles', mergedFiles);
      setMerger(mergedData);
      setFiles(mergedFiles);
    }
  }, [sourceProcess, destinationProcess]);

  useEffect((): void => {
    if (isOpen) {
      void initializeBackendService().then(() => {
        if (solutionBackendRef.current) {
          void fetchSourceData(source);
          void fetchDestinationData(destination);
        }
      });
    }
  }, [
    isOpen,
    initializeBackendService,
    fetchSourceData,
    fetchDestinationData,
    source,
    destination,
  ]);

  useEffect((): void => {
    if (!isOpen) {
      console.log('ProcessMergeForm => UseEffect => Resetting ');
      setFiles([]);
      setMerger('');
      setSourceProcess(null);
      setDestinationProcess(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const initializeRTMSService = (): void => {
      if (!rtmsServiceRef.current && user && destinationProcess) {
        const rtms = new RTMSService(destinationProcess.id, user.access_token);

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
            if (e.type === 'update') {
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
  }, [user, destinationProcess]);

  return (
    <Grid container spacing={3}>
      {loading && (
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        </Grid>
      )}
      {error && (
        <Grid item xs={12}>
          <Box color="error.main" textAlign="center">
            {error}
          </Box>
        </Grid>
      )}
      <Grid item xs={12} sm={12} md={12}>
        <Box
          sx={{
            border: '1px dashed #ccc',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <FileUpload onFileUpload={handleFileUpload} />
          {files.length > 0 ? (
            <ul>
              {files.map((file: string, index: number) => (
                <li key={file}>
                  <Typography variant="body2">
                    {index}: {file}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">No files uploaded yet.</Typography>
          )}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <ReactQuill
          value={merger}
          onChange={handleDataChange}
          placeholder="Enter your text here"
          style={{ height: '200px', marginBottom: '20px' }}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              ['link', 'image'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
            ],
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ marginTop: '20px' }}
          disabled={loading}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProcessMergeForm;
