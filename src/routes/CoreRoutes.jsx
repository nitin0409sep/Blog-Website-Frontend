import { Suspense } from "react";
import { Route } from "react-router-dom";
import { CreateUser, ViewPost, ViewUsers, AddPost } from "../index";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { GlobalLoader } from "../index";
import Error from "../components/common/Error";

const CoreRoutes = [
  <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
    <Route
      path="addPost"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <AddPost />
        </Suspense>
      }
      errorElement={<Error />}
      key="user"
    />
    ,
    <Route
      path="viewPosts"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <ViewPost />
        </Suspense>
      }
      errorElement={<Error />}
      key="viewPosts"
    />
  </Route>,
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route
      path="createUser"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <CreateUser />
        </Suspense>
      }
      errorElement={<Error />}
      key="createUser"
    />
    ,
    <Route
      path="userList"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <ViewUsers />
        </Suspense>
      }
      errorElement={<Error />}
      key="userList"
    />
  </Route>,
  <Route path="/" element={<Navigate to="public" replace />}></Route>,
];

export default CoreRoutes;
