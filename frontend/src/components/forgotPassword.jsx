import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormHelperText from "@mui/material/FormHelperText";
import { AppContext } from "../context/provider";

export default function ForgotPassword({ open, handleClose, onResetPassword }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgot } = useContext(AppContext);

  const validateEmail = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      return false;
    }
    setEmailError(false);
    setEmailErrorMessage("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail()) return;

    try {
      await forgot({
        email,
        onSuccess: () => {
          setMessage("Password reset code sent to your email!");
          setIsSuccess(true);
          setShowSnackbar(true);

          // Transition to Reset Password modal
          handleClose();
          onResetPassword(email);
        },
        onFailure: (err) => {
          setMessage(
            err.message || "Failed to send reset link. Please try again."
          );
          setIsSuccess(false);
          setShowSnackbar(true);
        },
      });
    } catch (error) {
      setMessage(error.message || "An error occurred. Please try again later.");
      setIsSuccess(false);
      setShowSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    setMessage("");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
          sx: { backgroundImage: "none" },
        }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you a
            link to reset your password.
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          {emailError && (
            <FormHelperText error>{emailErrorMessage}</FormHelperText>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: isSuccess ? "green" : "red",
          },
        }}
      />
    </>
  );
}
