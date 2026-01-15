import express from "express";
import {getUser, login, logout, register} from "../Controllers/authController.js";
import {isAuthenticated} from "../Middlewares/auth.middleware.js";

export const authRoutes = express.Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.get('/getUser', isAuthenticated, getUser)
authRoutes.post('/logout', logout)