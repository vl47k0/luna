import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import CloneProcessForm from './CloneProcessForm';

interface SolutionHeaderProps {
  sourceSolution: string;
  processes: string[];
  onCloneSubmit: (
    sourceSolution: string,
    integrationType: string,
    selectedIssue: string,
    selectedProcesses: string[]
  ) => void;
}

const SolutionHeader: React.FC<SolutionHeaderProps> = ({
  sourceSolution,
  processes,
  onCloneSubmit,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const handleCloneSubmit = (
    sourceSolution: string,
    integrationType: string,
    selectedIssue: string,
    selectedProcesses: string[]
  ): void => {
    try {
      onCloneSubmit(
        sourceSolution,
        integrationType,
        selectedIssue,
        selectedProcesses
      );
      handleClose();
    } catch (error) {
      console.error('Error cloning solution:', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '8px 16px',
        }}
      >
        <Typography variant="subtitle1">Solutions</Typography>
        <Button variant="outlined" size="small" onClick={handleOpen}>
          Adapt
        </Button>
      </Box>

      {/* Popup Dialog for Cloning */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Adapt Processes</DialogTitle>
        <DialogContent>
          <CloneProcessForm
            sourceSolution={sourceSolution}
            processes={processes}
            onSubmit={handleCloneSubmit}
          />
          {/* FIX: Correctly pass the function */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SolutionHeader;
