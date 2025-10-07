import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { CoreMasterService, UserInfo } from '../services/CoreMasterService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';

interface UserSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (users: UserInfo[]) => void;
}

const UserSelectionDialog: React.FC<UserSelectionDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const coreMasterServiceRef = useRef<CoreMasterService | null>(null);

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

  useEffect(() => {
    if (user && !coreMasterServiceRef.current) {
      coreMasterServiceRef.current = new CoreMasterService(
        'https://dev.api-sod.com/core-api/'
      );
      coreMasterServiceRef.current.setAuthToken(user.access_token);
    }
    return (): void => {
      if (coreMasterServiceRef.current) {
        coreMasterServiceRef.current = null;
      }
    };
  }, [user]);

  const handleSearch = async (): Promise<void> => {
    if (!coreMasterServiceRef.current || !searchValue.trim()) {
      setError('Please enter a user ID or email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to fetch user by ID first
      const userData = await coreMasterServiceRef.current.getUser(searchValue);

      // Check if user is already in the list
      const isAlreadyAdded = selectedUsers.some(
        (u) => u.userId === userData.userId
      );

      if (isAlreadyAdded) {
        setError('User already added to the list');
      } else {
        setSelectedUsers([...selectedUsers, userData]);
        setSearchValue('');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setError('User not found. Please check the ID or email.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = (userId: string): void => {
    setSelectedUsers(selectedUsers.filter((u) => u.userId !== userId));
  };

  const handleSubmit = (): void => {
    onSubmit(selectedUsers);
    handleClose();
  };

  const handleClose = (): void => {
    setSearchValue('');
    setSelectedUsers([]);
    setError(null);
    onClose();
  };

  const getDisplayName = (userInfo: UserInfo): string => {
    const firstName = userInfo.attributes.firstName as string | undefined;
    const lastName = userInfo.attributes.lastName as string | undefined;

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    if (firstName) return firstName;
    if (lastName) return lastName;

    return userInfo.userCode;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Users</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Search Input */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="User ID or Email"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  void handleSearch();
                }
              }}
              disabled={loading}
              placeholder="Enter user ID or email"
            />
            <IconButton
              color="primary"
              onClick={() => void handleSearch()}
              disabled={loading || !searchValue.trim()}
            >
              {loading ? <CircularProgress size={24} /> : <AddIcon />}
            </IconButton>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Selected Users List */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Selected Users ({selectedUsers.length})
            </Typography>
            {selectedUsers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No users selected yet
              </Typography>
            ) : (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {selectedUsers.map((userInfo) => (
                  <ListItem
                    key={userInfo.userId}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveUser(userInfo.userId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={getDisplayName(userInfo)}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            ID: {userInfo.userId}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Code: {userInfo.userCode}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={selectedUsers.length === 0}
        >
          Add Users ({selectedUsers.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSelectionDialog;
