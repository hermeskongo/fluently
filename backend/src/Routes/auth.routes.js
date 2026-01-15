import express from "express";
import {login, logout, register} from "../Controllers/authController.js";

export const authRoutes = express.Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)