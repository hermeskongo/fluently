import express from "express";
import {getUser, login, logout, onboard, register} from "../Controllers/auth.controller.js";
import {isAuthenticated} from "../Middlewares/auth.middleware.js";

export const authRoutes = express.Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.get('/getUser', isAuthenticated, getUser)
authRoutes.post('/onboard', isAuthenticated, onboard)
authRoutes.post('/logout', logout)