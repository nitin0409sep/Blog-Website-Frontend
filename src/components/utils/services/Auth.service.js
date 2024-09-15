import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const loginUser = async (email, password) => {
    try {
        const { data } = await axios.post(`${apiUrl}/auth/login`, { email, password });
        return data;
    } catch (error) {
        throw new Error(error);
    }
}

export const registerUser = async (requestBody) => {
    try {
        const { data } = await axios.post(`${apiUrl}/auth/register`, requestBody);
        return data;
    } catch (error) {
        throw error.response ? error.response.data?.error : new Error("Network error");
    }
};
