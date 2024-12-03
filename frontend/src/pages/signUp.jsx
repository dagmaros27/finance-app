import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { registerUser } from "../services/apis";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { validateSignUp } from "../utils/validation";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleErrorClose = () => {
    setShowError(false);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const formValues = {
      username: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    };

    const validationErrors = validateSignUp(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setEmailError(!!validationErrors.email);
      setPasswordError(!!validationErrors.password);
      setNameError(!!validationErrors.username);
      setEmailErrorMessage(validationErrors.email || "");
      setPasswordErrorMessage(validationErrors.password || "");
      setNameErrorMessage(validationErrors.username || "");
      setLoading(false);
      return;
    }

    try {
      await registerUser(formValues);
      navigate("/signin");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                disabled={loading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                name="email"
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                error={emailError}
                helperText={emailErrorMessage}
                disabled={loading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                name="password"
                required
                fullWidth
                type="password"
                id="password"
                placeholder="••••••"
                error={passwordError}
                helperText={passwordErrorMessage}
                disabled={loading}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/signin" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Card>
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={handleErrorClose}
          message={error}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleErrorClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </SignUpContainer>
    </>
  );
}
