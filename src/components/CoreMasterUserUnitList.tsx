import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { authService } from '../utils/oidc';
import {
  CoreMasterService,
  UserInfo,
  UnitInfo,
  GetObjectsByIdResponse,
} from '../services/CoreMasterService';

const BACKEND_URL = 'https://dev.api-sod.com/core/api/v1';

const CoreMasterUserUnitList: React.FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [units, setUnits] = useState<UnitInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError('');
      try {
        const user = await authService.getUser();
        if (!user) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        const token = user.access_token;
        const service = new CoreMasterService(BACKEND_URL);
        service.setAuthToken(token);

        // TODO: Replace with actual IDs for testing
        const userIds = ['user1', 'user2'];
        const unitIds = ['unit1', 'unit2'];

        const resp = await service.getObjectsById({
          userIds,
          unitIds,
          activeOnly: true,
        });

        const data: GetObjectsByIdResponse | undefined = resp?.data;
        if (isMounted && data) {
          setUsers(
            Array.isArray(data.users)
              ? (data.users.filter((u): u is UserInfo => 'userId' in u) ?? [])
              : []
          );
          setUnits(
            Array.isArray(data.units)
              ? (data.units.filter((u): u is UnitInfo => 'unitId' in u) ?? [])
              : []
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch users/units'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    void fetchData();
    return (): void => {
      isMounted = false;
    };
  }, []);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        CoreMaster Users & Units
      </Typography>
      {loading && (
        <Typography variant="body1" color="textSecondary">
          Loading...
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Users</Typography>
        <List>
          {users.length === 0 && (
            <ListItem>
              <ListItemText primary="No users found" />
            </ListItem>
          )}
          {users.map(
            (u: UserInfo): React.ReactElement => (
              <ListItem key={u.userId}>
                <ListItemText
                  primary={u.userId}
                  secondary={
                    <>
                      <div>User Code: {u.userCode}</div>
                      <div>Start: {u.effectiveStartDate}</div>
                      <div>End: {u.effectiveEndDate}</div>
                    </>
                  }
                />
              </ListItem>
            )
          )}
        </List>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Units</Typography>
        <List>
          {units.length === 0 && (
            <ListItem>
              <ListItemText primary="No units found" />
            </ListItem>
          )}
          {units.map(
            (u: UnitInfo): React.ReactElement => (
              <ListItem key={u.unitId}>
                <ListItemText
                  primary={u.unitId}
                  secondary={
                    <>
                      <div>Unit Code: {u.unitCode}</div>
                      <div>Start: {u.effectiveStartDate}</div>
                      <div>End: {u.effectiveEndDate}</div>
                    </>
                  }
                />
              </ListItem>
            )
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default CoreMasterUserUnitList;
