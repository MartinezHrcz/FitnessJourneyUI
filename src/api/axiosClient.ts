import axios, {type AxiosInstance} from "axios";

const axiosClient : AxiosInstance = axios.create({
    baseURL: 'http://localhost:9090/api',
    withCredentials: true
});

axiosClient.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default axiosClient;