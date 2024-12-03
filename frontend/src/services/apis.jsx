import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiry
      localStorage.removeItem("token");
      window.location.replace("/signin"); // Adjust for router use
    }
    return Promise.reject(error);
  }
);

const registerUser = (data) => API.post("/user/", data);
const loginUser = (data) => API.post("/user/login", data);
const getUser = () => API.get("/user/");
const forgotPassword = (data) => API.post("/user/forgot-password", data);
const resetPassword = (data) => API.post("/user/reset-password", data);
const addDeposit = (data) => API.post("/transaction/deposit", data);
const cashout = (data) => API.post("/transaction/cashout", data);
const getReports = () => API.get("/transaction/reports");

export {
  registerUser,
  loginUser,
  getUser,
  forgotPassword,
  resetPassword,
  addDeposit,
  cashout,
  getReports,
  API,
};
