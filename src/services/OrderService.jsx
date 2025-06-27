import axiosClient from "../config/APIConfig.jsx";

export const createOrder = async (schoolId, cloths, deadline, note) => {
    const response = await axiosClient.post('', {
        schoolId: schoolId,
        clothList: cloths,
        deadline: deadline,
        note: note
    })

    return response || null
}