import { useState } from "react";
import { useUserContext } from "../../contexts/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../utils/customhooks/useLocalstorage";
import { Spinner } from "../../index";
import { loginUser } from "../utils/Services/Auth.service";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const { setUser, setShowToast, setToastMessage, setToastError } =
    useUserContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser(email, password);
      setUserData(data.tokens.accessToken);
      setUser(true);
      setShowToast(true);
      setToastMessage("Logged In Successfully!!!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setShowToast(true);
      setToastError(error.response.data.error ?? error.message);
    }
  };

  const isDisabled = !email || !password || loading;

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <form
          method="post"
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type={visibility ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setVisibility(!visibility)}
              >
                {visibility ? (
                  <VisibilityOffIcon style={{ fontSize: 18 }} />
                ) : (
                  <VisibilityIcon style={{ fontSize: 18 }} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center ${
              isDisabled
                ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
                : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            }`}
          >
            {loading ? <Spinner height={20} width={20} /> : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
