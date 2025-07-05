import axiosClient from "../config/APIConfig.jsx";

export const viewListDesigner = async () => {
    const response = await axiosClient.get("/profile/designer/list");
    return response?.data || null;
}

export const getPackageInfo = async (id) => {
    const response = await axiosClient.get(`/profile/package/${id}`);
    return response?.data || null;
}

export const getALlPackageByDesignerId = async (id) => {
    const response = await axiosClient.get(`/profile/designer/package/${id}`);
    return response?.data || null;
}


export const updateDesignerProfile = async (request) => {
    const response = await axiosClient.put("/profile/designer", request);
    return response?.data || null;
};