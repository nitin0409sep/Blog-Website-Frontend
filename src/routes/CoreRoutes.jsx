import { Suspense } from "react";
import { Route } from "react-router-dom";
import { CreateUser, ViewPost, ViewUsers, AddPost, Post } from "../index";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { GlobalLoader } from "../index";
import Error from "../components/common/Error";

const CoreRoutes = [
  <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
    <Route
      path="user/add-post"
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
      path="user/update-post/:id"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <AddPost />
        </Suspense>
      }
      errorElement={<Error />}
      key="viewPosts"
    />
    ,
    <Route path="user/view-posts" key="viewPosts">
      <Route
        path=""
        element={
          <Suspense fallback={<GlobalLoader />}>
            <ViewPost />
          </Suspense>
        }
        errorElement={<Error />}
      ></Route>

      <Route
        path=":id"
        element={
          <Suspense fallback={<GlobalLoader />}>
            <Post />
          </Suspense>
        }
        errorElement={<Error />}
        key="view-post-id"
      />
    </Route>
  </Route>,
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route
      path="admin/create-user"
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
      path="admin/user-list"
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
