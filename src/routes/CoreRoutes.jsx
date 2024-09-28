import { Suspense } from "react";
import { Route } from "react-router-dom";
import { CreateUser, ViewPost, ViewUsers, AddPost, Post } from "../index";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { GlobalLoader } from "../index";
import Error from "../components/common/Error";

const CoreRoutes = [
  <Route path="user" element={<ProtectedRoute allowedRoles={["user"]} />}>
    <Route
      path="add-post"
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
      path="update-post/:id"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <AddPost />
        </Suspense>
      }
      errorElement={<Error />}
      key="update-posts"
    />
    ,
    <Route path="view-posts" key="viewPosts">
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

  <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route
      path="create-user"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <CreateUser />
        </Suspense>
      }
      errorElement={<Error />}
      key="create-user"
    />
    ,
    <Route
      path="user-list"
      element={
        <Suspense fallback={<GlobalLoader />}>
          <ViewUsers />
        </Suspense>
      }
      errorElement={<Error />}
      key="user-list"
    />
  </Route>,
  <Route path="/" element={<Navigate to="public" replace />}></Route>,
];

export default CoreRoutes;
