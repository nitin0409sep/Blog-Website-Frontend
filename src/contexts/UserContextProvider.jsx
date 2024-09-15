import { useContext, createContext, useState, useEffect } from "react";
import { getUserData } from "../components/utils/customhooks/useLocalstorage";
import { jwtDecode } from "jwt-decode";

// CREATE CONTEXT
export const UserContext = createContext();

// CUSTOM HOOK TO USE CONTEXT
export const useUserContext = () => useContext(UserContext);

// CONTEXT PROVIDER
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [role, setRole] = useState(null);

  // TOAST
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState("");

  useEffect(() => {
    const token = getUserData();

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // Checking for token expiration
        if (decodedToken.exp * 1000 < Date.now()) {
          setUser(false);
          setRole(null);
          return;
        }

        // User is logged in
        setUser(true);

        // Set Role of User
        setRole(() => (decodedToken.role_id + "").toLowerCase() ?? null);
      } catch (error) {
        setUser(false);
        setRole(() => null);
      }
    }
  }, [user]);

  const value = {
    user,
    setUser,
    role,
    setRole,
    showToast,
    setShowToast,
    toastError,
    setToastError,
    toastMessage,
    setToastMessage,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
