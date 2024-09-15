import { useState } from "react";
import { useUserContext } from "../../contexts/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../utils/customhooks/useLocalstorage";
import { Spinner } from "../../index";
import { loginUser } from "../utils/Services/Auth.service";

const Login = () => {
  const { setUser, setShowToast, setToastMessage, setToastError } =
    useUserContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // Save Token in Local Storage
      setUserData(data.tokens.accessToken);
      setUser(true);

      setShowToast(true);
      setToastMessage("Logged In Successfully!!!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setShowToast(true);

      console.log(error);

      setToastError(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col w-ful items-center max-flex-1 gap-10 p-20 h-full font-serif justify-center">
        <h1 className="text-5xl text-white">Login</h1>
        <form
          className="flex flex-col w-full items-center md:w-1/2 lg:w-2/5 text-2xl"
          method="post"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-5 w-full max-flex-1 pb-10 bg-gray-300 shadow-md rounded-xl items-center">
            <div className="flex flex-col gap-1 w-full pl-10 pr-10 pt-10">
              <label htmlFor="email" className="text-black pl-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1 w-full pr-10 pl-10">
              <label htmlFor="password" className="text-black pl-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1 w-full pr-10 pl-10">
              <button
                className="outline-none text-center flex justify-center p-2 rounded-xl bg-blue-400 hover:text-black text-white text-4xl"
                type="submit"
                disabled={!email || !password || loading}
                style={{
                  backgroundColor: !email || !password || loading ? "gray" : "",
                }}
              >
                {loading ? <Spinner height={25} width={25} /> : "Login"}
              </button>
              <p className="flex justify-center gap-1 text-black text-xl font-medium">
                <span>Do not have an account?</span>
                <a
                  href="/auth/register"
                  className="text-blue-400 hover:text-blue-700"
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
