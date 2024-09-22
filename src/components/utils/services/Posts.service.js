const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";
import axiosInstance from "../interceptor/API";

// User

// Fetch All User Posts
export const fetchUserPosts = async () => {
    return axiosInstance.get(`${apiUrl}/user/post`);
}

// Fetch Particular User Posts
export const fetchUserPostById = async (i) => {
    return axiosInstance.get(`${apiUrl}/user/post/${id}`);
}

// Add User Post
export const addUserPost = async (body) => {
    return axiosInstance.post(`${apiUrl}/user/post`, body);
}

// Delete Post by id
export const deletePost = async (id) => {
    return axiosInstance.delete(`${apiUrl}/user/post/${id}`);
}

// Public

// Fetch All Public Posts
export const fetchPublicPosts = async () => {
    return axios.get(`${apiUrl}/public/post`);
}

// Fetch Post Data by id
export const fetchPostData = async (id) => {
    return axios.get(`${apiUrl}/public/post/${id}`);
}