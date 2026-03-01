import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { Service, MapperService } from "../services/MapperService";
import type { User } from "oidc-client-ts";
import { authService } from "../utils/oidc";

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const [service, setService] = React.useState<Service | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const solutionBackendRef = React.useRef<MapperService | null>(null);

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchData = React.useCallback(async (sid: string): Promise<void> => {
    if (!solutionBackendRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const data: Service | undefined | null =
        await solutionBackendRef.current.fetchService(sid);
      if (data) {
        setService(data);
      } else {
        setError("Service not found.");
      }
    } catch (err: unknown) {
      setError("Failed to load service. Please try again later.");
      // Optional: console.error('Failed to fetch service:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the user
  React.useEffect((): void | (() => void) => {
    let isMounted = true;

    const run = async (): Promise<void> => {
      try {
        const data = await authService.getUser();
        if (isMounted) setUser(data);
      } catch (err: unknown) {
        // Optional: console.error('Failed to get user:', err);
      }
    };

    void run();

    return (): void => {
      isMounted = false;
    };
  }, []);

  // Init backend and fetch when ready
  React.useEffect((): void | (() => void) => {
    if (user && !solutionBackendRef.current) {
      solutionBackendRef.current = new MapperService(
        import.meta.env.VITE_BACKEND_API_URL,
        user.access_token
      );
    }

    if (user && serviceId) {
      void fetchData(serviceId);
    }

    return (): void => {
      // cleanup ref on unmount
      solutionBackendRef.current = null;
    };
  }, [user, serviceId, fetchData]);

  // Loading state (centered)
  if (loading && !service) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {service ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">{service.name}</Typography>
          </Grid>

          <Grid item key={serviceId} xs={12}>
            <Card>
              <CardContent>
                <ListItemText primary={`ID: ${service.id}`} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography>Test</Typography>
          </Grid>
        </Grid>
      ) : (
        // If not loading and no service: either still waiting for user/serviceId or not found
        <Typography variant="h6" component="div">
          {loading ? "Loading…" : "No service selected."}
        </Typography>
      )}
    </>
  );
};

export default ServiceDetail;
