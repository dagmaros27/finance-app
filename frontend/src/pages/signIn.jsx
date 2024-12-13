import React, { useContext, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import ForgotPassword from "../components/forgotPassword";
import AppTheme from "../themes/AppTheme";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../context/provider";
import ResetPassword from "../components/resetPassword";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...(theme.palette.mode === "dark" && {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...(theme.palette.mode === "dark" && {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

function SignIn(props) {
  const { login, loading, error } = useContext(AppContext);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (validateInputs()) {
        const data = new FormData(event.currentTarget);
        const credentials = {
          email: data.get("email"),
          password: data.get("password"),
        };

        try {
          await login(credentials);
          navigate("/");
        } catch (err) {
          console.log(err);
          setShowError(true);
        }
      }
    },
    [login, navigate]
  );

  const validateInputs = useCallback(() => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  }, []);

  const handleForgotPassword = useCallback(() => {
    setShowForgotPassword(true);
  }, []);

  const handleResetPassword = useCallback((email) => {
    setResetEmail(email);
    setShowForgotPassword(false);
    setResetPasswordModalOpen(true);
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="password"
                type="password"
                name="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleForgotPassword}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Typography>
            Don&apos;t have an account?{" "}
            <Link href="/signup" variant="body2">
              Sign up
            </Link>
          </Typography>
        </Card>
        <ForgotPassword
          open={showForgotPassword}
          handleClose={() => setShowForgotPassword(false)}
          onResetPassword={handleResetPassword}
        />
        <ResetPassword
          open={isResetPasswordModalOpen}
          handleClose={() => setResetPasswordModalOpen(false)}
          email={resetEmail}
        />

        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
          message={error}
          action={
            <IconButton size="small" onClick={() => setShowError(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </SignInContainer>
    </AppTheme>
  );
}

export default React.memo(SignIn);
