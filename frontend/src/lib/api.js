import { axiosInstance } from "./axios.js";

export const BACKEND_BASE_URL = 'http://localhost:5001/api/v1'

const auth_base = "/auth"
const users_base = "/users"

// Constant for simplify and scalability API CALL
export const API_PATHS = {
    AUTH: {
        LOGIN: `${auth_base}/login`,
        REGISTER: `${auth_base}/register`,
        GET_USER: `${auth_base}/getUser`,
        ONBOARD: `${auth_base}/onboard`,
        LOGOUT: `${auth_base}/logout`
    },
    USERS: {
        GET_RECOMMENDED_FRIENDS: `${users_base}/getRecommendedFriends`,
        SEND_FRIEND_REQUEST: `${users_base}/sendFriendRequest`,
        ACCEPT_FRIEND_REQUEST: `${users_base}/acceptFriendRequest`,
        MY_FRIENDS: `${users_base}/myFriends`,
        GET_FRIEND_REQUESTS: `${users_base}/getFriendRequests`,
        GET_OUT_GOING_FRIEND_REQUESTS: `${users_base}/getOutGoingFriendRequests`,
    }
}


//============= Mutation for our differents endpoints in order to use it with React-Query================


export const signup =  async (signUpData) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, signUpData)
    return response.data
}

export const login =  async (data) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, data)
    return response.data
}

export const logout =  async () => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGOUT)
    return response.data
}

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER)
        return res.data
    } catch (error) {
        console.log("Error on getting user")
        return null
    }
}

export const onboardUser = async (data) => {
    const res = await axiosInstance.post(API_PATHS.AUTH.ONBOARD, data)
    return res.data
}

export const getFriends = async () => {
    const res = await axiosInstance.get(API_PATHS.USERS.MY_FRIENDS)
    return res.data
}

export const getRecommendedUsers = async () => {
    const res = await axiosInstance.get(API_PATHS.USERS.GET_RECOMMENDED_FRIENDS)
    return res.data
}

export const getOutGoingFriendReqs = async () => {
    const res = await axiosInstance.get(API_PATHS.USERS.GET_OUT_GOING_FRIEND_REQUESTS)
    return res.data
}

export const sendFriendRequest = async (user_id) => {
    const res = await axiosInstance.post(API_PATHS.USERS.SEND_FRIEND_REQUEST, {friend_id: user_id})
    return res.data
}