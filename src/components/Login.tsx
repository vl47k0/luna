import React from "react";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  TextField,
  Container,
  CssBaseline,
  Box,
  Link,
  Typography,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { SignInButton } from "./SignInButton";

function Copyright(): JSX.Element {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://atc-kk.jp/">
        ATC Inc.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const Login: React.FC = () => {
  const [redirect, setRedirect] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");

  React.useEffect(() => {
    // side-effect only; no cleanup function needed
    const currentUser = AuthService.getCurrentUser?.();
    if (currentUser) {
      setRedirect("/dashboard");
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const username = String(data.get("username") ?? "");
    const password = String(data.get("password") ?? "");

    setMessage("");
    setLoading(true);

    // If AuthService.login returns a promise, keep as is.
    // If it returns something else, adjust the typing accordingly.
    AuthService.login(username, password)
      .then(() => {
        setRedirect("/"); // or '/dashboard' to be consistent with useEffect
      })
      .catch((err: unknown) => {
        let resMessage: string;

        // Narrow unknown safely:
        if (typeof err === "object" && err !== null) {
          // axios-style: err.response?.data?.message
          const maybeAny = err as {
            response?: { data?: { message?: unknown } };
            message?: unknown;
          };
          const apiMsg = maybeAny.response?.data?.message;
          if (typeof apiMsg === "string") {
            resMessage = apiMsg;
          } else if (typeof maybeAny.message === "string") {
            resMessage = maybeAny.message;
          } else {
            resMessage = "Login failed.";
          }
        } else if (typeof err === "string") {
          resMessage = err;
        } else {
          resMessage = "Login failed.";
        }

        setLoading(false);
        setMessage(resMessage); // string only — safe for setState
      });
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          {message && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              variant="outlined"
              autoFocus
              autoComplete="username"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="outlined"
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} /> : "Gravitee Sign In"}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ mt: 8, mb: 4 }}>
          <SignInButton />
        </Box>
        <Box sx={{ mt: 8, mb: 4 }}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
