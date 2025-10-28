import React from "react";
import { Card, CardContent, Typography, Skeleton } from "@mui/material";
import { useUser, useToken } from "../contexts/AuthContext";
import { CoreMasterService, UserInfo } from "../services/CoreMasterService";

const BACKEND_URL = "https://dev.api-sod.com/core/v1";
const UserCard: React.FC = () => {
  const [fullUser, setFullUser] = React.useState<UserInfo | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const oidcUser = useUser();
  const token = useToken();

  React.useEffect((): (() => void) => {
    let isMounted = true;
    const run = async (): Promise<void> => {
      try {
        if (!oidcUser || !token) return;

        const userId = oidcUser.profile.sub;
        if (userId) {
          const service = new CoreMasterService(BACKEND_URL);
          service.setAuthToken(token);
          try {
            const fullUserInfo = await service.getUser(String(userId));
            if (isMounted) setFullUser(fullUserInfo);
          } catch (err) {
            console.error("Failed to fetch full user info:", err);
            if (isMounted) setFullUser(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void run();
    return (): void => {
      isMounted = false;
    };
  }, [oidcUser, token]);

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

  if (!fullUser) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">No user information available.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          CoreMaster User Information
        </Typography>
        <Typography variant="body1">
          <strong>User ID:</strong> {fullUser.userId}
        </Typography>
        <Typography variant="body1">
          <strong>User Code:</strong> {fullUser.userCode}
        </Typography>
        <Typography variant="body1">
          <strong>Effective Start:</strong> {fullUser.effectiveStartDate}
        </Typography>
        <Typography variant="body1">
          <strong>Effective End:</strong> {fullUser.effectiveEndDate}
        </Typography>
        <Typography variant="body1">
          <strong>Attributes:</strong>{" "}
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify(fullUser.attributes, null, 2)}
          </pre>
        </Typography>
        {oidcUser && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>OIDC Subject (sub):</strong> {oidcUser.profile.sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
