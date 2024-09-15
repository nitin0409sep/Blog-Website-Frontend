import { useUserContext } from "../../contexts/UserContextProvider";
import { useEffect } from "react";

const Toast = () => {
  const {
    showToast,
    toastMessage,
    toastError,
    setShowToast,
    setToastError,
    setToastMessage,
  } = useUserContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2000);

    // Cleanup timeout if the component unmounts or msg changes
    return () => {
      clearTimeout(timer);
      setToastError("");
      setToastMessage("");
    };
  }, [toastMessage, toastError, setShowToast, setToastError, setToastMessage]);

  return (
    <>
      {(toastMessage || toastError) && (
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 rounded-md 
        ${showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} 
        ${toastMessage ? "bg-green-400" : "bg-red-400"} 
        h-14 flex items-center justify-center lg:w-1/4 w-1/2 transition-all
        duration-500 ease-in-out text-white text-4xl`}
        >
          <span className="text-2xl md:text-3xl max-w-md whitespace-nowrap overflow-hidden text-ellipsis">
            {toastMessage || toastError}
          </span>
        </div>
      )}
    </>
  );
};

export default Toast;
