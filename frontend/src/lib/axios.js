import axios from "axios";

export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL

console.log(import.meta.env.VITE_BACKEND_URL)

export const axiosInstance = axios.create({
    baseURL: BACKEND_BASE_URL,
    withCredentials: true
})