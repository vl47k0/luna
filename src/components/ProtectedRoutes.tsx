import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../utils/oidc";
import type { User } from "oidc-client-ts";
import CircularProgress from "@mui/material/CircularProgress";

interface AuthState {
  auth: boolean;
  role: User["profile"] | undefined;
  loading: boolean;
  user: User | null;
}

const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect((): void | (() => void) => {
    let isMounted = true;

    const fetchUser = async (): Promise<void> => {
      try {
        const currentUser = await authService.getUser();
        if (isMounted) setUser(currentUser);
      } catch (_err: unknown) {
        // Silent error handling
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchUser();

    return (): void => {
      isMounted = false;
    };
  }, []);

  return { auth: !!user, role: user?.profile, loading, user };
};

const ProtectedRoutes: React.FC = () => {
  const { auth, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !auth) {
      // Instead of using Navigate component, use navigate function
      void authService.signIn();
    }
  }, [loading, auth, navigate]);

  if (loading)
    return (
      <CircularProgress sx={{ margin: "auto", display: "block", mt: 10 }} />
    );

  // Only render the outlet when authenticated
  return auth ? <Outlet /> : null;
};

export default ProtectedRoutes;
