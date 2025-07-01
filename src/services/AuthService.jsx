import axiosClient from "../config/APIConfig.jsx";

export const getGoogleUrl = async () => {
    const response = await axiosClient.get("/auth/google/url")
    return response ? response : null
}

export const login = async (email, avatar, name, refreshToken) => {
    const response = await axiosClient.post("/auth/login", {
        email: email,
        avatar: avatar,
        name: name,
        refreshToken: refreshToken
    })
    return response ? response : null
}