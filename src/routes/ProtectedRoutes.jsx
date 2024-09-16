import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../contexts/UserContextProvider";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { role, setShowToast, setToastError } = useUserContext();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      setShowToast(true);
      setToastError("You are unauthorized for this route access.");
      setShouldRedirect(true);
    }
  }, []);

  if (shouldRedirect) {
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/public" replace />;
    }
  }

  //! The ProtectedRoute component checks the user's authorization and, if successful, uses <Outlet /> to pass control to the child route's component, which is then rendered in the appropriate part of the parent layout.
  return <Outlet />;
  // return <User />; We can return it also or any component as per requirement
};

export default ProtectedRoute;
