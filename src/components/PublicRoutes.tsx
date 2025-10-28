import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { authService } from "../utils/oidc";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../contexts/AuthContext";

const PublicRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      void authService.signIn();
    }
  }, [loading, user]);

  if (loading) {
    return (
      <CircularProgress sx={{ margin: "auto", display: "block", mt: 10 }} />
    );
  }

  return user ? (
    <Outlet />
  ) : (
    <CircularProgress sx={{ margin: "auto", display: "block", mt: 10 }} />
  );
};

export default PublicRoutes;
