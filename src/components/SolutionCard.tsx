import React, { useEffect, useState, useRef } from 'react';
import { List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  Process,
  Solution,
  SolutionService,
} from '../services/SolutionsService';

import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

import ProcessCardInline from './ProcessCardInline';
import SolutionHeader from './SolutionHeader';

interface SolutionCardProps {
  id: string;
  onMerger: (process: Process) => void;
  onCloneSubmit?: (
    sourceSolution: string,
    integrationType: string,
    selectedIssue: string,
    selectedProcesses: string[]
  ) => void;
}

const SolutionCard: React.FC<SolutionCardProps> = ({
  id,
  onMerger,
  onCloneSubmit,
}) => {
  const navigate = useNavigate();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const solutionBackendRef = useRef<SolutionService | null>(null);

  const fetchData = async (solutionId: string): Promise<void> => {
    console.log('SolutionCard will fetch solution id:', solutionId);
    if (!solutionBackendRef.current) return;
    console.log('SolutionCard hasBackend');
    try {
      const data: Solution | undefined | null =
        await solutionBackendRef.current.fetchSolution(solutionId);
      console.log('SolutionCard fetchData Data:', data);
      if (!data) return;
      console.log('SolutionCard fetchData Data:', data);
      setSolution(data);
    } catch (error) {
      console.error('SolutionCard fetchData failed to fetch solution:', error);
    }
  };

  useEffect(() => {
    void authService.getUser().then((data) => {
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      console.log('SolutionCard hasUser');
      if (!solutionBackendRef.current) {
        console.log('SolutionCard will make New solutionBackend');
        solutionBackendRef.current = new SolutionService(
          'https://mars.georgievski.net/',
          user.access_token
        );
      }
      console.log('SolutionCard will fetchData');
      void fetchData(id);
    }
  }, [user, id]);

  const handleCloneSubmit = async (
    sourceSoluiton: string,
    integrationType: string,
    selectedIssue: string,
    selectedProcesses: string[]
  ): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      const data = await solutionBackendRef.current.cloneSolution(
        sourceSoluiton,
        integrationType,
        selectedIssue,
        selectedProcesses
      );
      console.log(data);
      navigate(`/issues/${selectedIssue}`);
    } catch (error) {
      console.error('Error cloning processes:', error);
    }
  };

  return (
    <List
      subheader={
        <SolutionHeader
          sourceSolution={solution?.id ?? ''}
          processes={solution?.processes ?? []}
          onCloneSubmit={onCloneSubmit ?? handleCloneSubmit}
        />
      }
    >
      {solution?.processes?.map((process) => (
        <ListItem key={process}>
          <ProcessCardInline id={process} onProcessMerged={onMerger} />
        </ListItem>
      ))}
    </List>
  );
};

export default SolutionCard;
