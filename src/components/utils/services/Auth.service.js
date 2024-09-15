const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";

export const loginUser = async (email, password) => {
    return axios.post(`${apiUrl}/auth/login`, { email, password });
}

export const registerUser = async (requestBody) => {
    return axios.post(`${apiUrl}/auth/register`, requestBody);
};
