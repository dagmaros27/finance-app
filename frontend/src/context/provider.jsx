import { createContext, useState, useEffect } from "react";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  addDeposit,
  cashout,
  getReports,
  getUser,
  API,
} from "../services/apis";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetchUser(); // Fetch user details if token exists but user state is empty
    }
  }, [user]);

  const saveUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };
  const fetchUser = async () => {
    try {
      setError(null); // Reset error state
      setLoading(true);
      const response = await getUser();
      saveUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    API.defaults.headers.common["Authorization"] = null; // Clear header
    setIsLoggedIn(false);
    setUser(null);
  };

  const register = async (data) => {
    try {
      setError(null);
      setLoading(true);
      const response = await registerUser(data);
      saveUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (data) => {
    try {
      setLoading(true);
      const response = await loginUser(data);
      localStorage.setItem("token", response.data.token);
      saveUser(response.data.user);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw new Error("Login failed"); // Explicitly throw an error
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const forgot = async ({ email, onSuccess, onFailure }) => {
    try {
      console.log(email);
      setError(null);
      setLoading(true);
      await forgotPassword({ email });
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Request failed";
      setError(errorMessage);
      if (onFailure) onFailure({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const reset = async ({ email, code, newPassword, onSuccess, onFailure }) => {
    try {
      setLoading(true);
      setError(null);

      // Call the API or function to reset the password
      await resetPassword({ email, code, newPassword }); // Adjust this based on your API function

      if (onSuccess) onSuccess(); // Call success callback if provided
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset password";
      setError(errorMessage);
      if (onFailure) onFailure({ message: errorMessage }); // Call failure callback if provided
    } finally {
      setLoading(false);
    }
  };

  const postDeposit = async (data) => {
    try {
      setError(null);
      setLoading(true);
      const response = await addDeposit(data);
      setTransactions((prev) => [...prev, response.data.transaction]);
      await fetchUser(); // Add this line to update user data
      if (data.onSuccess) data.onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Deposit failed");
      if (data.onFailure) data.onFailure(err);
    } finally {
      setLoading(false);
    }
  };

  // Cashout
  const handleCashout = async (data) => {
    try {
      setError(null);
      setLoading(true);
      const response = await cashout(data);
      setTransactions((prev) => [...prev, response.data.transaction]);
      await fetchUser(); // Add this line to update user data
      if (data.onSuccess) data.onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Cashout failed");
      if (data.onFailure) data.onFailure(err);
    } finally {
      setLoading(false);
    }
  };

  // Get Reports
  const fetchReports = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await getReports();
      console.log(response.data);
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        report,
        loading,
        error,
        isLoggedIn,
        register,
        login,
        forgot,
        reset,
        postDeposit,
        handleCashout,
        fetchReports,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
