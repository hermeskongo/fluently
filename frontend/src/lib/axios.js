import axios from "axios"
import {BACKEND_BASE_URL} from "./constant.js";

export const axiosInstance = axios.create({
    baseURL: BACKEND_BASE_URL,
    withCredentials: true
})