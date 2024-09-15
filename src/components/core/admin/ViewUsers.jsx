import React from "react";
import { useQuery } from "react-query";
import { fetchUsers } from "../../utils/services/Admin.service";
import { GlobalLoader } from "../../common/Loader";
import Error from "../../common/Error";

const ViewUsers = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery("admin-users", fetchUsers, {
    select: (data) => {
      const res = data.data.users.map((val) => {
        return val;
      });

      return res;
    },
  });

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (isError) {
    console.log(error);
    return <Error />;
  }

  return <div>ViewUsers</div>;
};

export default ViewUsers;
