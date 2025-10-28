import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

const ProtectedRoutes: React.FC = () => {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      void signIn();
    }
  }, [loading, user, signIn]);

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/issues", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  if (loading) {
    return (
      <CircularProgress sx={{ margin: "auto", display: "block", mt: 10 }} />
    );
  }

  return user ? <Outlet /> : null;
};

export default ProtectedRoutes;
