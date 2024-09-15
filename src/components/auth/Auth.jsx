import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContextProvider";

const Auth = () => {
  const { user } = useUserContext();

  // Already Logged In
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default Auth;
