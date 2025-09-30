import React from 'react';
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';

interface SelectUsersProps {
  open: boolean;
  onClose: () => void;
}

const SelectUsers: React.FC<SelectUsersProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Users</DialogTitle>
      <DialogContent sx={{ width: '300px', height: '200px' }}>
        <p>Select users here</p>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SelectUsers;
