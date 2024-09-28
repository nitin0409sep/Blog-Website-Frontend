import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchUserProfile } from "../../../utils/services/User.service";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [edit, setEdit] = useState(false);

  const { register, formState, getValues, setValue } = useForm({
    defaultValues: {
      name: "",
      email: "",
      createdAt: "",
    },
  });

  const {
    data: user,
    isFetching,
    isLoading,
    isError,
    error,
  } = useQuery("user-profile", fetchUserProfile, {
    select: (data) => {
      return data.data.user;
    },
  });

  useEffect(() => {
    if (user?.user_name) {
      setValue("name", user.user_name);
      setValue("email", user.user_email);
      setValue("createdAt", new Date(user.created_at).toLocaleDateString());
    }
  }, [user]);

  // Handle Submit
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className="flex flex-col w-ful items-center max-flex-1 gap-10 p-20 h-full font-serif justify-center">
        <h1 className="text-5xl text-white">User Profile</h1>
        <form
          className="flex flex-col w-full items-center md:w-1/2 lg:w-2/5 text-2xl"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-5 w-full max-flex-1 pb-10 bg-gray-300 shadow-md rounded-xl items-center">
            <div className="flex flex-col gap-1 w-full pl-10 pr-10 pt-10">
              <label htmlFor="email" className="text-black pl-2">
                User Name
              </label>
              <input
                type="text"
                id="email"
                readOnly={!edit}
                {...register("name", {
                  required: {
                    value: true,
                  },
                })}
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1 w-full pl-10 pr-10">
              <label htmlFor="email" className="text-black pl-2">
                User Email
              </label>
              <input
                type="text"
                id="email"
                readOnly={!edit}
                {...register("email", {
                  required: {
                    value: true,
                  },
                })}
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1 w-full pl-10 pr-10">
              <label htmlFor="email" className="text-black pl-2">
                Account Creation Date
              </label>
              <input
                type="text"
                id="email"
                readOnly
                {...register("createdAt", {
                  required: {
                    value: true,
                  },
                })}
                className="p-3 outline-none bg-slate-50 text-black rounded-xl"
              />
            </div>

            {/* <div className="flex flex-col gap-1 w-full pr-10 pl-10">
              <button
                className={`text-gray-100 outline-none text-center flex justify-center p-3 rounded-xl bg-blue-500 text-3xl`}
                type="submit"
              >
                {edit ? "Update" : "Edit"}
              </button>
            </div> */}
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
