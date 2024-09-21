const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";
import axiosInstance from "../interceptor/API";

// Fetch All Public Posts
export const fetchPublicPosts = async () => {
    return axios.get(`${apiUrl}/public/post`);
}

// Fetch All User Posts
export const fetchUserPosts = async () => {
    return axiosInstance.get(`${apiUrl}/user/post`);
}

// Add User Post
export const addUserPost = async (body) => {
    return axiosInstance.post(`${apiUrl}/user/post`, body);
}

// Fetch Post Data by id
export const fetchPostData = async (id) => {
    return axios.get(`${apiUrl}/public/post/${id}`);
}