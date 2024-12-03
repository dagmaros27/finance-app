import { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../context/provider";

export default function Reports() {
  const { report, loading, error, fetchReports } = useContext(AppContext);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleCloseError = () => {
    setShowError(false);
  };

  if (loading) {
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={handleCloseError}
          message={error}
          action={
            <IconButton size="small" color="inherit" onClick={handleCloseError}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />

        {/* Summary Section */}
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Reports Summary
            </Typography>
            <Typography variant="subtitle1">
              Total Deposit Amount: <b>${report?.totalDeposits || 0}</b>
            </Typography>
            <Typography variant="subtitle1">
              Total Interest Earned: <b>${report?.totalInterest || 0}</b>
            </Typography>
            <Typography variant="subtitle1">
              Current Balance: <b>${report?.user?.totalBalance || 0}</b>
            </Typography>
          </CardContent>
        </Card>

        {/* Detailed Report Section */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Report Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>No.</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Interest</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Interval</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Timestamp</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report?.reportDetails?.length > 0 ? (
                    report.reportDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          ${detail.amount?.toFixed(2) || "N/A"}
                        </TableCell>
                        <TableCell>
                          {detail.type === "Credit" ? "Credit" : "Debit"}
                        </TableCell>
                        <TableCell>${detail.interest || "N/A"}</TableCell>
                        <TableCell>{detail.interval || "N/A"}</TableCell>
                        <TableCell>
                          {detail.timestamp
                            ? new Date(detail.timestamp).toLocaleString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body1">
                          No report data available.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
