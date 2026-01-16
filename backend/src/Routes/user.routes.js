import express from "express";
import {isAuthenticated, isOnboarded} from "../Middlewares/auth.middleware.js";
import {
    acceptFriendRequest, getFriendRequests,
    getMyFriends, getOutGoingFriendRequests,
    getRecommendedFriends,
    sendFriendRequest
} from "../Controllers/users.controller.js";

export const userRoutes = express.Router()

userRoutes.get('/getRecommendedFriends', isAuthenticated, isOnboarded, getRecommendedFriends)
userRoutes.post('/sendFriendRequest', isAuthenticated, isOnboarded, sendFriendRequest)
userRoutes.get('/myFriends', isAuthenticated, isOnboarded, getMyFriends)
userRoutes.put('/acceptFriendRequest', isAuthenticated, isOnboarded, acceptFriendRequest)
userRoutes.get('/getFriendRequests', isAuthenticated, isOnboarded, getFriendRequests)
userRoutes.get('/getOutGoingFriendRequests', isAuthenticated, isOnboarded, getOutGoingFriendRequests)