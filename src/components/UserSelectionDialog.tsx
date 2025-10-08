import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { User } from 'oidc-client-ts';
import { CoreMasterService, UserInfo } from '../services/CoreMasterService';
import { authService } from '../utils/oidc';

interface UserSelectionDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (selectedUsers: UserInfo[]) => void;
  initialSelection?: UserInfo[];
}

const BACKEND_URL = 'https://dev.api-sod.com/core/v1';

const UserSelectionDialog: React.FC<UserSelectionDialogProps> = ({
  open,
  title,
  onClose,
  onSubmit,
  initialSelection = [],
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const coreMasterServiceRef = useRef<CoreMasterService | null>(null);

  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setSearchResults([]);
      setSelectedUsers(initialSelection);
      setError(null);
    }
  }, [open, initialSelection]);

  useEffect(() => {
    void authService.getUser().then(setUser).catch(console.error);
  }, []);

  useEffect(() => {
    if (user && !coreMasterServiceRef.current) {
      coreMasterServiceRef.current = new CoreMasterService(BACKEND_URL);
      // The user's access token from OIDC is needed for CoreMasterService
      coreMasterServiceRef.current.setAuthToken(user.access_token);
    }
  }, [user]);

  const handleSearch = async (): Promise<void> => {
    if (!coreMasterServiceRef.current || !searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const responseData = await coreMasterServiceRef.current.findUsers({
        userCode: searchTerm,
      });

      let users: UserInfo[] = [];
      if (responseData) {
        if ('records' in responseData && Array.isArray(responseData.records)) {
          users = responseData.records;
        } else if ('userId' in responseData) {
          users = [responseData];
        }
      }
      setSearchResults(users);
      if (users.length === 0) {
        setError('No users found.');
      }
    } catch (err) {
      setError('Failed to search for users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = (userToToggle: UserInfo): void => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((su) => su.userId === userToToggle.userId);
      if (isSelected) {
        return prev.filter((su) => su.userId !== userToToggle.userId);
      } else {
        return [...prev, userToToggle];
      }
    });
  };

  const handleSubmit = (): void => {
    onSubmit(selectedUsers);
    onClose();
  };

  const displayedUsers = React.useMemo(() => {
    const userMap = new Map<string, UserInfo>();
    initialSelection.forEach((user) => userMap.set(user.userId, user));
    searchResults.forEach((user) => userMap.set(user.userId, user));
    return Array.from(userMap.values());
  }, [initialSelection, searchResults]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
          <TextField
            label="Search by User Code"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') void handleSearch();
            }}
            fullWidth
          />
          <Button
            onClick={() => {
              void handleSearch();
            }}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          {displayedUsers.map((userResult) => {
            const isSelected = selectedUsers.some(
              (su) => su.userId === userResult.userId
            );
            return (
              <ListItem
                key={userResult.userId}
                button
                onClick={() => handleToggleUser(userResult)}
              >
                <Checkbox checked={isSelected} />
                <ListItemText
                  primary={userResult.attributes.name ?? userResult.userCode}
                  secondary={`ID: ${userResult.userId}`}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSelectionDialog;
