import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense } from "react";
import { AuthRoutes, CoreRoutes } from "../routes";
import { Layout, Public, Post } from "../index";
import Error from "../components/common/Error";
import { GlobalLoader } from "../index";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Layout />} key="layout">
      {...AuthRoutes}
      {...CoreRoutes}
      <Route path="public" key="public">
        <Route path="" element={<Public />} errorElement={<Error />}></Route>
        <Route
          path="post/:id"
          element={
            <Suspense fallback={<GlobalLoader />}>
              <Post />
            </Suspense>
          }
          key="post-id"
          errorElement={<Error />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} key="unknown" />
    </Route>,
  ])
);

export default router;
