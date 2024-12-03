import "./App.css";
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";
import Home from "./pages/home";
import Report from "./pages/report";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./components/navBar";
import Layout from "./components/layout";
import PrivateRoute from "./components/privateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/report"
          element={
            <PrivateRoute>
              <Layout>
                <Report />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
