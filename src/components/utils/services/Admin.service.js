import axiosInstance from "../interceptor/API";
const apiUrl = import.meta.env.VITE_API_URL;

// Fetch All Users Created By Admin
export const fetchUsers = async () => {
    return axiosInstance.get(`${apiUrl}/admin/userList`);
}