import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../utils/oidc";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const AuthenticateCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect((): void => {
    const handleAuthCallback = async (): Promise<void> => {
      try {
        const user = await authService.handleRedirectCallback();
        console.log("Authentication successful:", user);
        navigate("/home", { replace: true });
      } catch (err) {
        console.error("Authentication callback error:", err);
        setError("Authentication failed. Please try again.");
      }
    };

    void handleAuthCallback();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <a href="/login">Return to login</a>
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Processing authentication...
      </Typography>
    </Box>
  );
};

export default AuthenticateCallback;
