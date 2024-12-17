import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
});

// Response용 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.data === '토큰에 문제가 있음 (filter)' && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/user/refresh`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    },
                );
                return axiosInstance(originalRequest);
            } catch (e) {
                console.log('refresh 만료');
                console.log(e);
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
