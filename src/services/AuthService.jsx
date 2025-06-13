import axiosClient from "../config/APIConfig.jsx";

export const getGoogleUrl = async () => {
    const response = await axiosClient.get("/account/auth/google/url")
    return response ? response : null
}

export const login = async (email) => {
    const response = await axiosClient.post("/account/auth/login", {
        email: email
    })
    return response ? response : null
}