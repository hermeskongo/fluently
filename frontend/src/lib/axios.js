import axios from "axios"
import {BACKEND_BASE_URL} from "./api.js";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api/v1",
    withCredentials: true
})