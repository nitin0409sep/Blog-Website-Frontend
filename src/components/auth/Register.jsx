import { useCallback, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContextProvider";
import * as EmailValidator from "email-validator";
import { Spinner } from "../common/Loader";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../utils/customhooks/useLocalstorage";
import { registerUser } from "../utils/Services/Auth.service";

const Register = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Errors Handling
  const [errors, setErrors] = useState({});
  const [validForm, setValidForm] = useState(false);
  const { setUser, setShowToast, setToastMessage, setToastError } =
    useUserContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //? If user has changed password, after filling password & confirm passowrd both, then validate both again
  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      validate({ confirmPassword: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.password]);

  useEffect(() => {
    validateForm();
  }, [errors]);

  // Validation
  const validate = useCallback(
    (fieldValues = formData) => {
      const temp = { ...errors };

      if ("name" in fieldValues)
        temp.name =
          formData.name || fieldValues.name ? "" : "Name is required.";

      if ("email" in fieldValues) {
        temp.email =
          !fieldValues.email && !formData.email
            ? "Email is required."
            : (formData.email || fieldValues.email) &&
              (EmailValidator.validate(fieldValues.email) ||
                EmailValidator.validate(formData.email))
            ? ""
            : `Email is invalid`;
      }

      if ("password" in fieldValues) {
        temp.password =
          !fieldValues.password && !formData.password
            ? "Password is required"
            : (fieldValues.password && fieldValues.password.length < 7) ||
              (formData && formData.password.length < 7)
            ? "Passowrd should be more than 8 chars"
            : "";
      }

      if ("confirmPassword" in fieldValues) {
        temp.confirmPassword =
          !fieldValues.confirmPassword && !formData.confirmPassword
            ? "Confirm Password is Required"
            : (fieldValues.confirmPassword &&
                fieldValues.confirmPassword === formData.password) ||
              (formData.confirmPassword &&
                formData.confirmPassword === formData.password)
            ? ""
            : "Password and Confirm Passowrd are not same";
      }

      setErrors({ ...temp });
    },
    [formData, errors]
  );

  // Form is Valid or Not
  function validateForm() {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== ""
    );
    const noErrors = Object.values(errors).every((error) => error === "");
    setValidForm(allFieldsFilled && noErrors);
  }

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // To check each field is valid or not
    validate({ [name]: value });
  };

  return (
    <>
      <div
        style={{ height: "90vh" }}
        className="flex flex-col justify-center items-center gap-10 font-serif"
      >
        <div className="text-center text-white">
          <h1 className="text-5xl">Register</h1>
        </div>

        <Form
          className="w-full flex justify-center "
          method="post"
          onSubmit={async (event) => {
            event.preventDefault();

            const requestBody = {
              user_name: formData.name,
              email: formData.email,
              password: formData.password,
            };

            setLoading(true);
            try {
              setLoading(true);

              const data = await registerUser(requestBody);
              setUserData(data.token);
              setUser(true);

              setLoading(false);
              setShowToast(true);
              setToastMessage(data.message);

              navigate("/");
            } catch (error) {
              console.log(error);
              setLoading(false);

              setShowToast(true);
              setToastError(
                error?.response?.data?.error || "Registration failed"
              );
            }
          }}
        >
          <div className="flex flex-col gap-3 bg-gray-300 shadow-md rounded-xl pl-10 pr-10 pb-2 w-4/5 md:w-1/2 lg:w-2/5 text-2xl">
            <div className="flex flex-col gap-1 pt-8">
              <label htmlFor="name" className="text-black pl-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => validate({ name: "" })}
              />
              {errors.name && (
                <span className="text-red-600 text-sm pl-2">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-black pl-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
                value={formData.email}
                onBlur={() => validate({ email: "" })}
                onChange={handleInputChange}
              />
              {errors.email && (
                <span className="text-red-600 text-sm pl-2">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-black pl-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => validate({ password: "" })}
              />
              {errors.password && (
                <span className="text-red-600 text-sm pl-2">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="cofirmPassword" className="text-black pl-2">
                Confirm Password
              </label>
              <input
                type="text"
                id="confirmPassword"
                name="confirmPassword"
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => validate({ confirmPassword: "" })}
              />
              {errors.confirmPassword && (
                <span className="text-red-600 text-sm pl-2">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 mb-5 pt-2">
              <button
                className={`${
                  !validForm
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-400 text-white text-2xl"
                } p-5 rounded-xl  flex justify-center outline-none`}
                disabled={!validForm}
              >
                {loading ? <Spinner height={22} width={22} /> : "Register"}
              </button>
              <p className="text-right flex justify-center gap-1 text-black md:text-2xl font-medium">
                <span>Already have an account?</span>
                <a
                  href="/auth/login"
                  className="text-blue-400 hover:text-blue-700"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
