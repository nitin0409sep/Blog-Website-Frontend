const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";
import axiosInstance from "../interceptor/API";

// User

// Fetch All User Posts
export const fetchUserPosts = () => {
    return axiosInstance.get(`${apiUrl}/user/post`);
}

// Fetch Particular User Posts
export const fetchUserPostById = (id) => {
    return axiosInstance.get(`${apiUrl}/user/post/${id}`);
}

// Add User Post
export const addUserPost = (body) => {
    return axiosInstance.post(`${apiUrl}/user/post`, body);
}

// Delete Post by id
export const deletePost = (id) => {
    return axiosInstance.delete(`${apiUrl}/user/post/${id}`);
}

// Public

// Fetch All Public Posts
export const fetchPublicPosts = () => {
    return axios.get(`${apiUrl}/public/post`);
}

// Fetch Post Data by id
export const fetchPublicPostById = (id, user) => {
    if (user)
        return axiosInstance.get(`${apiUrl}/public/post/${id}`);
    return axios.get(`${apiUrl}/public/post/${id}`);
}

// Like Post
export const likeUnlikePost = (like, post_id) => {
    return axiosInstance.post(`${apiUrl}/user/post/likes`, { post_id, like })
}

// Comments
export const postComments = (reqBody) => {
    return axiosInstance.post(`${apiUrl}/user/post/comment`, reqBody);
}