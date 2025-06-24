import axiosClient from "../config/APIConfig.jsx";

export const getProfile = async () => {
    const response = await axiosClient.get("/profile/{id}");
    return response?.data || null;
}