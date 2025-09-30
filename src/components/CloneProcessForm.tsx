import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

import { User } from 'oidc-client-ts';
import { authService } from '../utils/oidc';
//import ProcessCardInlineSimple from './ProcessCardInlineSimple';

import {
  Issue,
  IssuesResponse,
  SolutionService,
} from '../services/SolutionsService';

interface CloneProcessFormProps {
  sourceSolution: string;
  processes: string[];
  onSubmit: (
    sourceSolution: string,
    integrationType: string,
    selectedIssue: string,
    selectedProcesses: string[]
  ) => void;
}

const CloneProcessForm: React.FC<CloneProcessFormProps> = ({
  sourceSolution,
  processes,
  onSubmit,
}) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedIntegrationType, setSelectedIntegrationType] =
    useState<string>('');
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);

  const solutionBackendRef = useRef<SolutionService | null>(null);

  const handleIssueChange = (event: SelectChangeEvent<string>): void => {
    setSelectedIssue(event.target.value);
  };

  const fetchData = useCallback(async (page: number): Promise<void> => {
    if (!solutionBackendRef.current) return;
    console.log(page);
    try {
      const data: IssuesResponse | undefined | null =
        await solutionBackendRef.current.fetchMasterIssues(page);
      if (!data) return;

      setIssues(data.results);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    console.log(user);
    if (!solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
    }
    void fetchData(1);
    return (): void => {
      if (solutionBackendRef.current) {
        solutionBackendRef.current = null;
      }
    };
  }, [user, fetchData]);

  useEffect(() => {
    authService
      .getUser()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Failed to get user:', error);
      });
  }, []);

  // Handle process selection via checkboxes
  const handleProcessToggle = (processId: string): void => {
    setSelectedProcesses((prevSelected) =>
      prevSelected.includes(processId)
        ? prevSelected.filter((id) => id !== processId)
        : [...prevSelected, processId]
    );
  };

  return (
    <Box>
      <Typography variant="subtitle1">Destination Issue:</Typography>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel></InputLabel>
        <Select value={selectedIssue} onChange={handleIssueChange}>
          {issues.map((issue) => (
            <MenuItem key={issue.id} value={issue.id}>
              {issue.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="subtitle1">Select Processes to Clone:</Typography>
      {processes.map((process) => (
        <FormControlLabel
          key={process}
          control={
            <Checkbox
              checked={selectedProcesses.includes(process)}
              onChange={() => handleProcessToggle(process)}
            />
          }
          label={process}
        />
      ))}

      {/*
      <Typography variant="subtitle1">
        Select Processes Card to Clone:
      </Typography>
      {processes.map((process) => (
        <ProcessCardInlineSimple
          key={process}
          id={process}
          onProcessSelected={() => handleProcessToggle(process)}
        />
      ))}
      */}

      <Typography variant="subtitle1">Integration Type:</Typography>
      <FormControlLabel
        key={1}
        control={
          <Checkbox
            onChange={() => setSelectedIntegrationType('concatenate')}
          />
        }
        label={'concatenate'}
      />

      <FormControlLabel
        key={1}
        control={
          <Checkbox onChange={() => setSelectedIntegrationType('respective')} />
        }
        label={'respective'}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() =>
          onSubmit(
            sourceSolution,
            selectedIntegrationType,
            selectedIssue,
            selectedProcesses
          )
        }
        disabled={!selectedIssue || selectedProcesses.length === 0}
        sx={{ marginTop: 2 }}
      >
        Reuse
      </Button>
    </Box>
  );
};

export default CloneProcessForm;
