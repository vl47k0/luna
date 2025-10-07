import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { authService } from '../utils/oidc';
import { CoreMasterService, UserInfo } from '../services/CoreMasterService';

const BACKEND_URL = 'https://dev.api-sod.com/core/v1';

type SearchField = 'userId' | 'userCode';

const UserSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<SearchField>('userId');

  const handleSearch = async (): Promise<void> => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const user = await authService.getUser();
      if (!user?.access_token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      const service = new CoreMasterService(BACKEND_URL);
      service.setAuthToken(user.access_token);

      const searchParams = { [searchField]: searchTerm };
      const responseData = await service.findUsers(searchParams);

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
        setError('No users found for the given criteria.');
      }
    } catch (err) {
      console.error('Failed to find users:', err);
      setError('Failed to search for users. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (event: SelectChangeEvent<SearchField>): void => {
    setSearchField(event.target.value as SearchField);
    setSearchTerm('');
    setError(null);
    setSearchResults([]);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Find CoreMaster User
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Search by</InputLabel>
            <Select
              value={searchField}
              onChange={handleFieldChange}
              label="Search by"
            >
              <MenuItem value="userId">User ID</MenuItem>
              <MenuItem value="userCode">User Code</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={`Enter ${searchField === 'userId' ? 'User ID' : 'User Code'}`}
            variant="outlined"
            value={searchTerm}
            onChange={(e): void => setSearchTerm(e.target.value)}
            onKeyPress={(e): void => {
              if (e.key === 'Enter') void handleSearch();
            }}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={(): void => {
              void handleSearch();
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>

        {error && !loading && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <List>
          {searchResults.length > 0 &&
            searchResults.map((user) => (
              <ListItem key={user.userId} divider>
                <ListItemText
                  primary={user.attributes.name ?? user.userCode}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <strong>Description:</strong>{' '}
                        {user.attributes.description ?? 'N/A'}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        <strong>ID:</strong> {user.userId}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserSearch;
