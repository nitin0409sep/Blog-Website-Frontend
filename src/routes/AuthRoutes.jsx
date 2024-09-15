import { Navigate, Route } from "react-router-dom";
import { Login, Auth, Register } from "../index";
import { Suspense } from "react";
import { GlobalLoader } from "../index";
import Error from "../components/common/Error";

const AuthRoutes = [
  <Route
    path="auth"
    element={
      <Suspense fallback={<GlobalLoader />}>
        <Auth />
      </Suspense>
    }
    errorElement={<Error />}
  >
    <Route index={true} element={<Navigate to="login" />}></Route>
    <Route
      path="login"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <Login />
        </Suspense>
      }
      errorElement={<Error />}
    ></Route>
    <Route
      path="register"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <Register />
        </Suspense>
      }
      errorElement={<Error />}
    ></Route>
    <Route path="*" element={<Navigate to="/auth/login" replace />}></Route>
  </Route>,
];

export default AuthRoutes;
