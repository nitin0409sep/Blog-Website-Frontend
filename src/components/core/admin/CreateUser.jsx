import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContextProvider";
import * as EmailValidator from "email-validator";
import { Spinner } from "../../common/Loader";
import { registerUser } from "../../utils/Services/Auth.service";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [validForm, setValidForm] = useState(false);
  const { setUser, setShowToast, setToastMessage, setToastError } =
    useUserContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      validate({ confirmPassword: "" });
    }
  }, [formData.password]);

  useEffect(() => {
    validateForm();
  }, [errors]);

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
            ? "Password should be more than 8 characters"
            : "";
      }

      if ("confirmPassword" in fieldValues) {
        temp.confirmPassword =
          !fieldValues.confirmPassword && !formData.confirmPassword
            ? "Confirm Password is required"
            : (fieldValues.confirmPassword &&
                fieldValues.confirmPassword === formData.password) ||
              (formData.confirmPassword &&
                formData.confirmPassword === formData.password)
            ? ""
            : "Passwords do not match";
      }

      setErrors({ ...temp });
    },
    [formData, errors]
  );

  function validateForm() {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== ""
    );
    const noErrors = Object.values(errors).every((error) => error === "");
    setValidForm(allFieldsFilled && noErrors);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate({ [name]: value });
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create User</h1>
          <p className="text-slate-400 mt-1 text-sm">Add a new user to the platform</p>
        </div>

        {/* Form Card */}
        <Form
          method="post"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            try {
              const requestBody = {
                user_name: formData.name,
                email: formData.email,
                password: formData.password,
                created_by: 1,
              };
              const { data } = await registerUser(requestBody);
              setLoading(false);
              setShowToast(true);
              setToastMessage(data.message);
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
            } catch (error) {
              console.log(error);
              setLoading(false);
              setShowToast(true);
              setToastError(
                error?.response?.data?.error || "Registration failed"
              );
            }
          }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              User Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full name"
              className={inputClass}
              value={formData.name}
              onChange={handleInputChange}
              onBlur={() => validate({ name: "" })}
            />
            {errors.name && (
              <span className="text-rose-400 text-xs">{errors.name}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              User Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="user@example.com"
              className={inputClass}
              value={formData.email}
              onBlur={() => validate({ email: "" })}
              onChange={handleInputChange}
            />
            {errors.email && (
              <span className="text-rose-400 text-xs">{errors.email}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Min 8 characters"
              className={inputClass}
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => validate({ password: "" })}
            />
            {errors.password && (
              <span className="text-rose-400 text-xs">{errors.password}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repeat password"
              className={inputClass}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={() => validate({ confirmPassword: "" })}
            />
            {errors.confirmPassword && (
              <span className="text-rose-400 text-xs">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            disabled={!validForm}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center mt-2 ${
              !validForm
                ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
                : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            }`}
          >
            {loading ? <Spinner height={20} width={20} /> : "Create User"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default CreateUser;
