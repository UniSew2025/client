import axios from "axios";

const axiosClient = axios.create(
    {
        baseURL: "http://localhost:8080/api/v1",
        headers:{
            "Content-Type": "application/json",
        },
        withCredentials: true
    }
)

axiosClient.interceptors.request.use(
    config => {
        const userString = localStorage.getItem('user');
        let token = null;
        if (userString) {
            try {
                const user = JSON.parse(userString);
                token = user.token;
            } catch (e) {
                console.error("Error parsing user data from localStorage:", e);
                localStorage.removeItem('user');
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401 || status === 403) {
                localStorage.removeItem('user');
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient