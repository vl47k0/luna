import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { User } from 'oidc-client-ts';
import { authService } from '../utils/oidc';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// ---- Custom claim typing (optional, based on your commented UI) ----
interface UnitPath {
  code: string;
  name: string;
}

interface UnitAssignedUser {
  unitAssignedUserId: string | number;
  roleCode: string;
}

interface UnitInfo {
  unitId: string | number;
  unitAbsPathCode: UnitPath[];
}

interface JobDuty {
  jobDutyId: string | number;
}

interface UnitJobDutyItem {
  unitAssignedUser: UnitAssignedUser;
  unit: UnitInfo;
  jobDuty: JobDuty;
}

interface A2BClaim {
  userId: string | number;
  unitJobDutyList: UnitJobDutyItem[];
}

// Extend standard JwtPayload with your custom claim (mark optional if not always present)
type ExtendedJwt = JwtPayload & {
  _a2b?: A2BClaim;
};

const UserCard: React.FC = (): JSX.Element => {
  const [userInfo, setUserInfo] = React.useState<ExtendedJwt | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  //React.useEffect((): void => {
  React.useEffect((): void | (() => void) => {
    let isMounted = true;

    const run = async (): Promise<void> => {
      try {
        const user: User | null = await authService.getUser();
        if (user?.id_token) {
          const decoded = jwtDecode<ExtendedJwt>(user.id_token);
          if (isMounted) setUserInfo(decoded);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void run();

    return (): void => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton width={180} height={32} />
          <Skeleton width={220} height={28} />
          <Skeleton width="60%" />
        </CardContent>
      </Card>
    );
  }

  if (!userInfo) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">No user information available.</Typography>
        </CardContent>
      </Card>
    );
  }

  // Helper to format epoch seconds if present
  const fmt = (sec?: number): string =>
    typeof sec === 'number' ? new Date(sec * 1000).toLocaleString() : '—';

  /*
  const audience = Array.isArray(userInfo.aud)
    ? userInfo.aud.join(', ')
    : userInfo.aud ?? '—';
    */

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          User Information
        </Typography>

        <Typography variant="body1">
          <strong>Subject (sub):</strong> {userInfo.sub ?? '—'}
        </Typography>
        <Typography variant="body1">
          <strong>Issuer (iss):</strong> {userInfo.iss ?? '—'}
        </Typography>

        {/*
        <Typography variant="body1">
          <strong>Audience (aud):</strong> {audience}
        </Typography>


      */}
        <Typography variant="body1">
          <strong>Issued At (iat):</strong> {fmt(userInfo.iat)}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Expires (exp):</strong> {fmt(userInfo.exp)}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          A2B Information
        </Typography>
        <Typography variant="body1">
          <strong>User ID:</strong> {userInfo._a2b?.userId ?? '—'}
        </Typography>

        {userInfo._a2b?.unitJobDutyList?.map((item, index) => (
          <Box key={index} sx={{ mt: 1 }}>
            <Typography variant="body2">
              <strong>Unit Assigned User ID:</strong>{' '}
              {item.unitAssignedUser.unitAssignedUserId}
            </Typography>
            <Typography variant="body2">
              <strong>Role Code:</strong> {item.unitAssignedUser.roleCode}
            </Typography>
            <Typography variant="body2">
              <strong>Unit ID:</strong> {item.unit.unitId}
            </Typography>
            {item.unit.unitAbsPathCode?.map((path, idx) => (
              <Typography variant="body2" key={idx}>
                <strong>Unit Path Code:</strong> {path.code} — {path.name}
              </Typography>
            ))}
            <Typography variant="body2">
              <strong>Job Duty ID:</strong> {item.jobDuty.jobDutyId}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserCard;
