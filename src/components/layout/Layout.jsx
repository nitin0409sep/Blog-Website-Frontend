import { useEffect } from "react";
import { Header } from "../../index";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContextProvider";
import Toast from "../common/Toast";
import { QueryClientProvider, QueryClient } from "react-query";

const Layout = () => {
  const { showToast, setShowToast } = useUserContext();
  const queryClient = new QueryClient();

  useEffect(() => {
    setShowToast(!!showToast);
  }, [showToast]);

  return (
    <>
      <Header />
      <>
        <div className="relative pt-20 h-full w-full">
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </div>
      </>
      {showToast && <Toast />}
    </>
  );
};

export default Layout;
