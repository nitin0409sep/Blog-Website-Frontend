import axiosInstance from "../interceptor/API"
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchUserProfile = () => {
    return axiosInstance.get(`${apiUrl}/user/userProfile`);
}