import axios from "axios";

export const BACKEND_BASE_URL = 'http://localhost:5001/api/v1'

export const axiosInstance = axios.create({
    baseURL: BACKEND_BASE_URL,
    withCredentials: true
})