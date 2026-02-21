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
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </main>
      {showToast && <Toast />}
    </div>
  );
};

export default Layout;
