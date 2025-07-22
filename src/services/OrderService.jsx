import axiosClient from "../config/APIConfig.jsx";

export const createOrder = async (schoolId, cloths, deadline, note) => {
    const response = await axiosClient.post('/order', {
        schoolId: schoolId,
        clothList: cloths,
        deadline: deadline,
        note: note
    })

    return response || null
}

export const viewOrders = async () => {
    const response = await axiosClient.get('/order')

    return response || null
}