import axiosClient from "../config/APIConfig.jsx";

// Create a new account
export const createAccount = async (accountData) => {
    const response = await axiosClient.post("/acc", accountData);
    return response ? response : null;
}

// Get account by ID
export const getAccountById = async (id) => {
    const response = await axiosClient.get(`/acc/${id}`);
    return response ? response : null;
}

// Update account by ID
export const updateAccount = async (id, accountData) => {
    const response = await axiosClient.put(`/acc/${id}`, accountData);
    return response ? response : null;
}

// Delete account by ID
export const deleteAccount = async (id) => {
    const response = await axiosClient.delete(`/acc/${id}`);
    return response ? response : null;
}

// Get all accounts
// export const getAllAccounts = async (params) => {
//     const response = await axiosClient.get("/acc", { params: params });
//     return response ? response : null;
// }
export const getAllAccounts = async () => {
    const response = await axiosClient.get("/acc");
    return response?.data || null;
}

// Get account by email
export const getAccountByEmail = async (email) => {
    const response = await axiosClient.get(`/acc/email/${email}`);
    return response ? response : null;
}