import React from "react";
import { createRoot } from "react-dom/client";
import { UserContextProvider } from "./contexts/UserContextProvider";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <RouterProvider router={router} />
  </UserContextProvider>
);
