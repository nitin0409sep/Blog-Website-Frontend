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
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${
            showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } transition-all duration-500 ease-out`}
        >
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-xl border shadow-2xl ${
              toastMessage
                ? "bg-emerald-500/20 border-emerald-500/30 shadow-emerald-500/10"
                : "bg-rose-500/20 border-rose-500/30 shadow-rose-500/10"
            }`}
          >
            {/* Icon */}
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                toastMessage ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              {toastMessage ? (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <span className={`text-sm font-medium max-w-xs truncate ${
              toastMessage ? "text-emerald-200" : "text-rose-200"
            }`}>
              {toastMessage || toastError}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
