import axiosClient from "../config/APIConfig.jsx";

export const createDesignRequest = async (request) => {
    const response = await axiosClient.post("/design/", request);
    return response?.data || null;
};

export const viewListHistory = async () => {
    const response = await axiosClient.get("/design/list-request");
    return response?.data || null;
}

export const getClothByRequestId = async (requestId) => {
    const res = await axiosClient.post(`/design/cloth-list`, { requestId });
    return res?.data?.data || [];
};

export const chooseDesignPackage = async ({ designRequestId, packageId, getPackagePrice,packageName,packageHeaderContent, revisionTime, packageDeliveryDate}) => {
    const res = await axiosClient.post("/design/package", {
        designRequestId,
        packageId,
        getPackagePrice,
        packageName,
        packageHeaderContent,
        revisionTime,
        packageDeliveryDate
    });
    return res?.data || [];
}

export const getSampleImages = async () => {
    const response = await axiosClient.get("/design/sampleImage-list");
    return response?.data || null;
}

export const getAllComments = async (requestId) => {
    const response = await axiosClient.get(`/design/design-request/${requestId}/comments`);
    return response?.data || null;
}

export const getRequestById = async (id) => {
    const res = await axiosClient.post(`/design/request/${id}`);
    return res?.data || null;
};

export const getCompleteDesignRequest = async () => {
    const response = await axiosClient.get('/design/complete-list')
    return response || null;
}

export const sendComment = async (requestId, comment) => {
    const response = await axiosClient.post(`/design/comment`, {
        requestId,
        comment
    });
    return response.data || [];
}

export const getAllRequestByListPackageId = async (packageIds) => {
        const response = await axiosClient.post(`design/design-request/list-packageId`, {
            packageIds
        });
        return response.data || [];
};

export const getAllDelivery = async (id) => {
    const response = await axiosClient.get(`/design/list-delivery/${id}`);
    return response?.data || null;
}

export const submitDelivery = async (requestId, fileUrl, note, revisionId, revision ) => {
    const response = await axiosClient.post(`/design/deliveries`, {
        requestId,
        fileUrl,
        note,
        revisionId,
        revision
    });
    return response.data || [];
}
export const submitRevision = async (deliveryId, note, senderId,senderRole) => {
    const response = axiosClient.post("/design/revision", {
        deliveryId,
        note,
        senderId,
        senderRole
    });
    return response.data || [];
}

export const getRevisionUnUseList = async (requestId) =>{
    const response = await axiosClient.get(`/design/list-revision/${requestId}`);
    return response?.data || [];
}

export const makeDeliveryFinalAndRequestComplete = async (deliveryId, requestId) => {
    const response = await axiosClient.post(`design/makeFinal/${deliveryId}/${requestId}`)
    return response?.data || null;
}
export const addFinalImages = async (data) => {
    const response = await axiosClient.post("/design/final-image", data);
    return response.data || null;
}

export const getAllFinalImageByRequestId = async (id) => {
    const response = await axiosClient.get(`/design/list/final-image/${id}`);
    return response?.data || null;
}




