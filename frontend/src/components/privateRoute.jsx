import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/provider";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
