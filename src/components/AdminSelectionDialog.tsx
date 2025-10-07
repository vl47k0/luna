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

interface AdminSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (admins: UserInfo[]) => void;
}

const AdminSelectionDialog: React.FC<AdminSelectionDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedAdmins, setSelectedAdmins] = useState<UserInfo[]>([]);
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

      // Check if admin is already in the list
      const isAlreadyAdded = selectedAdmins.some(
        (u) => u.userId === userData.userId
      );

      if (isAlreadyAdded) {
        setError('Administrator already added to the list');
      } else {
        setSelectedAdmins([...selectedAdmins, userData]);
        setSearchValue('');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setError('User not found. Please check the ID or email.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = (userId: string): void => {
    setSelectedAdmins(selectedAdmins.filter((u) => u.userId !== userId));
  };

  const handleSubmit = (): void => {
    onSubmit(selectedAdmins);
    handleClose();
  };

  const handleClose = (): void => {
    setSearchValue('');
    setSelectedAdmins([]);
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
      <DialogTitle>Select Administrators</DialogTitle>
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

          {/* Selected Administrators List */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Selected Administrators ({selectedAdmins.length})
            </Typography>
            {selectedAdmins.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No administrators selected yet
              </Typography>
            ) : (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {selectedAdmins.map((admin) => (
                  <ListItem
                    key={admin.userId}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveAdmin(admin.userId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={getDisplayName(admin)}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            ID: {admin.userId}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Code: {admin.userCode}
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
          disabled={selectedAdmins.length === 0}
        >
          Add Administrators ({selectedAdmins.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminSelectionDialog;
