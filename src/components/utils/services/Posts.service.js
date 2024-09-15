const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";
import axiosInstance from "../Interceptor/API";

// Fetch All Public Posts
export const fetchPublicPosts = async () => {
    return axios.get(`${apiUrl}/user/post/public`);
}

// Fetch All User Posts
export const fetchUserPosts = async () => {
    return axiosInstance.get(`${apiUrl}/user/post`);
}

// Add User Post
export const addUserPost = async (body) => {
    return axiosInstance.post(`${apiUrl}/user/post`, body);
}