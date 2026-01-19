import { axiosInstance } from "./axios.js";


const auth_base = "/auth"
const users_base = "/users"
const chat_base = "/chat"

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
    },
    CHAT: {
        GET_STREAM_TOKEN: `${chat_base}/token`
    }
}


//============= Mutation for our differents endpoints in order to use it with React-Query================


export const signup = async (signUpData) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, signUpData)
    console.log(response)
    return response.data
}

export const login = async (data) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, data)
    console.log(response)
    return response.data
}

export const logout = async () => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGOUT)
    console.log(response)
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
    console.log(res)
    return res.data
}

export const getFriends = async () => {
    const res = await axiosInstance.get(API_PATHS.USERS.MY_FRIENDS)
    console.log(res)
    return res.data
}

export const getRecommendedUsers = async () => {
    const res = await axiosInstance.get(API_PATHS.USERS.GET_RECOMMENDED_FRIENDS)
    console.log(res)
    return res.data
}

export const getOutGoingFriendReqs = async () => {
    const res = await axiosInstance.get(API_PATHS.USERS.GET_OUT_GOING_FRIEND_REQUESTS)
    console.log(res)
    return res.data
}

export const sendFriendRequest = async (user_id) => {
    const res = await axiosInstance.post(API_PATHS.USERS.SEND_FRIEND_REQUEST, { friend_id: user_id })
    console.log(res)
    return res.data
}

export const getFriendRequests = async () => {
    try {
        const res = await axiosInstance.get(API_PATHS.USERS.GET_FRIEND_REQUESTS)
        return res.data
    } catch (error) {
        console.log("Error query get my friends requests")
        console.log(error)
        return null
    }
}

export const acceptFriendRequest = async (friendshipId) => {
    try {
        const res = await axiosInstance.put(API_PATHS.USERS.ACCEPT_FRIEND_REQUEST, { friendshipId })
        return res.data?.friends
    } catch (error) {
        console.log("Error mutation accept friend request")
        console.log(error)
        return null
    }
}



export const getStreamToken = async () => {
    try {
        const res = await axiosInstance.get(API_PATHS.CHAT.GET_STREAM_TOKEN)
        return res.data
    } catch (error) {
        console.log("Error query: get stream token")
        return null
    }
}