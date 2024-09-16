import axios, { AxiosInstance } from "axios";
import { InternalAxiosRequestConfig } from "axios";
//https://api.ploi.com.br/api
const instance: AxiosInstance = axios.create({
    baseURL: 'https://api.ploi.com.br/api',
    withCredentials: true
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config;
});

export default instance;