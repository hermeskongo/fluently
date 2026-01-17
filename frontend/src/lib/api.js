import {axiosInstance} from "./axios.js";

export const BACKEND_BASE_URL = 'http://localhost:5001/api/v1'

const auth_base = "/auth"
const users_base = "/users"

export const API_PATHS = {
    AUTH: {
        LOGIN: `${auth_base}/login`,
        REGISTER: `${auth_base}/register`,
        GET_USER: `${auth_base}/getUser`,
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


export const signup =  async (signUpData) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, signUpData)
    return response.data
}