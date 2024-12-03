import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../context/provider";

export default function Home() {
  const { user, loading, postDeposit, handleCashout, error, fetchUser } =
    useContext(AppContext);

  const [amount, setAmount] = useState("");
  const [interval, setInterval] = useState("");
  const [cashoutAmount, setCashoutAmount] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  // Deposit handler
  const handleDepositSubmit = () => {
    if (!amount || !interval) {
      setMessage("Please fill in all fields.");
      setShowSnackbar(true);
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setMessage("Please enter a valid deposit amount.");
      setShowSnackbar(true);
      return;
    }

    postDeposit({
      amount: depositAmount,
      interval,
      onSuccess: () => {
        setMessage("Deposit successful!");
        setShowSnackbar(true);
        setAmount("");
        setInterval("");
      },
      onFailure: (err) => {
        setMessage(
          err.message || "An error occurred while processing the deposit."
        );
        setShowSnackbar(true);
      },
    });
  };

  // Cashout handler
  const handleCashoutSubmit = () => {
    const cashoutValue = parseFloat(cashoutAmount);

    if (isNaN(cashoutValue) || cashoutValue <= 0) {
      setMessage("Please enter a valid cashout amount.");
      setShowSnackbar(true);
      return;
    }

    if (cashoutValue > user?.totalBalance) {
      setMessage("Insufficient balance for this cashout.");
      setShowSnackbar(true);
      return;
    }

    handleCashout({
      amount: cashoutValue,
      onSuccess: () => {
        setMessage("Cashout successful!");
        setShowSnackbar(true);
        setCashoutAmount("");
      },
      onFailure: (err) => {
        setMessage(
          err.message || "An error occurred while processing the cashout."
        );
        setShowSnackbar(true);
      },
    });
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    setMessage("");
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Deposit Section */}
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Post a Deposit
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Total Balance:{" "}
              <b>
                {loading ? (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                ) : (
                  `$${user?.totalBalance?.toFixed(2) || "0.00"}`
                )}
              </b>
            </Typography>

            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "100%",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  label="Deposit Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel id="interval-label">Interval</InputLabel>
                  <Select
                    labelId="interval-label"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleDepositSubmit}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Post Deposit"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Cashout Section */}
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Cashout
            </Typography>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "start",
              }}
            >
              <TextField
                label="Cashout Amount"
                type="number"
                value={cashoutAmount}
                onChange={(e) => setCashoutAmount(e.target.value)}
                fullWidth
                required
              />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleCashoutSubmit}
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Cashout"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Snackbar for errors and success messages */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={error}
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
        />
      </Container>
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
      />
    </>
  );
}
